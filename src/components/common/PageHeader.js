import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * PageHeader component for consistent page headers across the application
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The main title text
 * @param {string} [props.subtitle] - Optional subtitle text
 * @param {string} [props.icon] - Optional Bootstrap icon class name
 * @param {Object} [props.action] - Optional action button configuration
 * @param {string} props.action.text - Action button text
 * @param {string} props.action.to - Action button link destination
 * @param {string} [props.action.icon] - Optional action button icon
 * @param {string} [props.action.variant] - Button variant (primary, success, etc.)
 * @param {Array} [props.breadcrumbs] - Optional breadcrumbs array of {text, to} objects
 */
const PageHeader = ({ 
  title, 
  subtitle, 
  icon, 
  action, 
  breadcrumbs,
  className
}) => {
  return (
    <div className={`page-header mb-4 ${className || ''}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="mb-2">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Home</Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li 
                key={index} 
                className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
              >
                {index === breadcrumbs.length - 1 ? (
                  crumb.text
                ) : (
                  <Link to={crumb.to} className="text-decoration-none">{crumb.text}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header Content */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
        <div className="mb-3 mb-md-0">
          <h1 className="fw-bold mb-1 d-flex align-items-center">
            {icon && <i className={`${icon} me-2 text-primary`}></i>}
            {title}
          </h1>
          {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
        </div>
        {action && (
          <div>
            <Link 
              to={action.to} 
              className={`btn btn-${action.variant || 'primary'}`}
            >
              {action.icon && <i className={`${action.icon} me-2`}></i>}
              {action.text}
            </Link>
          </div>
        )}
      </div>
      <hr className="my-3" />
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  action: PropTypes.shape({
    text: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.string,
    variant: PropTypes.string
  }),
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      to: PropTypes.string
    })
  ),
  className: PropTypes.string
};

export default PageHeader;
