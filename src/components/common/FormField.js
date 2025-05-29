import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable FormField component to standardize form inputs across the application
 * 
 * @param {Object} props - Component props
 */
const FormField = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  disabled = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  helpText,
  options,
  rows = 3,
  icon,
  prependText,
  appendText,
  autoComplete
}) => {
  // Generate a unique ID for the input
  const id = `field-${name}`;
  
  // Determine validation classes
  const validationClass = touched ? (error ? 'is-invalid' : 'is-valid') : '';
  
  // Render different input types
  const renderInput = () => {
    const commonProps = {
      id,
      name,
      value: value || '',
      onChange,
      onBlur,
      disabled,
      required,
      className: `form-control ${validationClass} ${inputClassName}`,
      placeholder,
      'aria-describedby': error ? `${id}-feedback` : undefined,
      autoComplete
    };
    
    // Render select element
    if (type === 'select') {
      return (
        <select {...commonProps}>
          {options && options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    
    // Render textarea
    if (type === 'textarea') {
      return <textarea {...commonProps} rows={rows} />;
    }
    
    // Render checkbox
    if (type === 'checkbox') {
      return (
        <div className="form-check">
          <input 
            type="checkbox"
            className={`form-check-input ${validationClass}`}
            id={id}
            name={name}
            checked={!!value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
          />
          <label className="form-check-label" htmlFor={id}>
            {label}
          </label>
          {error && touched && (
            <div id={`${id}-feedback`} className="invalid-feedback">
              {error}
            </div>
          )}
        </div>
      );
    }
    
    // Render radio buttons
    if (type === 'radio' && options) {
      return (
        <div>
          {options.map((option, index) => (
            <div className="form-check" key={index}>
              <input
                type="radio"
                className={`form-check-input ${validationClass}`}
                id={`${id}-${index}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                required={required}
              />
              <label className="form-check-label" htmlFor={`${id}-${index}`}>
                {option.label}
              </label>
            </div>
          ))}
          {error && touched && (
            <div id={`${id}-feedback`} className="invalid-feedback d-block">
              {error}
            </div>
          )}
        </div>
      );
    }
    
    // For prepended or appended text
    if (prependText || appendText || icon) {
      return (
        <div className="input-group">
          {prependText && (
            <span className="input-group-text">{prependText}</span>
          )}
          {icon && (
            <span className="input-group-text">
              <i className={icon}></i>
            </span>
          )}
          <input type={type} {...commonProps} />
          {appendText && (
            <span className="input-group-text">{appendText}</span>
          )}
          {error && touched && (
            <div id={`${id}-feedback`} className="invalid-feedback">
              {error}
            </div>
          )}
        </div>
      );
    }
    
    // Default input
    return (
      <input type={type} {...commonProps} />
    );
  };
  
  // Don't wrap checkbox in the standard layout
  if (type === 'checkbox') {
    return renderInput();
  }

  // Standard layout for other input types
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={id} className={`form-label ${labelClassName}`}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && touched && type !== 'radio' && !(prependText || appendText || icon) && (
        <div id={`${id}-feedback`} className="invalid-feedback">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div className="form-text text-muted small">
          {helpText}
        </div>
      )}
    </div>
  );
};

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  helpText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  rows: PropTypes.number,
  icon: PropTypes.string,
  prependText: PropTypes.string,
  appendText: PropTypes.string,
  autoComplete: PropTypes.string
};

export default FormField;
