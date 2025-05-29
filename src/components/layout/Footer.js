import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="mb-3 d-flex align-items-center">
              <i className="bi bi-book-half me-2 fs-3"></i>
              <h5 className="mb-0"><strong>EduSync</strong> LMS</h5>
            </div>
            <p className="text-white-50">
              A comprehensive learning management system that helps students master new skills and instructors deliver effective educational content.
            </p>
            <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-white" aria-label="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-white" aria-label="Twitter">
                <i className="bi bi-twitter-x fs-5"></i>
              </a>
              <a href="#" className="text-white" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
              <a href="#" className="text-white" aria-label="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
            </div>
          </div>
          
          <div className="col-sm-6 col-md-4 col-lg-2 mb-4 mb-lg-0">
            <h6 className="text-uppercase mb-3 text-white-50 fw-bold">Navigation</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none hover-white">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/courses" className="text-white-50 text-decoration-none hover-white">Courses</Link>
              </li>
              <li className="mb-2">
                <Link to="/assessments" className="text-white-50 text-decoration-none hover-white">Assessments</Link>
              </li>
              <li className="mb-2">
                <Link to="/my-results" className="text-white-50 text-decoration-none hover-white">Results</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-sm-6 col-md-4 col-lg-3 mb-4 mb-lg-0">
            <h6 className="text-uppercase mb-3 text-white-50 fw-bold">Resources</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-white">Help Center</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-white">Documentation</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-white">API Reference</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-white-50 text-decoration-none hover-white">Community</a>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4 col-lg-3">
            <h6 className="text-uppercase mb-3 text-white-50 fw-bold">Contact</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2 text-white-50">
                <i className="bi bi-geo-alt me-2"></i> 123 Learning Street, Education City
              </li>
              <li className="mb-2 text-white-50">
                <i className="bi bi-envelope me-2"></i> support@edusync.com
              </li>
              <li className="mb-2 text-white-50">
                <i className="bi bi-telephone me-2"></i> +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="mt-4 mb-4 border-secondary" />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 text-white-50">
              &copy; {currentYear} EduSync LMS. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-white-50 text-decoration-none hover-white small">Privacy Policy</a>
              </li>
              <li className="list-inline-item mx-3">
                <a href="#" className="text-white-50 text-decoration-none hover-white small">Terms of Service</a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="text-white-50 text-decoration-none hover-white small">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
