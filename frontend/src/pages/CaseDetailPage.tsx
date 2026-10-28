import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function CaseDetailPage() {
  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='page-title'>Case Details</h1>
          <p className='page-subtitle'>
            Review verification results and field-level comparisons.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>VC-2024-001</CardTitle>
              <CardDescription>John Doe • Application ID: APP-8842</CardDescription>
            </div>
            <Badge variant='warning'>Review Required</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='flex flex-col items-center gap-2 text-center'>
              <div className='h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-medium'>
                2/3
              </div>
              <div className='text-xs text-muted-foreground'>Fields Matched</div>
            </div>
            <div className='flex flex-col items-center gap-2 text-center'>
              <div className='h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium'>
                1
              </div>
              <div className='text-xs text-muted-foreground'>Document</div>
            </div>
            <div className='flex flex-col items-center gap-2 text-center'>
              <div className='h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium'>
                P
              </div>
              <div className='text-xs text-muted-foreground'>Processing</div>
            </div>
            <div className='flex flex-col items-center gap-2 text-center'>
              <div className='h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium'>
                —
              </div>
              <div className='text-xs text-muted-foreground'>Issuer</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Field Comparisons</CardTitle>
          <CardDescription>OCR extracted values compared against submitted data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-border text-left text-xs font-medium text-muted-foreground'>
                  <th className='p-4'>Field</th>
                  <th className='p-4'>Submitted</th>
                  <th className='p-4'>Extracted</th>
                  <th className='p-4'>Similarity</th>
                  <th className='p-4'>Result</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-border'>
                  <td className='p-4 font-medium'>Full Name</td>
                  <td className='p-4 font-mono'>John Doe</td>
                  <td className='p-4 font-mono'>John Doe</td>
                  <td className='p-4'>100%</td>
                  <td className='p-4'>
                    <Badge variant='success'>Match</Badge>
                  </td>
                </tr>
                <tr className='border-b border-border'>
                  <td className='p-4 font-medium'>PAN Number</td>
                  <td className='p-4 font-mono'>ABCDE1234F</td>
                  <td className='p-4 font-mono'>Not found</td>
                  <td className='p-4'>0%</td>
                  <td className='p-4'>
                    <Badge variant='destructive'>Mismatch</Badge>
                  </td>
                </tr>
                <tr className='border-b border-border'>
                  <td className='p-4 font-medium'>Aadhaar Number</td>
                  <td className='p-4 font-mono'>1234****5678</td>
                  <td className='p-4 font-mono'>Not found</td>
                  <td className='p-4'>0%</td>
                  <td className='p-4'>
                    <Badge variant='destructive'>Mismatch</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
