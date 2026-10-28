import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { auditLogService, AuditLogListResponse } from '@/services/api'

export function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogListResponse['items']>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setLoading(true)
    try {
      const response = await auditLogService.listAuditLogs(0, 100)
      setLogs(response.items)
      setTotal(response.total)
    } catch (err) {
      console.error('Failed to load audit logs:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='page-title'>Audit Logs</h1>
          <p className='page-subtitle'>
            Review the audit trail of verification actions.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>{total} logged verification system actions.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='empty-state'>
              <div className='mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin'>
                <svg className='h-full w-full' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>Loading audit entries...</h3>
            </div>
          ) : logs.length === 0 ? (
            <div className='empty-state'>
              <div className='mx-auto h-12 w-12 text-gray-400 mb-4'>
                <svg className='h-full w-full' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>No audit entries</h3>
              <p className='text-sm text-muted-foreground'>
                Audit entries appear as verification actions are performed.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-border text-left text-xs font-medium text-muted-foreground'>
                    <th className='p-4'>Actor</th>
                    <th className='p-4'>Action</th>
                    <th className='p-4'>Case ID</th>
                    <th className='p-4'>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className='border-b border-border'>
                      <td className='p-4'>{log.actor}</td>
                      <td className='p-4 font-mono'>{log.action}</td>
                      <td className='p-4'>
                        {log.case_id ? `VC-${String(log.case_id).padStart(4, '0')}` : '—'}
                      </td>
                      <td className='p-4 text-muted-foreground'>
                        {new Date(log.created_at).toLocaleString()}
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
