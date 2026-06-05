/**
 * Results Component - Displays verification results  
 * Shows extracted text, match results, and overall verification status
 */

import React from 'react'
import { VerificationResponse } from '../types/index'

interface ResultsProps {
  result: VerificationResponse
  onRestart: () => void
}

export const Results: React.FC<ResultsProps> = ({ result, onRestart }) => {
  // Helper function to get match status color and icon
  const getMatchStatus = (matched: boolean) => {
    return matched
      ? { color: 'text-green-600', bg: 'bg-green-50', icon: '✓' }
      : { color: 'text-red-600', bg: 'bg-red-50', icon: '✗' }
  }

  return (
    <div className="space-y-6">
      {/* Overall Status Card */}
      <div
        className={`rounded-lg p-8 text-center ${
          result.overall_match ? 'bg-green-50' : 'bg-red-50'
        }`}
      >
        <div className={`text-6xl mb-4 ${
          result.overall_match ? 'text-green-600' : 'text-red-600'
        }`}>
          {result.overall_match ? '✓' : '✗'}
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${
          result.overall_match ? 'text-green-900' : 'text-red-900'
        }`}>
          {result.overall_match ? 'Verification Successful!' : 'Verification Failed'}
        </h2>
        <p className={`text-lg ${
          result.overall_match ? 'text-green-800' : 'text-red-800'
        }`}>
          {result.message}
        </p>
        <p className={`text-sm mt-2 ${
          result.overall_match ? 'text-green-700' : 'text-red-700'
        }`}>
          {result.match_count} out of {result.total_fields} fields matched
        </p>
      </div>

      {/* Match Results Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Field Comparison</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {result.match_results.map((match) => {
            const status = getMatchStatus(match.matched)
            // Format field name for display
            const fieldLabel = match.field
              .replace(/_/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
            
            return (
              <div key={match.field} className={`px-6 py-4 ${status.bg}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xl font-bold ${status.color}`}>
                        {status.icon}
                      </span>
                      <h4 className="font-semibold text-gray-900">{fieldLabel}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          Your Input
                        </p>
                        <p className="text-sm font-mono text-gray-800 mt-1">
                          {match.form_value}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          Extracted
                        </p>
                        <p className="text-sm font-mono text-gray-800 mt-1">
                          {match.extracted_value}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600">Match Confidence</p>
                        <p className="text-xs font-semibold text-gray-800">
                          {Math.round(match.similarity_score * 100)}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2 mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            match.matched ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{
                            width: `${match.similarity_score * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Extracted Text */}
      {result.extraction_result.raw_text && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Raw OCR Text
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded p-4 max-h-48 overflow-y-auto">
            <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap break-words">
              {result.extraction_result.raw_text}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="flex-1 py-3 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          ← Verify Another Document
        </button>
      </div>
    </div>
  )
}

export default Results
