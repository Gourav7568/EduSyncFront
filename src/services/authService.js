import api from './api';
import apiConfig from '../config/apiConfig';

// Get API endpoints for auth operations
const { AUTH } = apiConfig.API_ENDPOINTS;

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registered user data
 */
const register = async (userData) => {
  try {
    console.log('Sending registration data to API:', userData);
    
    // Format the data for your ASP.NET Core API
    // Uncomment Option 2 if your API expects PascalCase properties
    
    // Option 1: Send as-is with camelCase properties (default)
    let dataToSend = userData;
    
    // Option 2: Format for ASP.NET Core API (PascalCase properties)
    // Uncomment this if your API expects PascalCase
    /*
    const dataToSend = {
      Name: userData.name,
      Email: userData.email,
      Password: userData.password,
      Role: userData.role
    };
    */
    
    // Specify request config with CORS settings
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Important for CORS with credentials
      withCredentials: false
    };
    
    // Make the API request with Axios
    console.log('Sending request to:', AUTH.REGISTER);
    const response = await api.post(AUTH.REGISTER, dataToSend, config);
    console.log('Registration successful, response:', response.data);
    return response.data;
  } catch (error) {
    // Detailed error logging
    console.error('Registration error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        // Don't log sensitive data
        data: '[REDACTED]'
      }
    });
    throw error;
  }
};

/**
 * Login user and store authentication data
 * @param {Object} credentials - User login credentials
 * @returns {Promise<Object>} User data with authentication token
 */
const login = async (credentials) => {
  try {
    // Make API call to your real backend login endpoint
    
    // Format the data for your ASP.NET Core API
    // Uncomment Option 2 if your API expects PascalCase properties
    
    // Option 1: Send as-is with camelCase properties (default)
    let dataToSend = credentials;
    
    // Option 2: Format for ASP.NET Core API (PascalCase properties)
    // Uncomment this if your API expects PascalCase
    /*
    const dataToSend = {
      Email: credentials.email,
      Password: credentials.password
    };
    */
    
    // Specify request config with CORS settings
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // Important for CORS with credentials
      withCredentials: false
    };
    
    // Make the API request with Axios
    console.log('Sending request to:', AUTH.LOGIN);
    const response = await api.post(AUTH.LOGIN, dataToSend, config);
    console.log('Login successful, response:', response.data);
    
    // Extract token and user data from the response
    // Adjust this based on how your API returns the data
    const data = response.data;
    const token = data.token || data.accessToken; 
    const userData = data.user || data;
    
    // Store token in localStorage
    if (token) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return {
      token: token,
      user: userData
    };
  } catch (error) {
    // Detailed error logging
    console.error('Login error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        // Don't log sensitive data
        data: '[REDACTED]'
      }
    });
    throw error;
  }
};

/**
 * Remove user authentication data
 */
const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

/**
 * Get the current logged in user
 * @returns {Object|null} Current user data or null
 */
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = getCurrentUser();
  return !!token && !!user;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};

export default authService;
