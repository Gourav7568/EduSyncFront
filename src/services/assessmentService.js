import apiClient from './apiClient';

// Base API URL - change this to your backend API URL
const API_BASE_URL = 'https://localhost:7252';

const getAllAssessments = async () => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Assessments`;
  console.log('Fetching all assessments from:', url);
  
  const response = await apiClient.get(url);
  return response.data;
};

const getAssessmentById = async (id) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Assessments/${id}`;
  console.log('Fetching assessment details from:', url);
  
  const response = await apiClient.get(url);
  return response.data;
};

const createAssessment = async (assessmentData) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Assessments`;
  console.log('Creating assessment at:', url);
  
  // Option 1: Send data as-is (camelCase)
  const response = await apiClient.post(url, assessmentData);
  
  // Option 2: Format for ASP.NET Core API (PascalCase)
  // Uncomment this if your API expects PascalCase
  /*
  const response = await apiClient.post(url, {
    Title: assessmentData.title,
    Description: assessmentData.description,
    // Add other fields with PascalCase formatting
  });
  */
  
  return response.data;
};

const updateAssessment = async (id, assessmentData) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Assessments/${id}`;
  console.log('Updating assessment at:', url);
  
  // Option 1: Send data as-is (camelCase)
  const response = await apiClient.put(url, assessmentData);
  
  // Option 2: Format for ASP.NET Core API (PascalCase)
  // Uncomment this if your API expects PascalCase
  /*
  const response = await apiClient.put(url, {
    Title: assessmentData.title,
    Description: assessmentData.description,
    // Add other fields with PascalCase formatting
  });
  */
  
  return response.data;
};

const deleteAssessment = async (id) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Assessments/${id}`;
  console.log('Deleting assessment at:', url);
  
  const response = await apiClient.delete(url);
  return response.data;
};

const assessmentService = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment
};

export default assessmentService;
