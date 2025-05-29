import apiConfig from '../config/apiConfig';
import React, { useState, useEffect } from 'react';

/**
 * API Configuration Manager Component
 * 
 * This utility component provides a simple UI to change the API base URL 
 * at runtime without requiring code changes or redeployment.
 */

const ApiConfigManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [status, setStatus] = useState({ show: false, message: '', type: 'info' });

  // Initialize with current API URL
  useEffect(() => {
    setApiUrl(apiConfig.getApiBaseUrl());
  }, []);

  const handleSave = () => {
    try {
      // Validate URL format
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(apiUrl)) {
        setStatus({
          show: true,
          message: 'Please enter a valid URL starting with http:// or https://',
          type: 'danger'
        });
        return;
      }

      // Update API base URL
      apiConfig.setApiBaseUrl(apiUrl);
      
      // Show success message
      setStatus({
        show: true,
        message: `API URL updated to: ${apiUrl}. Refresh the page to apply changes.`,
        type: 'success'
      });

      // Store in localStorage for persistence
      localStorage.setItem('custom_api_url', apiUrl);
      
      // Close the modal after 2 seconds
      setTimeout(() => {
        setShowModal(false);
        
        // Offer to reload the page
        if (window.confirm('API URL updated. Reload page to apply changes?')) {
          window.location.reload();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error updating API URL:', error);
      setStatus({
        show: true,
        message: `Error updating API URL: ${error.message}`,
        type: 'danger'
      });
    }
  };
  
  // Load stored API URL on first render
  useEffect(() => {
    const storedUrl = localStorage.getItem('custom_api_url');
    if (storedUrl) {
      apiConfig.setApiBaseUrl(storedUrl);
      setApiUrl(storedUrl);
    }
  }, []);

  return (
    <>
      {/* Floating button to open config modal */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button 
          className="btn btn-info btn-sm rounded-circle" 
          onClick={() => setShowModal(true)}
          style={{ width: '40px', height: '40px', padding: 0 }}
          title="Configure API URL"
        >
          <i className="bi bi-gear-fill"></i>
        </button>
      </div>

      {/* API Configuration Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">API Configuration</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {status.show && (
                  <div className={`alert alert-${status.type} alert-dismissible fade show`} role="alert">
                    {status.message}
                    <button type="button" className="btn-close" onClick={() => setStatus({...status, show: false})}></button>
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="apiUrl" className="form-label">API Base URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="apiUrl"
                    placeholder="e.g. http://localhost:5000/api"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                  />
                  <div className="form-text text-muted">
                    Enter the base URL of your backend API including the protocol (http/https)
                  </div>
                </div>
                
                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiConfigManager;
