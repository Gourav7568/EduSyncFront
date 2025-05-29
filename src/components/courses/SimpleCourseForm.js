import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import apiConfig from '../../config/apiConfig';
import api from '../../services/api';

// Simple course form with basic HTML form
const SimpleCourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isEditing = !!id;
  
  // State
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    instructorId: currentUser?.userId || ''
  });
  
  // API endpoints
  const API_BASE_URL = 'https://localhost:7252';
  const API_URL = `${API_BASE_URL}/api${apiConfig.API_ENDPOINTS.COURSES.BASE}`;

  // Load course data for editing
  useEffect(() => {
    if (!currentUser) {
      setError('You must be logged in to manage courses.');
      return;
    }

    if (isEditing) {
      const fetchCourse = async () => {
        try {
          console.log(`Fetching course with ID ${id}`);
          const response = await api.get(`${API_URL}/${id}`);
          console.log('Course data received:', response.data);
          
          setCourseData({
            title: response.data.title || '',
            description: response.data.description || '',
            mediaUrl: response.data.mediaUrl || '',
            instructorId: response.data.instructorId || currentUser?.userId || ''
          });
        } catch (err) {
          console.error('Error fetching course:', err);
          setError('Failed to load course details for editing.');
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [id, isEditing, currentUser, API_URL]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    const submitData = {
      ...courseData,
      title: courseData.title.trim(),
      description: courseData.description.trim(),
      mediaUrl: courseData.mediaUrl.trim()
    };
    
    console.log('Submitting course data:', submitData);
    
    try {
      if (isEditing) {
        // Update existing course
        console.log(`Updating course with ID ${id}`);
        const updateUrl = `${API_URL}/${id}`;
        const updatePayload = {
          courseId: id,
          ...submitData
        };
        
        await api.put(updateUrl, updatePayload);
        console.log('Course updated successfully');
      } else {
        // Create new course
        await api.post(API_URL, submitData);
        console.log('Course created successfully');
      }
      
      // Redirect to courses list
      navigate('/courses');
    } catch (err) {
      console.error('Error saving course:', err);
      setError(`Failed to save course: ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmitting(false);
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

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">{isEditing ? 'Edit Course' : 'Create New Course'}</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={courseData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={courseData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="mediaUrl" className="form-label">Media URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="mediaUrl"
                    name="mediaUrl"
                    value={courseData.mediaUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="form-text">
                    URL to course cover image. Make sure the URL is a direct link to an image file (ending in .jpg, .png, etc.)
                  </div>
                  
                  {courseData.mediaUrl && (
                    <div className="mt-2">
                      <label className="form-label">Image Preview:</label>
                      <div className="border rounded p-2">
                        <img 
                          src={courseData.mediaUrl}
                          alt="Preview"
                          className="img-fluid"
                          style={{ maxHeight: '150px', display: 'block', margin: '0 auto' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/courses')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEditing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEditing ? 'Update Course' : 'Create Course'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCourseForm;
