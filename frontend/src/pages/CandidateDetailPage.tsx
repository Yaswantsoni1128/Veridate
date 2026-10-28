import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { caseService, VerificationCase } from '@/services/api'

export function CandidateDetailPage() {
  const [candidateId, setCandidateId] = useState<number | null>(null)
  const [caseData, setCaseData] = useState<VerificationCase | null>(null)
  const [loading, setLoading] = useState(false)

  // In a real app, this would come from route params
  // For now, we allow manual entry of a case ID
  const loadCase = async () => {
    if (!candidateId) return
    setLoading(true)
    try {
      const response = await caseService.listCases(0, 1, undefined, candidateId)
      const cases = response.items
      if (cases.length > 0) {
        setCaseData(cases[0])
      }
    } catch (err) {
      console.error('Failed to load case:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCase()
  }, [candidateId])

  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='page-title'>Candidate Details</h1>
          <p className='page-subtitle'>
            View candidate profile and verification history.
          </p>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <label className='text-sm font-medium text-gray-700'>Candidate ID:</label>
          <input
            type='number'
            value={candidateId ?? ''}
            onChange={(e) => setCandidateId(e.target.value ? parseInt(e.target.value) : null)}
            className='w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent>
            <div className='text-center py-8'>
              <div className='animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4' />
              <p className='text-sm text-gray-600'>Loading candidate details...</p>
            </div>
          </CardContent>
        </Card>
      ) : caseData ? (
        <Card>
          <CardHeader>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-medium'>
                {'JD'}
              </div>
              <div>
                <CardTitle>Candidate #{candidateId}</CardTitle>
                <CardDescription>Verification Case #{caseData.id}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <h3 className='text-sm font-medium text-gray-900'>Case Status</h3>
                <p className={`text-sm ${caseData.status === 'review_required' ? 'text-amber-600' : caseData.overall_match ? 'text-green-600' : 'text-red-600'}`}>
                  {caseData.status.replace('_', ' ')}
                </p>
              </div>
              <div className='space-y-4'>
                <h3 className='text-sm font-medium text-gray-900'>Match Score</h3>
                <p className='text-sm text-gray-600'>
                  {caseData.match_count} out of {caseData.total_fields} fields matched
                </p>
              </div>
            </div>
            <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
              <h3 className='text-sm font-medium text-gray-900 mb-2'>Case Message</h3>
              <p className='text-sm text-gray-600'>{caseData.message}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <div className='text-center py-8'>
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>No case found</h3>
              <p className='text-sm text-muted-foreground'>
                Enter a candidate ID to look up their verification case.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
