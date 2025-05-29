import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import courseService from '../../services/courseService';
import assessmentService from '../../services/assessmentService';
import authService from '../../services/authService';
import apiConfig from '../../config/apiConfig';
import api from '../../services/api';

// Direct API URLs
const API_BASE_URL = 'https://localhost:7252';

// Base URL for all course operations
// - GET    /api/Courses         - Get all courses
// - POST   /api/Courses         - Create a new course
// - GET    /api/Courses/{id}    - Get a specific course
// - PUT    /api/Courses/{id}    - Update a specific course
// - DELETE /api/Courses/{id}    - Delete a specific course
const COURSES_API = `${API_BASE_URL}/api/Courses`;

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = authService.getCurrentUser();
  const isInstructor = currentUser?.role === 'Instructor';
  const isInstructorOfCourse = isInstructor && currentUser?.userId === course?.instructorId;

  useEffect(() => {
    const fetchCourseAndAssessments = async () => {
      try {
        // Direct API call to get course by ID
        const courseUrl = `${COURSES_API}/${id}`;
        console.log('Fetching course details from:', courseUrl);
        
        const courseResponse = await api.get(courseUrl);
        setCourse(courseResponse.data);
        
        // Fetch assessments for this course
        const allAssessments = await assessmentService.getAllAssessments();
        const courseAssessments = allAssessments.filter(a => a.courseId === id);
        setAssessments(courseAssessments);
      } catch (err) {
        setError(`Failed to load course details: ${err.response?.data?.message || err.message}`);
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndAssessments();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        // Using direct API call with auth token via api service
        const url = `${COURSES_API}/${id}`;
        console.log('Deleting course at:', url);
        
        await api.delete(url);
        navigate('/courses');
      } catch (err) {
        setError(`Failed to delete course: ${err.response?.data?.message || err.message}`);
        console.error('Delete error:', err);
      }
    }
  };
  
  // Function to navigate to the edit form
  const handleEdit = () => {
    // This navigates to the edit form page where the user can make changes
    navigate(`/courses/edit/${id}`);
  };
  
  // Direct API function to update a course
  // Note: This function is not currently used in this component, 
  // but shows how to directly call the update API
  const updateCourse = async (courseData) => {
    try {
      // URL for updating a specific course (PUT method)
      // Same URL pattern as delete, but uses PUT instead of DELETE
      const updateUrl = `${COURSES_API}/${id}`;
      console.log('Updating course at:', updateUrl);
      
      // Make PUT request with course data
      const response = await api.put(updateUrl, courseData);
      return response.data;
    } catch (err) {
      console.error('Error updating course:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        Course not found.
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            {course.mediaUrl ? (
              <div className="course-image-container">
                <img
                  src={course.mediaUrl}
                  className="card-img-top"
                  alt={course.title}
                  style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
                  onError={(e) => {
                    console.log('Image failed to load:', course.mediaUrl);
                    e.target.onerror = null; // Prevent infinite fallback loop
                    e.target.src = 'https://via.placeholder.com/800x400?text=Course+Image+Not+Available';
                  }}
                />
              </div>
            ) : (
              <div className="card-img-top bg-light d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <p className="text-muted">No image available</p>
              </div>
            )}
            <div className="card-body">
              <h2 className="card-title">{course.title}</h2>
              <p className="card-text">{course.description}</p>
              
              {isInstructorOfCourse && (
                <div className="d-flex mt-3">
                  <button onClick={handleEdit} className="btn btn-outline-primary me-2">
                    Edit Course
                  </button>
                  <button onClick={handleDelete} className="btn btn-outline-danger">
                    Delete Course
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Assessments</h4>
            </div>
            <div className="card-body">
              {assessments.length === 0 ? (
                <p className="text-muted">No assessments available for this course.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {assessments.map((assessment) => (
                    <li key={assessment.assessmentId} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{assessment.title}</h5>
                        <small className="text-muted">Max Score: {assessment.maxScore}</small>
                      </div>
                      <Link
                        to={`/assessments/${assessment.assessmentId}`}
                        className="btn btn-sm btn-primary"
                      >
                        {currentUser?.role === 'Student' ? 'Take Quiz' : 'View Details'}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              
              {isInstructorOfCourse && (
                <div className="d-grid gap-2 mt-3">
                  <Link
                    to={`/assessments/create?courseId=${id}`}
                    className="btn btn-success"
                  >
                    Create New Assessment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
