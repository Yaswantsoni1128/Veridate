/**
 * PersonalInfo Component - Step 1 of the form
 * Collects user's full name
 */

import React from 'react'
import { FormData } from '../types/index'

interface PersonalInfoProps {
  data: FormData
  onChange: (field: keyof FormData, value: string) => void
  onNext: () => void
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  data,
  onChange,
  onNext,
}) => {
  // Validate form before proceeding to next step
  const isValid = data.fullName.trim().length >= 3

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 1: Personal Information
        </h2>
        <p className="text-gray-600">
          Please enter your full name as it appears in your documents
        </p>
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          value={data.fullName}
          onChange={(e) => onChange('fullName', e.target.value)}
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {data.fullName.trim().length < 3 && data.fullName.length > 0 && (
          <p className="mt-2 text-sm text-red-500">
            Full name must be at least 3 characters
          </p>
        )}
      </div>

      <div>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Documents &rarr;
        </button>
      </div>
    </div>
  )
}

export default PersonalInfo
