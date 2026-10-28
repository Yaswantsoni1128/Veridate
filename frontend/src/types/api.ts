export interface Candidate {
  id: string
  fullName: string
  applicationId: string
  status: 'pending' | 'processing' | 'matched' | 'mismatch' | 'review_required' | 'unverifiable'
  documentsCount: number
  createdAt: string
  updatedAt: string
}

export interface VerificationCase {
  id: string
  candidateId: string
  candidateName: string
  status: 'pending' | 'processing' | 'completed' | 'review_required'
  overallMatch: boolean | null
  matchCount: number
  totalFields: number
  createdAt: string
  updatedAt: string
}

export interface Document {
  id: string
  caseId: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedAt: string
  status: 'uploaded' | 'processed' | 'failed'
}

export interface AuditLog {
  id: string
  actor: string
  action: string
  caseId: string | null
  metadata: Record<string, unknown>
  createdAt: string
}

export interface ApiError {
  message: string
  statusCode?: number
  details?: unknown
}
