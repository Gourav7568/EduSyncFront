import { useState, useCallback } from 'react';
import { useNotification } from '../utils/NotificationContext';

/**
 * Custom hook for form handling
 * 
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Function to call on form submission
 * @param {Function} validate - Validation function (optional)
 * @returns {Object} Form handling utilities
 */
const useForm = (initialValues = {}, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();
  
  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      setValues(prevValues => ({
        ...prevValues,
        [name]: checked
      }));
    } 
    // Handle regular inputs
    else {
      setValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
    }
    
    // If there was an error, clear it when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  }, [errors]);
  
  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // If validation function exists, validate on blur
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors[name]) {
        setErrors(prevErrors => ({
          ...prevErrors,
          [name]: validationErrors[name]
        }));
      }
    }
  }, [values, validate]);
  
  // Set a specific form field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }, []);
  
  // Set a specific form field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  }, []);
  
  // Mark a field as touched programmatically
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: isTouched
    }));
  }, []);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Set all fields as touched
    const touchedFields = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(touchedFields);
    
    // Validate if validation function exists
    let formErrors = {};
    if (validate) {
      formErrors = validate(values);
      setErrors(formErrors);
    }
    
    // If there are errors, don't submit
    if (Object.keys(formErrors).length > 0) {
      if (notification) {
        notification.error('Please fix the errors in the form before submitting.');
      }
      return;
    }
    
    // Submit the form
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // If API returns field-specific errors
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } 
      // General error
      else if (notification) {
        const errorMessage = error.userMessage || error.message || 'An error occurred while submitting the form.';
        notification.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit, notification]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    setValues
  };
};

export default useForm;
