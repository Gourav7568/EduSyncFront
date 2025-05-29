/**
 * Helper utility functions for the EduSync LMS application
 */

/**
 * Format a date string to a human-readable format
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include time in the formatted date
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Calculate the percentage from a score and max score
 * @param {number} score - The achieved score
 * @param {number} maxScore - The maximum possible score
 * @returns {number} The percentage (0-100)
 */
export const calculatePercentage = (score, maxScore) => {
  if (!maxScore || maxScore === 0) return 0;
  return Math.round((score / maxScore) * 100);
};

/**
 * Determine if a score passes based on a threshold
 * @param {number} score - The achieved score
 * @param {number} maxScore - The maximum possible score
 * @param {number} threshold - The passing threshold (default: 0.7 or 70%)
 * @returns {boolean} Whether the score passes the threshold
 */
export const isPassing = (score, maxScore, threshold = 0.7) => {
  return calculatePercentage(score, maxScore) / 100 >= threshold;
};

/**
 * Truncate a string to a specified length and add ellipsis if needed
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated string with ellipsis if needed
 */
export const truncateString = (str, maxLength = 100) => {
  if (!str) return '';
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

/**
 * Generate a random avatar URL based on name
 * @param {string} name - User's name
 * @returns {string} URL to a random avatar
 */
export const getAvatarUrl = (name) => {
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
    : 'U';
  
  // Use the UI Avatars service to generate an avatar based on initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&size=128`;
};

/**
 * Get a color based on a percentage value (red to green gradient)
 * @param {number} percentage - Percentage value (0-100)
 * @returns {string} HEX color code
 */
export const getColorByPercentage = (percentage) => {
  if (percentage >= 80) return '#28a745'; // Green
  if (percentage >= 70) return '#5cb85c'; // Light Green
  if (percentage >= 60) return '#ffc107'; // Yellow
  if (percentage >= 50) return '#fd7e14'; // Orange
  return '#dc3545'; // Red
};
