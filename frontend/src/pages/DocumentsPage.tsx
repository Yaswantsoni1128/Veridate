import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { documentService, DocumentListResponse } from '@/services/api'

export function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentListResponse['items']>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadDocuments()
  }, [search])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const response = await documentService.listDocuments(0, 50)
      setDocuments(response.items)
      setTotal(response.total)
    } catch (err) {
      console.error('Failed to load documents:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='page-title'>Documents</h1>
          <p className='page-subtitle'>
            Review uploaded documents and their extraction results.
          </p>
        </div>
      </div>

      <div className='flex items-center gap-4 mb-6'>
        <div className='relative w-64'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <input
            placeholder='Search documents...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10'
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Library</CardTitle>
          <CardDescription>{total} uploaded documents across verification cases.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='empty-state'>
              <div className='mx-auto h-12 w-12 text-gray-400 mb-4 animate-spin'>
                <svg className='h-full w-full' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>Loading documents...</h3>
            </div>
          ) : documents.length === 0 ? (
            <div className='empty-state'>
              <div className='mx-auto h-12 w-12 text-gray-400 mb-4'>
                <svg className='h-full w-full' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
              </div>
              <h3 className='text-sm font-semibold text-gray-900 mb-2'>No documents uploaded</h3>
              <p className='text-sm text-muted-foreground'>
                Documents appear here once verification cases are created.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-border text-left text-xs font-medium text-muted-foreground'>
                    <th className='p-4'>File Name</th>
                    <th className='p-4'>Type</th>
                    <th className='p-4'>Size</th>
                    <th className='p-4'>Status</th>
                    <th className='p-4'>Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d) => (
                    <tr key={d.id} className='border-b border-border'>
                      <td className='p-4 font-medium'>{d.file_name}</td>
                      <td className='p-4'>{d.file_type}</td>
                      <td className='p-4'>{(d.file_size / (1024 * 1024)).toFixed(2)} MB</td>
                      <td className='p-4'>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          d.status === 'processed'
                            ? 'bg-green-100 text-green-800'
                            : d.status === 'uploaded'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className='p-4 text-muted-foreground'>
                        {new Date(d.created_at).toLocaleDateString()}
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
