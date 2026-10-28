import { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { verificationService, VerifyDocumentInput } from '@/services/verification'
import { queryKeys } from '@/hooks/useApi'
import type { VerificationResponse } from '@/types/index'

interface UseVerifyDocumentReturn {
  verify: (input: VerifyDocumentInput) => Promise<void>
  data: VerificationResponse | null
  isLoading: boolean
  error: string | null
  reset: () => void
}

export function useVerifyDocument(): UseVerifyDocumentReturn {
  const queryClient = useQueryClient()
  const [result, setResult] = useState<VerificationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: verificationService.verifyDocument,
    onSuccess: (data) => {
      setResult(data)
      setError(null)
      queryClient.invalidateQueries({ queryKey: queryKeys.cases })
    },
    onError: (err: Error) => {
      setError(err.message || 'Verification failed. Please try again.')
      setResult(null)
    },
  })

  const verify = useCallback(
    async (input: VerifyDocumentInput) => {
      setError(null)
      setResult(null)
      await mutation.mutateAsync(input)
    },
    [mutation],
  )

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    mutation.reset()
  }, [mutation])

  return {
    verify,
    data: result,
    isLoading: mutation.isPending,
    error,
    reset,
  }
}
