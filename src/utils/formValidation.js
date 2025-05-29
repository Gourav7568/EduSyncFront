/**
 * Form validation utility functions for the EduSync LMS application
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid flag and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is strong'
  };
};

/**
 * Validates that passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {boolean} - Whether passwords match
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validates a required field
 * @param {string} value - Field value
 * @returns {boolean} - Whether the field is valid
 */
export const isRequired = (value) => {
  return value !== undefined && value !== null && value.trim() !== '';
};

/**
 * Validates minimum length
 * @param {string} value - Field value
 * @param {number} minLength - Minimum required length
 * @returns {boolean} - Whether the field meets minimum length
 */
export const hasMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

/**
 * Validates maximum length
 * @param {string} value - Field value
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} - Whether the field meets maximum length
 */
export const hasMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

/**
 * Validates numeric value
 * @param {string} value - Field value
 * @returns {boolean} - Whether the field is numeric
 */
export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validates date format
 * @param {string} value - Date string to validate
 * @returns {boolean} - Whether the date is valid
 */
export const isValidDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

/**
 * Validates URL format
 * @param {string} value - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get form field validation class based on validation state
 * @param {boolean} isValid - Whether the field is valid
 * @param {boolean} isDirty - Whether the field has been touched/modified
 * @returns {string} - CSS class for validation visual feedback
 */
export const getValidationClass = (isValid, isDirty) => {
  if (!isDirty) return '';
  return isValid ? 'is-valid' : 'is-invalid';
};

export default {
  isValidEmail,
  validatePassword,
  passwordsMatch,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isNumeric,
  isValidDate,
  isValidUrl,
  getValidationClass
};
