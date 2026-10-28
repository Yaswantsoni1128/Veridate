/**
 * API configuration and Axios instance setup
 */

import axios from 'axios'

// Backend API base URL
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000'

// Create axios instance with common configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
})

// API endpoints
export const API_ENDPOINTS = {
  health: '/health',
  verifyDocument: '/verify-document',
}

export default apiClient
