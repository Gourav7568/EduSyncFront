import api from "./api";
import apiConfig from "../config/apiConfig";

// Get API endpoints for auth operations
const { AUTH } = apiConfig.API_ENDPOINTS;

/**
 * Store authentication data
 * @param {Object} userData - User data
 */
const storeAuthData = (userData) => {
  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));
  }
};

/**
 * Clear authentication data
 */
const clearAuthData = () => {
  localStorage.removeItem("user");
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registered user data
 */
const register = async (userData) => {
  try {
    console.log("Sending registration data to API:", userData);

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
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Important for CORS with credentials
      withCredentials: false,
    };

    // Make the API request with Axios
    console.log("Sending request to:", AUTH.REGISTER);
    const response = await api.post(AUTH.REGISTER, dataToSend, config);
    console.log("Registration successful, response:", response.data);
    return response.data;
  } catch (error) {
    // Detailed error logging
    console.error("Registration error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        // Don't log sensitive data
        data: "[REDACTED]",
      },
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
    // Format the credentials to match what the backend expects
    const loginData = {
      email: credentials.email,
      password: credentials.password,
    };

    console.log("Sending login request to:", AUTH.LOGIN);
    console.log("With data:", { email: loginData.email, password: "***" });

    // Make API call to the backend login endpoint
    const response = await api.post(AUTH.LOGIN, loginData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: false,
      validateStatus: (status) => status < 500, // Don't throw for 4xx errors
    });

    console.log("Login response status:", response.status);
    console.log("Login response data:", response.data);

    // The API returns a user object with UserId, Name, Email, and Role
    const userData = response.data;
    console.log("Login response:", userData);

    if (!userData || !userData.email) {
      throw new Error("Invalid response from server");
    }

    // Store the complete user data
    const userToStore = {
      id: userData.userId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    // Store user data in localStorage
    storeAuthData(userToStore);

    return { user: userToStore };
  } catch (error) {
    console.error("Login failed with error:", {
      message: error.message,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      },
      request: error.request
        ? "Request was made but no response received"
        : "No request was made",
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data ? JSON.parse(error.config.data) : null,
      },
    });

    // Extract a user-friendly error message
    let errorMessage = "Login failed. Please try again.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
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
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
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
  isAuthenticated,
};

export default authService;
