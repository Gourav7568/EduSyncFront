import api from './api';
import apiConfig from '../config/apiConfig';

// Get API endpoints for auth operations
const { AUTH } = apiConfig.API_ENDPOINTS;

/**
 * Store authentication data
 * @param {Object} userData - User data
 */
const storeAuthData = (userData) => {
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

/**
 * Clear authentication data
 */
const clearAuthData = () => {
  localStorage.removeItem('user');
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registered user data
 */
const register = async (userData) => {
  try {
    console.log('Sending registration data to API:', userData);
    
    // Format the data for your API
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
 * @returns {Promise<Object>} User data
 */
const login = async (credentials) => {
  try {
    // Make API call to your real backend login endpoint
    const response = await api.post(AUTH.LOGIN, credentials, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: false
    });
    
    // The API should return user data directly
    const userData = response.data;
    
    if (!userData) {
      throw new Error('No user data received from server');
    }
    
    // Store user data in localStorage
    storeAuthData(userData);
    
    return { user: userData };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Remove user authentication data
 */
const logout = () => {
  // Clear auth data
  clearAuthData();
};

/**
 * Get the current logged in user
 * @returns {Object|null} Current user data or null
 */
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    clearAuthData();
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
const isAuthenticated = () => {
  return !!getCurrentUser();
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated
};

export default authService;
