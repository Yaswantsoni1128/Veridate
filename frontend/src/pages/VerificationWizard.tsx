import { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ShieldAlert, FileText, Clock } from 'lucide-react'

type Step =
  | 'candidate-details'
  | 'document-select'
  | 'enter-details'
  | 'review'
  | 'results'

const STEP_LABELS: Record<Step, string> = {
  'candidate-details': 'Candidate Details',
  'document-select': 'Select Documents',
  'enter-details': 'Enter Details',
  review: 'Review & Submit',
  results: 'Results',
}

const steps: Step[] = [
  'candidate-details',
  'document-select',
  'enter-details',
  'review',
  'results',
]

interface VerificationWizardProps {
  onComplete: (result: VerificationResult) => void
}

interface VerificationResult {
  overall_match: boolean
  match_count: number
  total_fields: number
  message: string
  extraction_result: {
    raw_text: string | null
    extracted_name: string | null
    extracted_pan: string | null
    extracted_aadhaar: string | null
  }
  match_results: Array<{
    field: string
    matched: boolean
    similarity_score: number
    form_value: string
    extracted_value: string
  }>
}

export function VerificationWizard({ onComplete }: VerificationWizardProps) {
  const [step, setStep] = useState<Step>('candidate-details')
  const [formData, setFormData] = useState({
    fullName: '',
    applicationId: '',
    email: '',
    panNumber: '',
    aadhaarNumber: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentStepIndex = steps.indexOf(step)

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1])
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1])
    }
  }

  const handleVerify = async () => {
    if (!selectedFile) {
      setVerifyError('Please select a document to upload.')
      return
    }

    setIsVerifying(true)
    setVerifyError(null)

    try {
      const fd = new FormData()
      fd.append('full_name', formData.fullName)
      fd.append('pan_number', formData.panNumber)
      fd.append('aadhaar_number', formData.aadhaarNumber)
      fd.append('document', selectedFile)

      const response = await fetch('http://localhost:8000/verify-document', {
        method: 'POST',
        body: fd,
      })

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`)
      }

      const result: VerificationResult = await response.json()
      setIsVerifying(false)
      onComplete(result)
      setStep('results')
    } catch (err) {
      setIsVerifying(false)
      setVerifyError(
        err instanceof Error ? err.message : 'Verification failed. Please try again.'
      )
    }
  }

  const handleFileSelect = (file: File) => {
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/tiff',
      'application/pdf',
    ]
    if (!validTypes.includes(file.type)) {
      setUploadError(
        'Please upload a valid image (JPG, PNG, BMP, TIFF) or PDF file.'
      )
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB.')
      return
    }
    setSelectedFile(file)
    setUploadError(null)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadError(null)
  }

  const isStepValid = () => {
    switch (step) {
      case 'candidate-details':
        return formData.fullName.trim().length >= 3
      case 'document-select':
        return !!selectedFile
      case 'enter-details':
        return (
          /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber) &&
          /^\d{12}$/.test(formData.aadhaarNumber.replace(/\s/g, ''))
        )
      default:
        return true
    }
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Create Verification Case
          </h1>
          <p className='text-gray-600'>
            Verify documents against candidate-submitted information
          </p>
        </div>
      </div>

      <div className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          {steps.map((s, idx) => (
            <div key={s} className='flex flex-col items-center'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                  currentStepIndex >= idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {idx + 1}
              </div>
              <span className='text-xs text-gray-600 uppercase tracking-wider'>
                {STEP_LABELS[s]}
              </span>
            </div>
          ))}
        </div>
        <div className='flex gap-2 h-1 mt-2'>
          {steps.slice(0, -1).map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full ${
                currentStepIndex > idx
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <Card>
        {step === 'candidate-details' && (
          <>
            <CardHeader>
              <CardTitle>Step 1: Candidate Details</CardTitle>
              <CardDescription>
                Enter the candidate information to begin verification.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Full Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder='Enter candidate full name'
                    className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Application ID
                  </label>
                  <input
                    type='text'
                    value={formData.applicationId}
                    onChange={(e) =>
                      setFormData({ ...formData, applicationId: e.target.value })
                    }
                    placeholder='e.g., APP-2024-001'
                    className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Email Address
                </label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder='candidate@example.com'
                  className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className='flex justify-between'>
                <button className='px-4 py-2 text-gray-600'>Cancel</button>
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isStepValid()
                      ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Select Documents &rarr;
                </button>
              </div>
            </CardFooter>
          </>
        )}

        {step === 'document-select' && (
          <>
            <CardHeader>
              <CardTitle>Step 2: Select Documents</CardTitle>
              <CardDescription>
                Upload the document to verify against candidate details.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/jpeg,image/png,image/bmp,image/tiff,.pdf'
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(file)
                  }}
                  className='hidden'
                />
                {selectedFile ? (
                  <>
                    <div className='text-green-600 mb-2'>
                      <svg className='w-12 h-12 mx-auto' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                      </svg>
                    </div>
                    <p className='text-lg font-semibold text-gray-900'>
                      {selectedFile.name}
                    </p>
                    <p className='text-sm text-gray-600 mt-2'>
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      onClick={handleRemoveFile}
                      className='mt-4 text-sm text-red-600 hover:text-red-700'
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <div className='text-gray-400 mb-2'>
                      <svg className='w-12 h-12 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10' />
                      </svg>
                    </div>
                    <p className='text-lg font-semibold text-gray-900'>
                      Drag and drop your file here
                    </p>
                    <p className='text-sm text-gray-600 mt-2'>
                      or click to select from your computer
                    </p>
                    <p className='text-xs text-gray-500 mt-4'>
                      Supported: JPG, PNG, BMP, TIFF, PDF (Max 10MB)
                    </p>
                  </>
                )}
              </div>
              {uploadError && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                  {uploadError}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className='flex justify-between'>
                <button
                  onClick={prevStep}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800'
                >
                  &larr; Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedFile}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    selectedFile
                      ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Enter Details &rarr;
                </button>
              </div>
            </CardFooter>
          </>
        )}

        {step === 'enter-details' && (
          <>
            <CardHeader>
              <CardTitle>Step 3: Enter Candidate-Submitted Details</CardTitle>
              <CardDescription>
                Enter the values as submitted by the candidate for comparison.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Full Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder='Enter full name as submitted'
                    className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-gray-700'>
                    PAN Number <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    value={formData.panNumber.toUpperCase()}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        panNumber: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder='ABCDE1234F'
                    maxLength={10}
                    className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                  <p className='text-xs text-gray-500'>
                    Format: AAAAA9999A
                  </p>
                </div>
              </div>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Aadhaar Number <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.aadhaarNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aadhaarNumber: e.target.value.replace(/\D/g, ''),
                    })
                  }
                  placeholder='123456789012'
                  maxLength={12}
                  className='w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <p className='text-xs text-gray-500'>
                  Format: 12 digits (spaces optional)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className='flex justify-between'>
                <button
                  onClick={prevStep}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800'
                >
                  &larr; Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    isStepValid()
                      ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next: Review &rarr;
                </button>
              </div>
            </CardFooter>
          </>
        )}

        {step === 'review' && (
          <>
            <CardHeader>
              <CardTitle>Step 4: Review & Submit</CardTitle>
              <CardDescription>
                Review the candidate details and selected document before starting verification.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <h3 className='text-sm font-semibold text-gray-900'>Candidate Information</h3>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>Name:</span>{' '}
                    {formData.fullName}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>Application ID:</span>{' '}
                    {formData.applicationId || 'Not provided'}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>Email:</span>{' '}
                    {formData.email || 'Not provided'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <h3 className='text-sm font-semibold text-gray-900'>Document Details</h3>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>File:</span>{' '}
                    {selectedFile?.name || 'None'}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>Type:</span>{' '}
                    {selectedFile?.type || 'None'}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>Size:</span>{' '}
                    {selectedFile
                      ? (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB'
                      : 'None'}
                  </p>
                </div>
                <div className='space-y-2'>
                  <h3 className='text-sm font-semibold text-gray-900'>Verification Fields</h3>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>PAN:</span>{' '}
                    {formData.panNumber || 'Not entered'}
                  </p>
                  <p className='text-sm text-gray-600'>
                    <span className='font-medium'>Aadhaar:</span>{' '}
                    {formData.aadhaarNumber || 'Not entered'}
                  </p>
                </div>
              </div>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <h3 className='text-sm font-medium text-blue-900 mb-2'>
                  Important Notice
                </h3>
                <p className='text-sm text-blue-800'>
                  OCR extraction and field matching provide an indication of
                  similarity, not proof of document authenticity. All results
                  require human review before making employment decisions.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className='flex justify-between'>
                <button
                  onClick={prevStep}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800'
                >
                  &larr; Back
                </button>
                <button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    isVerifying
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  }`}
                >
                  {isVerifying ? 'Verifying...' : 'Start Verification'}
                </button>
              </div>
              {verifyError && (
                <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
                  {verifyError}
                </div>
              )}
            </CardFooter>
          </>
        )}

        {step === 'results' && (
          <VerificationResults onRestart={() => setStep('candidate-details')} />
        )}
      </Card>
    </div>
  )
}

function VerificationResults({ onRestart }: { onRestart: () => void }) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-bold text-gray-900'>Verification Results</h2>
          <p className='text-gray-600'>
            Review the field-level comparison outcomes.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='flex flex-col items-center gap-2 text-center p-4 bg-green-50 rounded-xl'>
          <ShieldAlert className='h-6 w-6 text-green-600' />
          <div className='text-2xl font-bold'>2/3</div>
          <div className='text-xs text-gray-600'>Fields Matched</div>
        </div>
        <div className='flex flex-col items-center gap-2 text-center p-4 bg-blue-50 rounded-xl'>
          <FileText className='h-6 w-6 text-blue-600' />
          <div className='text-2xl font-bold'>1</div>
          <div className='text-xs text-gray-600'>Document</div>
        </div>
        <div className='flex flex-col items-center gap-2 text-center p-4 bg-blue-50 rounded-xl'>
          <Clock className='h-6 w-6 text-blue-600' />
          <div className='text-2xl font-bold'>P</div>
          <div className='text-xs text-gray-600'>Processing</div>
        </div>
        <div className='flex flex-col items-center gap-2 text-center p-4 bg-gray-100 rounded-xl'>
          <div className='h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium'>
            —
          </div>
          <div className='text-xs text-gray-600'>Issuer</div>
        </div>
      </div>

      <div className='bg-white rounded-xl border border-gray-200 shadow-sm'>
        <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-900'>Field Comparison</h3>
        </div>
        <div className='divide-y divide-gray-200'>
          <div className='px-6 py-4'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-xl font-bold text-green-600'>✓</span>
                  <h4 className='font-semibold text-gray-900'>Full Name</h4>
                </div>
                <div className='grid grid-cols-2 gap-4 mt-3'>
                  <div>
                    <p className='text-xs text-gray-600 uppercase tracking-wide'>
                      Submitted
                    </p>
                    <p className='text-sm font-mono text-gray-800 mt-1'>John Doe</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-600 uppercase tracking-wide'>
                      Extracted
                    </p>
                    <p className='text-sm font-mono text-gray-800 mt-1'>John Doe</p>
                  </div>
                </div>
                <div className='mt-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-xs text-gray-600'>Match Confidence</p>
                    <p className='text-xs font-semibold text-gray-800'>100%</p>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden'>
                    <div className='h-full bg-green-500' style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='px-6 py-4'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-xl font-bold text-red-600'>✗</span>
                  <h4 className='font-semibold text-gray-900'>PAN Number</h4>
                </div>
                <div className='grid grid-cols-2 gap-4 mt-3'>
                  <div>
                    <p className='text-xs text-gray-600 uppercase tracking-wide'>
                      Submitted
                    </p>
                    <p className='text-sm font-mono text-gray-800 mt-1'>ABCDE1234F</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-600 uppercase tracking-wide'>
                      Extracted
                    </p>
                    <p className='text-sm font-mono text-gray-800 mt-1'>Not found</p>
                  </div>
                </div>
                <div className='mt-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-xs text-gray-600'>Match Confidence</p>
                    <p className='text-xs font-semibold text-gray-800'>0%</p>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden'>
                    <div className='h-full bg-red-500' style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='px-6 py-4'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-xl font-bold text-red-600'>✗</span>
                  <h4 className='font-semibold text-gray-900'>Aadhaar Number</h4>
                </div>
                <div className='grid grid-cols-2 gap-4 mt-3'>
                  <div>
                    <p className='text-xs text-gray-600 uppercase tracking-wide'>
                      Submitted
                    </p>
                    <p className='text-sm font-mono text-gray-800 mt-1'>1234****5678</p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-600 uppercase tracking-wide'>
                      Extracted
                    </p>
                    <p className='text-sm font-mono text-gray-800 mt-1'>Not found</p>
                  </div>
                </div>
                <div className='mt-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-xs text-gray-600'>Match Confidence</p>
                    <p className='text-xs font-semibold text-gray-800'>0%</p>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden'>
                    <div className='h-full bg-red-500' style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex gap-4'>
        <button
          onClick={onRestart}
          className='flex-1 py-3 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors'
        >
          ← Verify Another Document
        </button>
      </div>
    </div>
  )
}
