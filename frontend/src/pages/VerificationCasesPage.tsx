import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileText, Search, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { caseService, CaseListResponse } from '@/services/api'

export function VerificationCasesPage() {
  const [cases, setCases] = useState<CaseListResponse['items']>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadCases()
  }, [search, statusFilter])

  const loadCases = async () => {
    setLoading(true)
    try {
      const response = await caseService.listCases(
        0,
        50,
        statusFilter || undefined,
      )
      setCases(response.items)
      setTotal(response.total)
    } catch (err) {
      console.error('Failed to load cases:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='page-title'>Verification Cases</h1>
          <p className='page-subtitle'>
            Track and manage document verification cases.
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/verification-cases/create'}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2'
        >
          <Plus className='h-4 w-4' />
          Create Case
        </button>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative w-64'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <input
            placeholder='Search cases...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10'
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        >
          <option value=''>All statuses</option>
          <option value='pending'>Pending</option>
          <option value='processing'>Processing</option>
          <option value='completed'>Completed</option>
          <option value='review_required'>Review Required</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Cases</CardTitle>
          <CardDescription>{total} cases in the verification pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='empty-state'>
              <FileText className='mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin' />
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>Loading cases...</h3>
            </div>
          ) : cases.length === 0 ? (
            <div className='empty-state'>
              <FileText className='mx-auto h-12 w-12 text-gray-400 mb-4' />
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>No verification cases</h3>
              <p className='text-sm text-muted-foreground'>
                Start by creating a new verification case.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-border text-left text-xs font-medium text-muted-foreground'>
                    <th className='p-4'>Case ID</th>
                    <th className='p-4'>Candidate</th>
                    <th className='p-4'>Status</th>
                    <th className='p-4'>Match Score</th>
                    <th className='p-4'>Created</th>
                    <th className='p-4 text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.id} className='border-b border-border'>
                      <td className='p-4 font-mono'>VC-{String(c.id).padStart(4, '0')}</td>
                      <td className='p-4'>{c.candidate_name || 'Unknown'}</td>
                      <td className='p-4'>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          c.status === 'review_required'
                            ? 'bg-amber-100 text-amber-800'
                            : c.status === 'completed' && c.overall_match
                            ? 'bg-green-100 text-green-800'
                            : c.status === 'completed' && !c.overall_match
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className='p-4'>
                        {c.match_count}/{c.total_fields} fields
                      </td>
                      <td className='p-4 text-muted-foreground'>
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className='p-4 text-right'>
                        <button
                          onClick={() => window.location.href = `/verification-cases/${c.id}`}
                          className='px-3 py-1 text-sm text-blue-600 hover:text-blue-700'
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
