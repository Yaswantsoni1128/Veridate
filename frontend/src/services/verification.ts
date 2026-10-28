import type { VerificationResponse } from '@/types/index'
import { apiClient } from '@/lib/api'

export interface VerifyDocumentInput {
  fullName: string
  panNumber: string
  aadhaarNumber: string
  document: File
}

export const verificationService = {
  async verifyDocument(
    input: VerifyDocumentInput,
  ): Promise<VerificationResponse> {
    const formData = new FormData()
    formData.append('full_name', input.fullName)
    formData.append('pan_number', input.panNumber)
    formData.append('aadhaar_number', input.aadhaarNumber)
    formData.append('document', input.document)

    const response = await apiClient.post<VerificationResponse>(
      '/verify-document',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get<{ status: string }>('/health')
    return response.data
  },
}
