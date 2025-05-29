import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import apiConfig from '../../config/apiConfig';
import api from '../../services/api';

// Special editable form component for React 19.1.0
const EditableForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isEditing = !!id;
  
  // Form state - using strings to ensure proper editing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  
  // Other state
  const [instructorId, setInstructorId] = useState(currentUser?.userId || '');
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // API endpoint
  const API_BASE_URL = 'https://localhost:7252';
  const API_URL = `${API_BASE_URL}/api${apiConfig.API_ENDPOINTS.COURSES.BASE}`;

  // Load course data when editing
  useEffect(() => {
    if (!isEditing) return;
    
    const loadCourseData = async () => {
      try {
        setLoading(true);
        console.log(`Loading course data for ID: ${id}`);
        const response = await api.get(`${API_URL}/${id}`);
        const data = response.data;
        console.log('Received course data:', data);
        
        // Update state with retrieved data
        setTitle(data.title || '');
        setDescription(data.description || '');
        setMediaUrl(data.mediaUrl || '');
        setInstructorId(data.instructorId || currentUser?.userId || '');
        
      } catch (error) {
        console.error('Error loading course:', error);
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCourseData();
  }, [id, isEditing, API_URL, currentUser?.userId]);

  // Event handlers for each field
  const handleTitleChange = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setDescription(e.target.value);
  }, []);
  
  const handleMediaUrlChange = useCallback((e) => {
    setMediaUrl(e.target.value);
  }, []);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError('');
    
    try {
      // Prepare data for submission
      const courseData = {
        title: title.trim(),
        description: description.trim(),
        mediaUrl: mediaUrl.trim(),
        instructorId
      };
      
      console.log('Form data to submit:', courseData);
      
      if (isEditing) {
        // Update existing course
        console.log(`Updating course ${id}`);
        
        // Ensure courseId is included for updates
        const updateData = {
          ...courseData,
          courseId: id
        };
        
        const updateUrl = `${API_URL}/${id}`;
        console.log('Sending to:', updateUrl);
        console.log('Update payload:', updateData);
        
        await api.put(updateUrl, updateData);
        console.log('Course updated successfully');
      } else {
        // Create new course
        console.log('Creating new course');
        await api.post(API_URL, courseData);
        console.log('Course created successfully');
      }
      
      // Redirect to courses page
      navigate('/courses');
      
    } catch (error) {
      console.error('Error saving course:', error);
      setError(`Failed to save course: ${error.response?.data?.message || error.message}`);
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
                {/* Title Field */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={title}
                    onChange={handleTitleChange}
                    required
                  />
                </div>
                
                {/* Description Field */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={description}
                    onChange={handleDescriptionChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
                
                {/* Media URL Field */}
                <div className="mb-3">
                  <label htmlFor="mediaUrl" className="form-label">Media URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="mediaUrl"
                    name="mediaUrl"
                    value={mediaUrl}
                    onChange={handleMediaUrlChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="form-text">
                    URL to course cover image. Make sure the URL is a direct link to an image file.
                  </div>
                  
                  {/* Image Preview */}
                  {mediaUrl && (
                    <div className="mt-2">
                      <label className="form-label">Image Preview:</label>
                      <div className="border rounded p-2">
                        <img 
                          src={mediaUrl}
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
                
                {/* Form Buttons */}
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

export default EditableForm;
