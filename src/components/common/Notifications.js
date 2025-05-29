import React from 'react';
import { useNotification } from '../../utils/NotificationContext';

const Notifications = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1060, maxWidth: '350px' }}>
      {notifications.map((notification) => (
        <div 
          key={notification.id} 
          className={`toast show align-items-center text-white bg-${notification.type} border-0 mb-2`}
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">
              {notification.message}
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white me-2 m-auto" 
              onClick={() => removeNotification(notification.id)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
