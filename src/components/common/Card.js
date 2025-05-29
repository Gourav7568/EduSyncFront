import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Card component with consistent styling and options
 * 
 * @param {Object} props - Component props
 * @param {string} [props.title] - Optional card title
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.icon] - Optional Bootstrap icon class
 * @param {string} [props.variant] - Optional color variant (primary, success, info, etc.)
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.action] - Optional action element in header
 * @param {Object} [props.headerProps] - Props for the card header
 * @param {Object} [props.bodyProps] - Props for the card body
 * @param {boolean} [props.noPadding] - If true, removes padding from card body
 * @param {boolean} [props.noBorder] - If true, removes border from card
 * @param {boolean} [props.noShadow] - If true, removes shadow from card
 */
const Card = ({ 
  title, 
  children, 
  icon, 
  variant, 
  className = '', 
  action,
  headerProps = {},
  bodyProps = {},
  noPadding = false,
  noBorder = false,
  noShadow = false
}) => {
  // Determine card classes
  const cardClasses = [
    'card',
    noBorder ? 'border-0' : '',
    noShadow ? '' : 'shadow-sm',
    className
  ].filter(Boolean).join(' ');

  // Determine header classes
  const headerClasses = [
    'card-header',
    variant ? `bg-${variant} ${['primary', 'success', 'danger', 'warning', 'info', 'dark'].includes(variant) ? 'text-white' : ''}` : 'bg-white',
    headerProps.className || ''
  ].filter(Boolean).join(' ');

  // Determine body classes
  const bodyClasses = [
    'card-body',
    noPadding ? 'p-0' : '',
    bodyProps.className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {title && (
        <div className={headerClasses} {...headerProps}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold d-flex align-items-center">
              {icon && <i className={`${icon} me-2`}></i>}
              {title}
            </h5>
            {action && (
              <div className="card-actions">
                {action}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={bodyClasses} {...bodyProps}>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  icon: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
  action: PropTypes.node,
  headerProps: PropTypes.object,
  bodyProps: PropTypes.object,
  noPadding: PropTypes.bool,
  noBorder: PropTypes.bool,
  noShadow: PropTypes.bool
};

export default Card;
