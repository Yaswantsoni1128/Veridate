import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useApiQuery } from '@/hooks/useApi'
import { dashboardService, DashboardMetrics } from '@/services/api'

export function ReportsPage() {
  const { data: metrics, isLoading } = useApiQuery<DashboardMetrics>(
    ['reports-metrics'],
    dashboardService.getMetrics,
  )

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='page-title'>Reports</h1>
          <p className='page-subtitle'>
            Generate and download verification reports.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Summary</CardTitle>
          <CardDescription>Export detailed reports for compliance and audit purposes.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='empty-state'>
              <div className='mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin'>
                <svg className='h-full w-full' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2z' />
                </svg>
              </div>
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>Loading report data...</h3>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-sm font-semibold text-gray-900 mb-4'>Case Statistics</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Total Verification Cases</span>
                    <span className='font-medium'>{metrics?.total_cases ?? 0}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Matched Cases</span>
                    <span className='font-medium text-green-600'>{metrics?.matched_cases ?? 0}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Mismatch Cases</span>
                    <span className='font-medium text-red-600'>{metrics?.mismatch_cases ?? 0}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Awaiting Review</span>
                    <span className='font-medium text-amber-600'>{metrics?.cases_awaiting_review ?? 0}</span>
                  </div>
                </div>
              </div>
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-sm font-semibold text-gray-900 mb-4'>Important Notice</h3>
                <p className='text-sm text-gray-600 mb-4'>
                  Reports reflect OCR-based field matching results only. They do not
                  constitute official issuer verification. A similarity score is not
                  a probability of document authenticity.
                </p>
                <button
                  className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium'
                >
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
