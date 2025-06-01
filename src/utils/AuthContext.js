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

  // Validate user session
  const validateSession = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Session validation error:', err);
      await logout();
      return false;
    } finally {
      if (!initialized) {
        setInitialized(true);
      }
      setLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      try {
        const userStr = localStorage.getItem('user');
        
        if (!userStr) {
          if (isMounted) {
            setCurrentUser(null);
            setLoading(false);
          }
          return;
        }
        
        try {
          // Set the user from local storage
          const user = JSON.parse(userStr);
          if (isMounted) {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error('Failed to parse user data:', error);
          if (isMounted) {
            await logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          await logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Run auth initialization
    initAuth();
    
    // Clean up on unmount
    return () => {
      isMounted = false;
    };
  }, []);

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const { user } = response;
      
      // Update current user state
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
    authService.logout();
    
    // Update state
    setCurrentUser(null);
    
    // Show notification
    if (notification) {
      notification.info('You have been logged out successfully.');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
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
