import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';

const Unauthorized = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-danger">
            <div className="card-header bg-danger text-white">
              <h3 className="mb-0">Access Denied</h3>
            </div>
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="bi bi-shield-lock display-1 text-danger"></i>
              </div>
              <h4 className="mb-3">You don't have permission to access this page</h4>
              <p className="mb-4">
                {currentUser ? (
                  <>
                    Your current role ({currentUser.role}) doesn't have sufficient permissions 
                    to access this resource.
                  </>
                ) : (
                  'You need to be logged in with appropriate permissions to access this resource.'
                )}
              </p>
              <div className="d-grid gap-3">
                <Link to="/" className="btn btn-primary btn-lg">
                  Go to Home Page
                </Link>
                {!currentUser && (
                  <Link to="/login" className="btn btn-outline-primary">
                    Login with Different Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
