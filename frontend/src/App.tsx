/**
 * Main App Component
 * Orchestrates the multi-step form and manages state
 */

import React, { useState } from 'react'
import PersonalInfo from './components/PersonalInfo'
import DocumentInfo from './components/DocumentInfo'
import FileUpload from './components/FileUpload'
import Results from './components/Results'
import { FormData, VerificationResponse, StepData } from './types/index'
import apiClient from './api/client'
import './App.css'

// Step constants
const STEP_PERSONAL_INFO = 1
const STEP_DOCUMENT_INFO = 2
const STEP_FILE_UPLOAD = 3
const STEP_RESULTS = 4

function App() {
  // State management for form and verification
  const [currentStep, setCurrentStep] = useState(STEP_PERSONAL_INFO)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    panNumber: '',
    aadhaarNumber: '',
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Handle form field changes
  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    setError(null) // Clear error when user makes changes
  }

  // Navigation handlers
  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1)
    setError(null)
  }

  const handleBackStep = () => {
    setCurrentStep(prev => prev - 1)
    setError(null)
  }

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setUploadedFile(file)
    setError(null)
  }

  // Handle form submission and document verification
  const handleSubmit = async () => {
    if (!uploadedFile) {
      setError('Please select a file')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create FormData for multipart form submission
      const formDataToSend = new FormData()
      formDataToSend.append('full_name', formData.fullName)
      formDataToSend.append('pan_number', formData.panNumber)
      formDataToSend.append('aadhaar_number', formData.aadhaarNumber)
      formDataToSend.append('document', uploadedFile)

      // Send to backend API
      const response = await apiClient.post('/verify-document', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Handle successful response
      setVerificationResult(response.data)
      setCurrentStep(STEP_RESULTS)
    } catch (err) {
      // Handle error
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to verify document. Please try again.')
      }
      console.error('Verification error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle restart - reset all data and go to first step
  const handleRestart = () => {
    setCurrentStep(STEP_PERSONAL_INFO)
    setFormData({
      fullName: '',
      panNumber: '',
      aadhaarNumber: '',
    })
    setUploadedFile(null)
    setVerificationResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Document Verification
          </h1>
          <p className="text-lg text-gray-600">
            Verify your identity documents using OCR technology
          </p>
        </div>

        {/* Progress Indicator */}
        {currentStep !== STEP_RESULTS && (
          <div className="mb-12">
            <div className="flex justify-between items-center">
              {[
                { step: STEP_PERSONAL_INFO, label: 'Personal' },
                { step: STEP_DOCUMENT_INFO, label: 'Documents' },
                { step: STEP_FILE_UPLOAD, label: 'Upload' },
              ].map((item, idx) => (
                <React.Fragment key={item.step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                        currentStep >= item.step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {item.step}
                    </div>
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  {idx < 2 && (
                    <div
                      className={`flex-1 h-1 mx-2 mb-8 rounded transition-colors ${
                        currentStep > item.step ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Error Message Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="text-red-500 mr-3 mt-0.5">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === STEP_PERSONAL_INFO && (
            <PersonalInfo
              data={formData}
              onChange={handleFormChange}
              onNext={handleNextStep}
            />
          )}

          {currentStep === STEP_DOCUMENT_INFO && (
            <DocumentInfo
              data={formData}
              onChange={handleFormChange}
              onNext={handleNextStep}
              onBack={handleBackStep}
            />
          )}

          {currentStep === STEP_FILE_UPLOAD && (
            <FileUpload
              onFileSelect={handleFileSelect}
              onBack={handleBackStep}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              selectedFile={uploadedFile}
            />
          )}

          {currentStep === STEP_RESULTS && verificationResult && (
            <Results
              result={verificationResult}
              onRestart={handleRestart}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>
            This application uses OCR technology to extract and verify document information
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
