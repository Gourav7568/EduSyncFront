import axios from 'axios';
import apiConfig from '../config/apiConfig';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: apiConfig.getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15 second timeout
});

// This will be dynamically set by the initializeApi function
let notificationService = null;

/**
 * Initialize the API service with dependencies
 * @param {Object} dependencies - Dependencies to inject
 * @param {Object} dependencies.notificationService - The notification service to use for error messages
 */
export const initializeApi = (dependencies = {}) => {
  if (dependencies.notificationService) {
    notificationService = dependencies.notificationService;
  }
};

// Helper function to handle errors consistently
const handleApiError = (error) => {
  console.error('API Error:', error);
  
  let errorMessage = 'An unexpected error occurred. Please try again.';
  let status = null;
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        errorMessage = data.message || 'Invalid request. Please check your input.';
        break;
      case 401:
        errorMessage = 'Your session has expired. Please log in again.';
        // Token expired or invalid, clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login?session=expired';
        break;
      case 403:
        errorMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      default:
        errorMessage = data.message || `Error: ${status}`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response from server. Please check your connection.';
  }
  
  // Show notification if the service is available
  if (notificationService && status !== 401) { // Don't show 401 errors as notifications since we redirect
    notificationService.error(errorMessage);
  }
  
  return Promise.reject({
    ...error,
    userMessage: errorMessage
  });
};

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return handleApiError(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return handleApiError(error);
  }
);

export default api;
