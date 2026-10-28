import { apiClient } from '@/lib/api'

export interface Candidate {
  id: number
  full_name: string
  application_id: string
  email: string | null
  status: string
  documents_count: number
  created_at: string
  updated_at: string
}

export interface CandidateListResponse {
  items: Candidate[]
  total: number
  skip: number
  limit: number
}

export interface VerificationCase {
  id: number
  candidate_id: number
  candidate_name: string | null
  status: string
  overall_match: boolean | null
  match_count: number
  total_fields: number
  message: string | null
  created_at: string
  updated_at: string
}

export interface CaseListResponse {
  items: VerificationCase[]
  total: number
  skip: number
  limit: number
}

export interface DashboardMetrics {
  total_candidates: number
  total_cases: number
  cases_awaiting_review: number
  matched_cases: number
  mismatch_cases: number
}

export interface Document {
  id: number
  candidate_id: number
  verification_case_id: number | null
  file_name: string
  file_type: string
  file_size: number
  storage_path: string
  status: string
  created_at: string
  updated_at: string
}

export interface DocumentListResponse {
  items: Document[]
  total: number
  skip: number
  limit: number
}

export interface AuditLog {
  id: number
  actor: string
  action: string
  case_id: number | null
  metadata_json: string | null
  created_at: string
  updated_at: string
}

export interface AuditLogListResponse {
  items: AuditLog[]
  total: number
  skip: number
  limit: number
}

export const candidateService = {
  async createCandidate(
    fullName: string,
    applicationId: string,
    email?: string,
  ): Promise<Candidate> {
    const response = await apiClient.post('/candidates/', {
      full_name: fullName,
      application_id: applicationId,
      email,
    })
    return response.data
  },

  async getCandidate(id: number): Promise<Candidate> {
    const response = await apiClient.get(`/candidates/${id}`)
    return response.data
  },

  async listCandidates(
    skip = 0,
    limit = 50,
    search?: string,
    status?: string,
  ): Promise<CandidateListResponse> {
    const params: Record<string, string> = {}
    if (skip) params.skip = String(skip)
    if (limit) params.limit = String(limit)
    if (search) params.search = search
    if (status) params.status = status
    const response = await apiClient.get('/candidates/', { params })
    return response.data
  },
}

export const caseService = {
  async listCases(
    skip = 0,
    limit = 50,
    status?: string,
    candidateId?: number,
  ): Promise<CaseListResponse> {
    const params: Record<string, string> = {}
    if (skip) params.skip = String(skip)
    if (limit) params.limit = String(limit)
    if (status) params.status = status
    if (candidateId) params.candidate_id = String(candidateId)
    const response = await apiClient.get('/cases/', { params })
    return response.data
  },

  async getCase(id: number): Promise<VerificationCase> {
    const response = await apiClient.get(`/cases/${id}`)
    return response.data
  },

  async updateCase(
    id: number,
    updates: {
      status?: string
      overall_match?: boolean
      message?: string
    },
  ): Promise<VerificationCase> {
    const response = await apiClient.patch(`/cases/${id}`, updates)
    return response.data
  },
}

export const dashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const response = await apiClient.get('/dashboard/metrics')
    return response.data
  },
}

export const documentService = {
  async listDocuments(
    skip = 0,
    limit = 50,
    caseId?: number,
  ): Promise<DocumentListResponse> {
    const params: Record<string, string> = {}
    if (skip) params.skip = String(skip)
    if (limit) params.limit = String(limit)
    if (caseId) params.case_id = String(caseId)
    const response = await apiClient.get('/documents/', { params })
    return response.data
  },
}

export const auditLogService = {
  async listAuditLogs(
    skip = 0,
    limit = 100,
    caseId?: number,
  ): Promise<AuditLogListResponse> {
    const params: Record<string, string> = {}
    if (skip) params.skip = String(skip)
    if (limit) params.limit = String(limit)
    if (caseId) params.case_id = String(caseId)
    const response = await apiClient.get('/audit-logs/', { params })
    return response.data
  },
}
