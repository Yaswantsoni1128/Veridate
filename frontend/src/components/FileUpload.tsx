/**
 * FileUpload Component - Step 3 of the form
 * Handles image and PDF file uploads for document verification
 */

import React, { useRef } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onBack: () => void
  onSubmit: () => void
  isLoading: boolean
  selectedFile: File | null
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onBack,
  onSubmit,
  isLoading,
  selectedFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/tiff', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (JPG, PNG, BMP, TIFF) or PDF file')
        return
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      onFileSelect(file)
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileChange({
        target: { files: e.dataTransfer.files }
      } as any)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 3: Upload Document
        </h2>
        <p className="text-gray-600">
          Upload a photo of your ID document or a PDF for OCR verification
        </p>
      </div>

      {/* Drag and Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          selectedFile
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/bmp,image/tiff,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {selectedFile ? (
          <>
            <div className="text-green-600 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">{selectedFile.name}</p>
            <p className="text-sm text-gray-600 mt-2">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <p className="text-sm text-green-600 mt-4">✓ File selected</p>
          </>
        ) : (
          <>
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              Drag and drop your file here
            </p>
            <p className="text-sm text-gray-600 mt-2">
              or click to select from your computer
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Supported: JPG, PNG, BMP, TIFF, PDF (Max 10MB)
            </p>
          </>
        )}
      </div>

      {/* Navigation and Submit Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors disabled:opacity-50"
        >
          &larr; Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!selectedFile || isLoading}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            selectedFile && !isLoading
              ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading && (
            <div className="animate-spin">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          )}
          {isLoading ? 'Verifying...' : 'Verify Document'}
        </button>
      </div>
    </div>
  )
}

export default FileUpload
