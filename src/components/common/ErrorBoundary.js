import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary component to catch JavaScript errors in children components
 * and display a fallback UI instead of crashing the whole application
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You can also log the error to an error reporting service like Sentry here
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    const { children, fallback } = this.props;
    const { hasError, error, errorInfo } = this.state;
    
    if (hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(error, errorInfo, this.resetError)
          : fallback;
      }
      
      return (
        <div className="error-boundary p-4 bg-light rounded shadow-sm">
          <div className="text-center mb-4">
            <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '3rem' }}></i>
            <h2 className="mt-3 mb-2">Something went wrong</h2>
            <p className="text-muted">
              We're sorry, but an error occurred while rendering this component.
            </p>
          </div>
          
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <button 
              onClick={this.resetError} 
              className="btn btn-primary"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-house-door me-2"></i>
              Go to Home
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4">
              <p className="text-danger fw-bold">Error Details (Development Only):</p>
              <div className="bg-dark text-white p-3 rounded" style={{ overflowX: 'auto' }}>
                <p>{error?.toString()}</p>
                <pre>{errorInfo?.componentStack}</pre>
              </div>
            </div>
          )}
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func
};

export default ErrorBoundary;
