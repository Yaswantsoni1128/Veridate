import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BarChart3,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { useApiQuery } from '@/hooks/useApi'
import { dashboardService, DashboardMetrics } from '@/services/api'
import { cn } from '@/lib/utils'

const metricIcons = {
  'total-candidates': { Icon: Users, color: 'bg-blue-500 text-blue-600' },
  'total-cases': { Icon: FileText, color: 'bg-purple-500 text-purple-600' },
  'awaiting-review': { Icon: Clock, color: 'bg-amber-500 text-amber-600' },
  matches: { Icon: CheckCircle2, color: 'bg-green-500 text-green-600' },
}

export function OverviewPage() {
  const { data: metrics, isLoading } = useApiQuery<DashboardMetrics>(
    ['dashboard-metrics'],
    dashboardService.getMetrics,
    { refetchInterval: 30000 },
  )

  const metricsData = [
    {
      key: 'total-candidates',
      title: 'Total Candidates',
      value: metrics?.total_candidates ?? 0,
      change: '+0%',
      changeType: 'neutral' as const,
    },
    {
      key: 'total-cases',
      title: 'Verification Cases',
      value: metrics?.total_cases ?? 0,
      change: '+0%',
      changeType: 'neutral' as const,
    },
    {
      key: 'awaiting-review',
      title: 'Awaiting Review',
      value: metrics?.cases_awaiting_review ?? 0,
      change: '+0%',
      changeType: 'warning' as const,
    },
    {
      key: 'matches',
      title: 'Matches',
      value: metrics?.matched_cases ?? 0,
      change: '+0%',
      changeType: 'success' as const,
    },
  ]

  return (
    <div className='space-y-8 max-w-7xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 mb-1'>Overview</h1>
          <p className='text-gray-500'>
            Real-time view of your verification operations and key metrics.
          </p>
        </div>
<button
  onClick={() => (window.location.href = '/verification-cases/create')}
  className='flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all duration-200 text-sm font-semibold'
>
  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 4v16m8-8H4' />
  </svg>
  New Verification
</button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {metricsData.map((m) => {
          const { Icon, color } = metricIcons[m.key as keyof typeof metricIcons]
          return (
            <MetricCard
              key={m.key}
              title={m.title}
              value={m.value}
              change={m.change}
              changeType={m.changeType}
              Icon={Icon}
              color={color}
              loading={isLoading}
            />
          )
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <Card className='overflow-hidden shadow-sm border-border'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Recent Verification Activity</CardTitle>
                  <CardDescription>Latest cases processed through the system.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='h-64 flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
                </div>
              ) : metrics?.total_cases === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
                  <AlertCircle className='mb-3 h-8 w-8' />
                  <p className='font-medium text-gray-600'>No activity yet</p>
                  <p className='text-sm'>Create your first verification case to see activity here.</p>
                </div>
              ) : (
                <div className='text-sm text-gray-500'>
                  Recent activity will display here once cases are processed.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className='overflow-hidden shadow-sm border-border'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold'>Verification Outcomes</CardTitle>
                  <CardDescription>Distribution of verification results over time.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='h-64 flex items-center justify-center'>
              <div className='flex flex-col items-center justify-center text-gray-400'>
                <BarChart3 className='mb-3 h-8 w-8' />
                <p className='font-medium text-gray-600'>No data available</p>
                <p className='text-sm'>Verification outcome charts will appear once cases are processed.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  changeType,
  Icon,
  color,
  loading,
}: {
  title: string
  value: number
  change: string
  changeType: 'success' | 'warning' | 'neutral'
  Icon: any
  color: string
  loading: boolean
}) {
  const changeColors = {
    success: 'text-green-600 bg-green-50',
    warning: 'text-amber-600 bg-amber-50',
    neutral: 'text-blue-600 bg-blue-50',
  }

  return (
    <Card className='overflow-hidden shadow-sm border-border group'>
      <CardHeader className='flex flex-row items-center justify-between pb-3 pt-4'>
        <div className='flex-1'>
          <CardTitle className='text-sm font-medium text-gray-500 mb-1 whitespace-nowrap'>{title}</CardTitle>
          <div className='text-2xl font-bold text-gray-900'>{loading ? '—' : value}</div>
        </div>
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', color)}>
          <Icon className='h-5 w-5' />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn('flex items-center mt-2', changeColors[changeType])}>
          <svg className='h-3 w-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
            {changeType === 'success' ? (
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
            ) : changeType === 'warning' ? (
              <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.552 2.98H4.72c-1.339 0-2.302-1.646-1.552-2.98l5.58-9.92zM9.75 3.029L8.5 9.875h3l1.25-6.846z' clipRule='evenodd' />
            ) : (
              <path d='M4 3a2 2 0 00-2 2v1a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z' />
            )}
          </svg>
          <span className='text-xs font-medium whitespace-nowrap'>{change}</span>
        </div>
      </CardContent>
    </Card>
  )
}
