import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import courseService from '../../services/courseService';
import api from '../../services/api';

// Direct API URLs for assessments
const API_BASE_URL = 'https://localhost:7252';
const ASSESSMENTS_API = `${API_BASE_URL}/api/Assessments`;

const AssessmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseIdFromQuery = queryParams.get('courseId');
  const isEditing = !!id;

  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    courseId: courseIdFromQuery || '',
    maxScore: 100,
    questions: []
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all courses for dropdown
        const courseData = await courseService.getAllCourses();
        setCourses(courseData);
        
        if (isEditing) {
          // If editing, fetch the assessment data directly from the API
          const getUrl = `${ASSESSMENTS_API}/${id}`;
          console.log('Fetching assessment details from:', getUrl);
          
          const response = await api.get(getUrl);
          const assessmentData = response.data;
          console.log('Fetched assessment data:', assessmentData);
          
          // Parse questions if they're stored as a string
          let questions;
          if (typeof assessmentData.questions === 'string') {
            questions = JSON.parse(assessmentData.questions);
          } else {
            questions = assessmentData.questions || [];
          }
          
          setFormData({
            title: assessmentData.title,
            courseId: assessmentData.courseId,
            maxScore: assessmentData.maxScore,
            questions: questions
          });
          console.log('Form data set for editing:', {
            title: assessmentData.title,
            courseId: assessmentData.courseId,
            maxScore: assessmentData.maxScore,
            questions: questions
          });
        } else if (courseIdFromQuery) {
          // If creating with a course ID from query params
          setFormData(prev => ({ ...prev, courseId: courseIdFromQuery }));
        }
      } catch (err) {
        setError('Failed to load required data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing, courseIdFromQuery]);

  // Handler for basic form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Assessment field ${name} changing to:`, value);
    
    // Force update the form data with the new value
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };
      console.log('Updated assessment form data:', newData);
      return newData;
    });
  };

  // Add a new empty question
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          points: 10
        }
      ]
    });
  };

  // Remove a question
  const removeQuestion = (index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Update a question
  const updateQuestion = (index, field, value) => {
    console.log(`Updating question ${index}, field ${field} to:`, value);
    
    // Create a deep copy of the questions array to ensure React detects the change
    const updatedQuestions = JSON.parse(JSON.stringify(formData.questions));
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    
    // Force update with the new questions array
    setFormData(prevData => {
      const newData = { ...prevData, questions: updatedQuestions };
      console.log('Updated questions array:', newData.questions);
      return newData;
    });
  };

  // Update an option for a multiple choice question
  const updateOption = (questionIndex, optionIndex, value) => {
    console.log(`Updating question ${questionIndex}, option ${optionIndex} to: ${value}`);
    
    // Create a deep copy of the questions array
    const updatedQuestions = JSON.parse(JSON.stringify(formData.questions));
    const options = updatedQuestions[questionIndex].options;
    options[optionIndex] = value;
    
    // Force update with the new questions array
    setFormData(prevData => {
      const newData = { ...prevData, questions: updatedQuestions };
      console.log('Updated options array:', options);
      return newData;
    });
  };

  // Add option to a question
  const addOption = (questionIndex) => {
    console.log(`Adding new option to question ${questionIndex}`);
    
    // Create a deep copy of the questions array
    const updatedQuestions = JSON.parse(JSON.stringify(formData.questions));
    updatedQuestions[questionIndex].options = [
      ...updatedQuestions[questionIndex].options,
      ''
    ];
    
    // Force update with the new questions array
    setFormData(prevData => {
      const newData = { ...prevData, questions: updatedQuestions };
      console.log('Updated with new option:', updatedQuestions[questionIndex].options);
      return newData;
    });
  };

  // Remove option from a question
  const removeOption = (questionIndex, optionIndex) => {
    console.log(`Removing option ${optionIndex} from question ${questionIndex}`);
    
    // Create a deep copy of the questions array
    const updatedQuestions = JSON.parse(JSON.stringify(formData.questions));
    const options = updatedQuestions[questionIndex].options;
    options.splice(optionIndex, 1);
    
    // If we removed the correct answer, reset it
    if (updatedQuestions[questionIndex].correctAnswer === options[optionIndex]) {
      updatedQuestions[questionIndex].correctAnswer = '';
    }
    
    // Force update with the new questions array
    setFormData(prevData => {
      const newData = { ...prevData, questions: updatedQuestions };
      console.log('Updated after removing option:', options);
      return newData;
    });
  };

  // Toggle between multiple choice and text input
  const toggleQuestionType = (questionIndex) => {
    console.log(`Toggling question type for question ${questionIndex}`);
    
    // Create a deep copy of the questions array
    const updatedQuestions = JSON.parse(JSON.stringify(formData.questions));
    const question = updatedQuestions[questionIndex];
    
    if (question.options) {
      // Convert to text input
      console.log('Converting to text input');
      delete question.options;
      question.correctAnswer = '';
    } else {
      // Convert to multiple choice
      console.log('Converting to multiple choice');
      question.options = ['', '', '', ''];
      question.correctAnswer = '';
    }
    
    // Force update with the new questions array
    setFormData(prevData => {
      const newData = { ...prevData, questions: updatedQuestions };
      console.log('Updated after toggling question type:', question);
      return newData;
    });
  };

  // Calculate total points
  const calculateTotalPoints = () => {
    return formData.questions.reduce((total, q) => total + (parseInt(q.points) || 0), 0);
  };
  
  // Validate questions data to prevent database truncation
  const validateQuestionsSize = (questions) => {
    // Convert to JSON string and check length
    const jsonString = JSON.stringify(questions);
    console.log('Questions JSON size:', jsonString.length, 'characters');
    
    // Database column likely has a limit of around 4000-8000 characters
    // Increased from 1000 to 5000 to accommodate larger assessments
    const MAX_CHARS = 5000;
    
    if (jsonString.length > MAX_CHARS) {
      return {
        valid: false,
        message: `Questions data is too large (${jsonString.length} chars). Please reduce the number of questions or the length of question text and options.`
      };
    }
    
    return { valid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validation
    if (formData.questions.length === 0) {
      setError('Please add at least one question to the assessment.');
      setSubmitting(false);
      return;
    }

    // Check that all questions have content and correct answers
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} is empty. Please provide a question.`);
        setSubmitting(false);
        return;
      }
      
      if (!q.correctAnswer) {
        setError(`Question ${i + 1} has no correct answer. Please specify one.`);
        setSubmitting(false);
        return;
      }
      
      if (q.options) {
        // Check if any options are empty
        const emptyOptions = q.options.filter(opt => !opt.trim()).length;
        if (emptyOptions > 0) {
          setError(`Question ${i + 1} has empty options. Please fill all options or remove them.`);
          setSubmitting(false);
          return;
        }
        
        // Check if correct answer is one of the options
        if (!q.options.includes(q.correctAnswer)) {
          setError(`Question ${i + 1}'s correct answer is not in the options.`);
          setSubmitting(false);
          return;
        }
      }
    }
    
    // Validate total size of questions to prevent database truncation
    const sizeValidation = validateQuestionsSize(formData.questions);
    if (!sizeValidation.valid) {
      setError(sizeValidation.message);
      setSubmitting(false);
      return;
    }

    try {
      // Update maxScore to match total points
      const calculatedMaxScore = calculateTotalPoints();
      
      // Optimize questions data before submitting
      // 1. Trim all text fields to remove extra whitespace
      // 2. Remove any unnecessary fields
      const optimizedQuestions = formData.questions.map(q => ({
        question: q.question.trim(),
        correctAnswer: q.correctAnswer.trim(),
        points: q.points,
        // Only include options if it's a multiple choice question
        ...(q.options ? { options: q.options.map(opt => opt.trim()) } : {})
      }));
      
      // Double-check size after optimization
      const optimizedValidation = validateQuestionsSize(optimizedQuestions);
      if (!optimizedValidation.valid) {
        setError('Even after optimization, the questions data is still too large. Please reduce the number or size of questions.');
        setSubmitting(false);
        return;
      }
      
      const dataToSubmit = {
        ...formData,
        title: formData.title.trim(),
        maxScore: calculatedMaxScore,
        questions: JSON.stringify(optimizedQuestions)
      };
      
      // Log the data we're submitting for debugging
      console.log('Assessment data to submit:', dataToSubmit);
      console.log('Questions JSON size after optimization:', dataToSubmit.questions.length, 'characters');
      
      try {
        if (isEditing) {
          // Direct API call for updating assessment
          const updateUrl = `${ASSESSMENTS_API}/${id}`;
          console.log('Updating assessment at:', updateUrl);
          
          const response = await api.put(updateUrl, dataToSubmit);
          console.log('Update successful, response:', response.data);
        } else {
          // Direct API call for creating assessment
          const createUrl = ASSESSMENTS_API;
          console.log('Creating assessment at:', createUrl);
          
          const response = await api.post(createUrl, dataToSubmit);
          console.log('Create successful, response:', response.data);
        }
        
        navigate(formData.courseId ? `/courses/${formData.courseId}` : '/assessments');
      } catch (apiError) {
        console.error('API Error details:', apiError.response?.data || apiError.message);
        throw apiError; // Re-throw to be caught by the outer catch block
      }
    } catch (err) {
      setError('Failed to save assessment. Please try again.');
      console.error(err);
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
    <div className="container my-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">{isEditing ? 'Edit Assessment' : 'Create New Assessment'}</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Assessment Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="courseId" className="form-label">Course</label>
                  <select
                    className="form-select"
                    id="courseId"
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                      <option key={course.courseId} value={course.courseId}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <h4>Questions</h4>
                <div>
                  <p className="mb-0">Total Points: {calculateTotalPoints()}</p>
                </div>
              </div>
              
              <hr />
              
              {formData.questions.length === 0 ? (
                <div className="alert alert-info">
                  No questions added yet. Click the button below to add your first question.
                </div>
              ) : (
                formData.questions.map((question, qIndex) => (
                  <div key={qIndex} className="card mb-4">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Question {qIndex + 1}</h5>
                      <div>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => toggleQuestionType(qIndex)}
                        >
                          {question.options ? 'Convert to Text' : 'Convert to Multiple Choice'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeQuestion(qIndex)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label htmlFor={`question-${qIndex}`} className="form-label">Question Text</label>
                        <input
                          type="text"
                          className="form-control"
                          id={`question-${qIndex}`}
                          value={question.question}
                          onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                          required
                        />
                      </div>
                      
                      {question.options ? (
                        // Multiple choice question
                        <div className="mb-3">
                          <label className="form-label">Options</label>
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="input-group mb-2">
                              <div className="input-group-text">
                                <input
                                  type="radio"
                                  name={`correct-answer-${qIndex}`}
                                  checked={question.correctAnswer === option}
                                  onChange={() => updateQuestion(qIndex, 'correctAnswer', option)}
                                  disabled={!option.trim()}
                                />
                              </div>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={`Option ${optIndex + 1}`}
                                value={option}
                                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeOption(qIndex, optIndex)}
                                disabled={question.options.length <= 2}
                              >
                                <i className="bi bi-trash"></i> Remove
                              </button>
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => addOption(qIndex)}
                          >
                            Add Option
                          </button>
                        </div>
                      ) : (
                        // Text input question
                        <div className="mb-3">
                          <label htmlFor={`correct-answer-${qIndex}`} className="form-label">Correct Answer</label>
                          <input
                            type="text"
                            className="form-control"
                            id={`correct-answer-${qIndex}`}
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                            required
                          />
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <label htmlFor={`points-${qIndex}`} className="form-label">Points</label>
                        <input
                          type="number"
                          className="form-control"
                          id={`points-${qIndex}`}
                          value={question.points}
                          onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 0)}
                          min="1"
                          max="100"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={addQuestion}
                >
                  Add Question
                </button>
              </div>
            </div>
            
            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || formData.questions.length === 0}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Assessment' : 'Create Assessment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;
