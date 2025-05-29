import React, { createContext, useContext, useState } from 'react';

// Create a context for notifications
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'danger',
  WARNING: 'warning',
  INFO: 'info'
};

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = (message, type = NOTIFICATION_TYPES.INFO, timeout = 5000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    
    const newNotification = {
      id,
      message,
      type,
      timestamp: new Date(),
    };
    
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    
    // Auto-remove notification after timeout
    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }
    
    return id;
  };

  // Remove a notification by id
  const removeNotification = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Convenience methods for different notification types
  const success = (message, timeout) => addNotification(message, NOTIFICATION_TYPES.SUCCESS, timeout);
  const error = (message, timeout) => addNotification(message, NOTIFICATION_TYPES.ERROR, timeout);
  const warning = (message, timeout) => addNotification(message, NOTIFICATION_TYPES.WARNING, timeout);
  const info = (message, timeout) => addNotification(message, NOTIFICATION_TYPES.INFO, timeout);

  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
