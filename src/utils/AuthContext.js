import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import api, { initializeApi } from '../services/api';
import { useNotification } from './NotificationContext';

// Create the Authentication Context
export const AuthContext = createContext();

// Create Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  
  // Get notification service
  const notification = useNotification();
  
  // Initialize API service with notification service
  useEffect(() => {
    if (notification) {
      initializeApi({ notificationService: notification });
    }
  }, [notification]);

  // Validate token and refresh user data
  const validateSession = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setCurrentUser(null);
        return false;
      }

      // Set token in api headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Try to get current user data to validate token
      const user = authService.getCurrentUser();
      if (user) {
        // This line is critical - set the current user state
        setCurrentUser(user);
        return true;
      } else {
        // If user data not available, clear auth state
        await logout();
        return false;
      }
    } catch (err) {
      console.error('Session validation error:', err);
      await logout();
      return false;
    } finally {
      // Important: this ensures we don't keep showing loading state
      if (!initialized) {
        setInitialized(true);
      }
      // Set loading to false regardless of outcome
      setLoading(false);
    }
  };

  // Initialize auth state with better handling
  useEffect(() => {
    const initAuth = async () => {
      // Set loading state
      setLoading(true);
      
      // Check if we have auth data stored locally
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          // Parse the user data
          const userData = JSON.parse(userStr);
          
          // Set the current user directly from localStorage
          // This avoids any delays in auth state
          setCurrentUser(userData);
          
          // Set API header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Validate session in background (won't delay auth)
          validateSession();
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Clean up invalid data
          await logout();
        }
      } else {
        // No stored auth data
        setLoading(false);
      }
    };

    // Run auth initialization
    initAuth();

    // Set up interval to periodically validate token (but less frequently)
    const validateInterval = setInterval(() => {
      if (localStorage.getItem('authToken')) {
        validateSession();
      }
    }, 30 * 60 * 1000); // Check every 30 minutes

    return () => clearInterval(validateInterval);
  }, []);

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const { token, user } = response;
      
      // Store token
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      
      // Show success notification
      if (notification) {
        notification.success(`Welcome back, ${user.name || user.email}!`);
      }
      
      return user;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      
      // Show error notification
      if (notification) {
        notification.error(errorMessage);
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.register(userData);
      
      // Show success notification
      if (notification) {
        notification.success('Account created successfully! Please log in.');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      
      // Show error notification
      if (notification) {
        notification.error(errorMessage);
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    
    // Update state
    setCurrentUser(null);
    
    // Show notification
    if (notification) {
      notification.info('You have been logged out successfully.');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser && !!localStorage.getItem('authToken');
  };

  // Check if user is instructor
  const isInstructor = () => {
    return isAuthenticated() && currentUser.role === 'Instructor';
  };

  // Check if user is student
  const isStudent = () => {
    return isAuthenticated() && currentUser.role === 'Student';
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated,
    isInstructor,
    isStudent,
    loading,
    error,
    initialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
