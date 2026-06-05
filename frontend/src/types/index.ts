/**
 * TypeScript type definitions for the document verification application
 */

export interface FormData {
  fullName: string
  panNumber: string
  aadhaarNumber: string
}

export interface ExtractionResult {
  raw_text: string | null
  extracted_name: string | null
  extracted_pan: string | null
  extracted_aadhaar: string | null
}

export interface MatchResult {
  field: string
  matched: boolean
  similarity_score: number
  form_value: string
  extracted_value: string
}

export interface VerificationResponse {
  overall_match: boolean
  match_count: number
  total_fields: number
  extraction_result: ExtractionResult
  match_results: MatchResult[]
  message: string
}

export interface StepData {
  currentStep: number
  formData: FormData
  uploadedFile: File | null
}
