import axios from 'axios';

// Create an axios instance specifically for your ASP.NET Core backend
const apiClient = axios.create({
  baseURL: 'https://localhost:7252',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // For development only - helps with CORS issues
  withCredentials: false
});

// Add request interceptor to handle requests properly
apiClient.interceptors.request.use(
  config => {
    // Log outgoing requests for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    // Log successful responses for debugging
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    // Handle 404 errors specifically
    if (error.response && error.response.status === 404) {
      console.error(`404 Error: Resource not found at ${error.config.url}`);
    }
    
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// Helper function to check if API is available
export const checkApiAvailability = async (baseUrl = 'https://localhost:7252') => {
  try {
    // Instead of using a /health endpoint, we'll use an existing API endpoint
    // We're using /api/Results because we know it exists in your API
    await axios.get(`${baseUrl}/api/Results`, { 
      timeout: 3000,
      // Just check the status, don't actually fetch the data
      validateStatus: (status) => status === 200 || status === 401 || status === 403 || status === 404
    });
    return true;
  } catch (error) {
    console.warn('API server appears to be offline or inaccessible');
    return false;
  }
};

export default apiClient;
