import apiClient from './apiClient';

// Base API URL - change this to your backend API URL
const API_BASE_URL = 'https://localhost:7252';

const getAllResults = async () => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Results`;
  console.log('Fetching all results from:', url);
  
  const response = await apiClient.get(url);
  return response.data;
};

const getResultById = async (id) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Results/${id}`;
  console.log('Fetching result details from:', url);
  
  const response = await apiClient.get(url);
  return response.data;
};

const createResult = async (resultData) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Results`;
  console.log('Creating result at:', url);
  
  // Option 1: Send data as-is (camelCase)
  const response = await apiClient.post(url, resultData);
  
  // Option 2: Format for ASP.NET Core API (PascalCase)
  // Uncomment this if your API expects PascalCase
  /*
  const response = await apiClient.post(url, {
    AssessmentId: resultData.assessmentId,
    UserId: resultData.userId,
    Score: resultData.score,
    // Add other fields with PascalCase formatting
  });
  */
  
  return response.data;
};

const updateResult = async (id, resultData) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Results/${id}`;
  console.log('Updating result at:', url);
  
  // Option 1: Send data as-is (camelCase)
  const response = await apiClient.put(url, resultData);
  
  // Option 2: Format for ASP.NET Core API (PascalCase)
  // Uncomment this if your API expects PascalCase
  /*
  const response = await apiClient.put(url, {
    AssessmentId: resultData.assessmentId,
    UserId: resultData.userId,
    Score: resultData.score,
    // Add other fields with PascalCase formatting
  });
  */
  
  return response.data;
};

const deleteResult = async (id) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Results/${id}`;
  console.log('Deleting result at:', url);
  
  const response = await apiClient.delete(url);
  return response.data;
};

const resultService = {
  getAllResults,
  getResultById,
  createResult,
  updateResult,
  deleteResult
};

export default resultService;
