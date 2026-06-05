/**
 * DocumentInfo Component - Step 2 of the form
 * Collects PAN and Aadhaar numbers
 */

import React from 'react'
import { FormData } from '../types/index'

interface DocumentInfoProps {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}

export const DocumentInfo: React.FC<DocumentInfoProps> = ({
  data,
  onChange,
  onNext,
  onBack,
}) => {
  // PAN format: AAAAA9999A - 10 characters
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.panNumber)
  
  // Aadhaar format: 12 digits
  const isAadhaarValid = /^\d{12}$/.test(data.aadhaarNumber.replace(/\s/g, ''))
  
  const isValid = isPanValid && isAadhaarValid

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 2: Document Numbers
        </h2>
        <p className="text-gray-600">
          Enter your PAN and Aadhaar numbers for verification
        </p>
      </div>

      {/* PAN Number Input */}
      <div>
        <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-2">
          PAN Number <span className="text-red-500">*</span>
        </label>
        <input
          id="pan"
          type="text"
          value={data.panNumber}
          onChange={(e) => onChange('panNumber', e.target.value.toUpperCase())}
          placeholder="e.g., ABCDE1234F"
          maxLength={10}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            data.panNumber && !isPanValid ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <p className="mt-2 text-xs text-gray-500">
          Format: AAAAA9999A (5 letters, 4 digits, 1 letter)
        </p>
        {data.panNumber && !isPanValid && (
          <p className="mt-1 text-sm text-red-500">Invalid PAN format</p>
        )}
      </div>

      {/* Aadhaar Number Input */}
      <div>
        <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-2">
          Aadhaar Number <span className="text-red-500">*</span>
        </label>
        <input
          id="aadhaar"
          type="text"
          value={data.aadhaarNumber}
          onChange={(e) => 
            onChange('aadhaarNumber', e.target.value.replace(/\D/g, ''))
          }
          placeholder="e.g., 123456789012"
          maxLength={12}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            data.aadhaarNumber && !isAadhaarValid ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <p className="mt-2 text-xs text-gray-500">
          Format: 12 digits (spaces are optional)
        </p>
        {data.aadhaarNumber && !isAadhaarValid && (
          <p className="mt-1 text-sm text-red-500">Aadhaar must be 12 digits</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 rounded-lg font-medium bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors"
        >
          &larr; Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Upload &rarr;
        </button>
      </div>
    </div>
  )
}

export default DocumentInfo
