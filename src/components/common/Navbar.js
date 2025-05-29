import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { useNotification } from '../../utils/NotificationContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, isInstructor, isStudent } = useAuth();
  const notification = useNotification();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close menu after navigation on mobile
  const handleNavigation = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={handleNavigation}>
          <i className="bi bi-book-half me-2 fs-4"></i>
          <span><strong>EduSync</strong> LMS</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 ${isActive('/') ? 'active fw-medium' : ''}`} 
                to="/"
                onClick={handleNavigation}
              >
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 ${isActive('/courses') ? 'active fw-medium' : ''}`} 
                to="/courses"
                onClick={handleNavigation}
              >
                <i className="bi bi-collection me-1"></i> Courses
              </Link>
            </li>
            {isInstructor() && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link px-3 ${isActive('/assessments') ? 'active fw-medium' : ''}`} 
                    to="/assessments"
                    onClick={handleNavigation}
                  >
                    <i className="bi bi-file-earmark-text me-1"></i> Assessments
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link px-3 ${isActive('/results') ? 'active fw-medium' : ''}`} 
                    to="/results"
                    onClick={handleNavigation}
                  >
                    <i className="bi bi-graph-up me-1"></i> Results
                  </Link>
                </li>
              </>
            )}
            {isStudent() && (
              <li className="nav-item">
                <Link 
                  className={`nav-link px-3 ${isActive('/my-results') ? 'active fw-medium' : ''}`} 
                  to="/my-results"
                  onClick={handleNavigation}
                >
                  <i className="bi bi-trophy me-1"></i> My Results
                </Link>
              </li>
            )}
          </ul>
          <div className="navbar-nav align-items-center">
            {currentUser ? (
              <div className="d-flex align-items-center">
                <div className="dropdown">
                  <button 
                    className="btn btn-link text-decoration-none text-white dropdown-toggle d-flex align-items-center" 
                    type="button" 
                    id="userDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <div className="bg-white bg-opacity-25 rounded-circle p-1 me-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-person text-white"></i>
                    </div>
                    <span className="d-none d-md-inline">{currentUser.name || currentUser.email}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userDropdown">
                    <li className="dropdown-item-text text-muted small px-3 py-1">
                      <i className="bi bi-person-badge me-1"></i> {currentUser.role}
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item text-danger">
                        <i className="bi bi-box-arrow-right me-1"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="d-flex">
                <Link 
                  className="nav-link px-3" 
                  to="/login"
                  onClick={handleNavigation}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-outline-light ms-2 d-none d-md-inline-block"
                  onClick={handleNavigation}
                >
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
                <Link 
                  to="/register" 
                  className="nav-link px-3 d-inline-block d-md-none"
                  onClick={handleNavigation}
                >
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
