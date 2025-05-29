import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Modal component for the application
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.size] - Modal size (sm, lg, xl)
 * @param {boolean} [props.centered] - Whether the modal is vertically centered
 * @param {boolean} [props.staticBackdrop] - Whether clicking the backdrop doesn't close the modal
 * @param {React.ReactNode} [props.footer] - Custom footer content
 * @param {string} [props.confirmText] - Text for the confirm button
 * @param {string} [props.cancelText] - Text for the cancel button
 * @param {function} [props.onConfirm] - Function to call when the confirm button is clicked
 * @param {string} [props.confirmButtonVariant] - Bootstrap variant for the confirm button
 */
const Modal = ({
  show,
  onClose,
  title,
  children,
  size,
  centered = false,
  staticBackdrop = false,
  footer,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  confirmButtonVariant = 'primary'
}) => {
  // Early return if not showing
  if (!show) return null;

  // Determine modal size class
  const sizeClass = size ? `modal-${size}` : '';
  
  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !staticBackdrop) {
      onClose();
    }
  };
  
  // Handle confirm button click
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      role="dialog" 
      onClick={handleBackdropClick}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div 
        className={`modal-dialog ${sizeClass} ${centered ? 'modal-dialog-centered' : ''}`} 
        role="document"
      >
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            {footer ? (
              footer
            ) : (
              <>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={onClose}
                >
                  {cancelText}
                </button>
                {confirmText && onConfirm && (
                  <button 
                    type="button" 
                    className={`btn btn-${confirmButtonVariant}`} 
                    onClick={handleConfirm}
                  >
                    {confirmText}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.string,
  centered: PropTypes.bool,
  staticBackdrop: PropTypes.bool,
  footer: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmButtonVariant: PropTypes.string
};

export default Modal;
