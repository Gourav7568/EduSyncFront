import apiClient from './apiClient';

// Base API URL - change this to your backend API URL
const API_BASE_URL = 'https://localhost:7252';

const getAllCourses = async () => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Courses`;
  console.log('Fetching all courses from:', url);
  
  const response = await apiClient.get(url);
  return response.data;
};

const getCourseById = async (id) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Courses/${id}`;
  console.log('Fetching course details from:', url);
  
  const response = await apiClient.get(url);
  return response.data;
};

const createCourse = async (courseData) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Courses`;
  console.log('Creating course at:', url);
  
  // Option 1: Send data as-is (camelCase)
  const response = await apiClient.post(url, courseData);
  
  // Option 2: Format for ASP.NET Core API (PascalCase)
  // Uncomment this if your API expects PascalCase
  /*
  const response = await apiClient.post(url, {
    Title: courseData.title,
    Description: courseData.description,
    // Add other fields with PascalCase formatting
  });
  */
  
  return response.data;
};

const updateCourse = async (id, courseData) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Courses/${id}`;
  console.log('Updating course at:', url);
  
  // Option 1: Send data as-is (camelCase)
  const response = await apiClient.put(url, courseData);
  
  // Option 2: Format for ASP.NET Core API (PascalCase)
  // Uncomment this if your API expects PascalCase
  /*
  const response = await apiClient.put(url, {
    Title: courseData.title,
    Description: courseData.description,
    // Add other fields with PascalCase formatting
  });
  */
  
  return response.data;
};

const deleteCourse = async (id) => {
  // Direct API URL - customize this to match your backend API
  const url = `${API_BASE_URL}/api/Courses/${id}`;
  console.log('Deleting course at:', url);
  
  const response = await apiClient.delete(url);
  return response.data;
};

const courseService = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};

export default courseService;
