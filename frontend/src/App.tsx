import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/auth'
import { Router } from '@/routes/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export function AppWithProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        {import.meta.env.DEBUG === 'true' && <ReactQueryDevtools initialIsOpen={false} />}
      </AuthProvider>
    </QueryClientProvider>
  )
}
