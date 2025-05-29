/**
 * API Configuration
 * This file centralizes all API configuration settings
 */

// Base API URL - configurable via environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7252/api';

// API endpoints
const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/AuthController/register',
    LOGIN: '/AuthController/login',
    PROFILE: '/AuthController/profile',
  },
  // Course endpoints
  COURSES: {
    BASE: '/Courses',
    ENROLL: (courseId) => `/Courses/${courseId}/enroll`,
    CONTENT: (courseId) => `/Courses/${courseId}/content`,
  },
  // Add other endpoint groups as needed
};

/**
 * Returns the full URL for an API endpoint
 * @param {string} endpoint - The API endpoint path
 * @returns {string} The complete API URL
 */
const getApiUrl = (endpoint) => {
  return `${getApiBaseUrl()}${endpoint}`;
};

/**
 * Returns default axios request options to use with API calls
 * Includes settings to help with CORS and HTTPS issues
 */
const getDefaultRequestOptions = () => {
  return {
    // For CORS preflight requests
    withCredentials: false,
    
    // Additional headers that might help with CORS
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
};

/**
 * Updates the base API URL
 * @param {string} newBaseUrl - The new base URL to use
 */
const setApiBaseUrl = (newBaseUrl) => {
  // This is a runtime override that doesn't persist across page reloads
  // For a more permanent solution, use environment variables
  if (newBaseUrl) {
    // Make sure the URL doesn't end with a slash
    const formattedUrl = newBaseUrl.endsWith('/') 
      ? newBaseUrl.slice(0, -1) 
      : newBaseUrl;
    
    window._apiBaseUrl = formattedUrl;
  }
};

/**
 * Gets the current base API URL
 * @returns {string} The current base API URL
 */
const getApiBaseUrl = () => {
  return window._apiBaseUrl || API_BASE_URL;
};

// Export the configuration
export default {
  API_ENDPOINTS,
  getApiUrl,
  setApiBaseUrl,
  getApiBaseUrl,
  getDefaultRequestOptions,
};
