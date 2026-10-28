import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SettingsPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='page-title'>Settings</h1>
        <p className='page-subtitle'>
          Configure organization and verification preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <div className='h-5 w-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center'>
              <svg className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <CardTitle>Organization Settings</CardTitle>
          </div>
          <CardDescription>Manage workspace details and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-sm font-medium text-gray-900'>Organization Name</h3>
              <p className='text-sm text-muted-foreground'>
                VeriHire Demo Organization
              </p>
            </div>
            <div className='space-y-4'>
              <h3 className='text-sm font-medium text-gray-900'>Verification Threshold</h3>
              <p className='text-sm text-muted-foreground'>
                80% similarity threshold for field matching
              </p>
            </div>
            <div className='space-y-4'>
              <h3 className='text-sm font-medium text-gray-900'>Minimum Match Count</h3>
              <p className='text-sm text-muted-foreground'>
                At least 2 of 3 fields must match
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <div className='h-5 w-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center'>
              <svg className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <CardTitle>Provider Integrations</CardTitle>
          </div>
          <CardDescription>Official verification provider connections.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-sm font-medium text-gray-900'>DigiLocker / NAD</h3>
                <p className='text-xs text-muted-foreground'>
                  Not configured
                </p>
              </div>
              <div className='px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium'>
                Not configured
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
