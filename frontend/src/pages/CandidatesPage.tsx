import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Users, Search, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { candidateService, CandidateListResponse } from '@/services/api'

export function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateListResponse['items']>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadCandidates()
  }, [search, statusFilter])

  const loadCandidates = async () => {
    setLoading(true)
    try {
      const response = await candidateService.listCandidates(
        0,
        50,
        search || undefined,
        statusFilter || undefined,
      )
      setCandidates(response.items)
      setTotal(response.total)
    } catch (err) {
      console.error('Failed to load candidates:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='page-title'>Candidates</h1>
          <p className='page-subtitle'>
            Manage candidate profiles and their verification status.
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/verification-cases/create'}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2'
        >
          <Plus className='h-4 w-4' />
          Add Candidate
        </button>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative w-64'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <input
            placeholder='Search by name or application ID...'
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
          <option value='matched'>Matched</option>
          <option value='mismatch'>Mismatch</option>
          <option value='review_required'>Review Required</option>
          <option value='unverifiable'>Unverifiable</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidate List</CardTitle>
          <CardDescription>
            {total} candidates. PAN and Aadhaar numbers are masked in this view.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='empty-state'>
              <Users className='mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin' />
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>Loading candidates...</h3>
            </div>
          ) : candidates.length === 0 ? (
            <div className='empty-state'>
              <Users className='mx-auto h-12 w-12 text-gray-400 mb-4' />
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>No candidates found</h3>
              <p className='text-sm text-muted-foreground'>
                Create a verification case to add candidates.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-border text-left text-xs font-medium text-muted-foreground'>
                    <th className='p-4'>Candidate</th>
                    <th className='p-4'>Application ID</th>
                    <th className='p-4'>Documents</th>
                    <th className='p-4'>Status</th>
                    <th className='p-4'>Updated</th>
                    <th className='p-4 text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr key={c.id} className='border-b border-border'>
                      <td className='p-4'>
                        <div className='flex items-center gap-3'>
                          <div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium'>
                            {c.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className='font-medium'>{c.full_name}</p>
                            <p className='text-xs text-muted-foreground'>{c.application_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className='p-4 font-mono'>{c.application_id}</td>
                      <td className='p-4'>{c.documents_count} documents</td>
                      <td className='p-4'>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          c.status === 'review_required'
                            ? 'bg-amber-100 text-amber-800'
                            : c.status === 'matched'
                            ? 'bg-green-100 text-green-800'
                            : c.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className='p-4 text-muted-foreground'>
                        {new Date(c.updated_at).toLocaleDateString()}
                      </td>
                      <td className='p-4 text-right'>
                        <button
                          onClick={() => window.location.href = `/candidates/${c.id}`}
                          className='px-3 py-1 text-sm text-blue-600 hover:text-blue-700'
                        >
                          View
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
