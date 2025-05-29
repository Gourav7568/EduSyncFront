import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student' // Default role
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!userData.name.trim()) {
      errors.name = 'Name is required';
    } else if (userData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }
    
    // Email validation
    if (!userData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Email is not valid';
    }
    
    // Password validation
    if (!userData.password) {
      errors.password = 'Password is required';
    } else if (userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userDataToSubmit } = userData;
      
      // Your exact API endpoint
      const url = "https://localhost:7252/api/Users/register";
      console.log('Sending registration request to:', url);
      
      // You can modify the data format based on your API requirements
      // Option 1: Send data as-is (camelCase)
      await apiClient.post(url, userDataToSubmit);
      
      // Option 2: Format for ASP.NET Core API (PascalCase)
      // Uncomment this if your API expects PascalCase
      /*
      await axios.post(url, {
        Name: userDataToSubmit.name,
        Email: userDataToSubmit.email,
        Password: userDataToSubmit.password,
        Role: userDataToSubmit.role
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      */
      
      // Redirect to login page after successful registration
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8 col-xl-6">
          <div className="card shadow border-0 rounded-lg overflow-hidden">
            <div className="row g-0">
              {/* Left side - Image and branding */}
              <div className="col-lg-5 d-none d-lg-block">
                <div className="bg-primary h-100 d-flex flex-column justify-content-center text-white p-4" 
                  style={{
                    background: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
                    minHeight: '600px'
                  }}>
                  <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold mb-4">EduSync</h1>
                    <p className="lead">Join our learning platform today</p>
                  </div>
                  <div className="mt-4">
                    <ul className="list-unstyled">
                      <li className="mb-3 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        <span>Access to all courses</span>
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        <span>Interactive assessments</span>
                      </li>
                      <li className="mb-3 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        <span>Progress tracking</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-auto text-center">
                    <p className="mb-0 small opacity-75">© {new Date().getFullYear()} EduSync LMS</p>
                  </div>
                </div>
              </div>
              
              {/* Right side - Registration form */}
              <div className="col-lg-7">
                <div className="card-body p-4 p-lg-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold">Create an Account</h2>
                    <p className="text-muted">Fill out the form to get started</p>
                  </div>
                  
                  {/* Error alert */}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-medium">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-person"></i>
                        </span>
                        <input
                          type="text"
                          className={`form-control py-2 ${validationErrors.name ? 'is-invalid' : ''}`}
                          id="name"
                          name="name"
                          placeholder="Enter your full name"
                          value={userData.name}
                          onChange={handleChange}
                          required
                        />
                        {validationErrors.name && (
                          <div className="invalid-feedback">{validationErrors.name}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-medium">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className={`form-control py-2 ${validationErrors.email ? 'is-invalid' : ''}`}
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          value={userData.email}
                          onChange={handleChange}
                          required
                        />
                        {validationErrors.email && (
                          <div className="invalid-feedback">{validationErrors.email}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-medium">Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type="password"
                          className={`form-control py-2 ${validationErrors.password ? 'is-invalid' : ''}`}
                          id="password"
                          name="password"
                          placeholder="Create a password"
                          value={userData.password}
                          onChange={handleChange}
                          required
                        />
                        {validationErrors.password && (
                          <div className="invalid-feedback">{validationErrors.password}</div>
                        )}
                      </div>
                      <div className="form-text">Password must be at least 6 characters long</div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label fw-medium">Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-shield-lock"></i>
                        </span>
                        <input
                          type="password"
                          className={`form-control py-2 ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          value={userData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                        {validationErrors.confirmPassword && (
                          <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="role" className="form-label fw-medium">Account Type</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-person-badge"></i>
                        </span>
                        <select
                          className="form-select py-2"
                          id="role"
                          name="role"
                          value={userData.role}
                          onChange={handleChange}
                          required
                        >
                          <option value="Student">Student</option>
                          <option value="Instructor">Instructor</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-check mb-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="termsCheck"
                        required
                      />
                      <label className="form-check-label" htmlFor="termsCheck">
                        I agree to the <Link to="#" className="text-decoration-none">Terms of Service</Link> and <Link to="#" className="text-decoration-none">Privacy Policy</Link>
                      </label>
                    </div>
                    
                    <div className="d-grid gap-2 mb-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg px-4 py-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </div>
                  </form>
                  
                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account? <Link to="/login" className="fw-medium text-decoration-none">Sign In</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
