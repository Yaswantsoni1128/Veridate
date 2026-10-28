import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'

export const queryKeys = {
  health: ['health'],
  candidates: ['candidates'],
  candidate: (id: string | number) => ['candidates', id],
  cases: ['cases'],
  case: (id: string | number) => ['cases', id],
  documents: ['documents'],
  reports: ['reports'],
  auditLogs: ['audit-logs'],
}

export function useApiQuery<TData, TError = Error>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  })
}

export function useApiMutation<TData, TError, TVariables, TContext>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Parameters<typeof useMutation<TData, TError, TVariables, TContext>>[1],
) {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    ...options,
  })
}

export { useQuery, useQueryClient }
