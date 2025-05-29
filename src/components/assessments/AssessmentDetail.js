import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import resultService from '../../services/resultService';
import courseService from '../../services/courseService';
import authService from '../../services/authService';

const AssessmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isStudent = currentUser?.role === 'Student';
  const isInstructor = currentUser?.role === 'Instructor';

  const [assessment, setAssessment] = useState(null);
  const [course, setCourse] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchAssessmentAndCourse = async () => {
      try {
        const assessmentData = await assessmentService.getAssessmentById(id);
        setAssessment(assessmentData);
        
        // Initialize answers object with empty values
        if (assessmentData.questions) {
          const parsedQuestions = typeof assessmentData.questions === 'string' 
            ? JSON.parse(assessmentData.questions) 
            : assessmentData.questions;
            
          const initialAnswers = {};
          parsedQuestions.forEach((q, index) => {
            initialAnswers[index] = '';
          });
          
          setAnswers(initialAnswers);
        }
        
        // Fetch course details
        if (assessmentData.courseId) {
          const courseData = await courseService.getCourseById(assessmentData.courseId);
          setCourse(courseData);
        }
      } catch (err) {
        setError('Failed to load assessment details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentAndCourse();
  }, [id]);

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      [questionIndex]: value
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      try {
        await assessmentService.deleteAssessment(id);
        navigate('/assessments');
      } catch (err) {
        setError('Failed to delete assessment. Please try again later.');
        console.error(err);
      }
    }
  };

  const calculateScore = (questions, userAnswers) => {
    let score = 0;
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      
      // Check if user's answer matches the correct answer
      if (userAnswer && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
        score += question.points || 1;
      }
    });
    
    return score;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const questions = typeof assessment.questions === 'string' 
        ? JSON.parse(assessment.questions) 
        : assessment.questions;
      
      const score = calculateScore(questions, answers);
      
      const resultData = {
        assessmentId: assessment.assessmentId,
        userId: currentUser.userId,
        score: score,
        attemptDate: new Date().toISOString()
      };
      
      const savedResult = await resultService.createResult(resultData);
      setResult(savedResult);
    } catch (err) {
      setError('Failed to submit assessment. Please try again later.');
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

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="alert alert-warning m-3" role="alert">
        Assessment not found.
      </div>
    );
  }

  // Parse questions if they're stored as a JSON string
  const questions = typeof assessment.questions === 'string' 
    ? JSON.parse(assessment.questions) 
    : assessment.questions;

  return (
    <div className="container my-4">
      {result ? (
        <div className="card shadow">
          <div className="card-header bg-success text-white">
            <h3 className="mb-0">Assessment Completed</h3>
          </div>
          <div className="card-body text-center">
            <h4>Your score: {result.score} / {assessment.maxScore}</h4>
            <p className="lead">
              {(result.score / assessment.maxScore) >= 0.7 
                ? "Great job! You've passed the assessment." 
                : "Keep practicing. You can try again later."}
            </p>
            <button 
              onClick={() => navigate(`/courses/${assessment.courseId}`)} 
              className="btn btn-primary mt-3"
            >
              Back to Course
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">{assessment.title}</h3>
              {course && (
                <span className="badge bg-light text-primary">
                  Course: {course.title}
                </span>
              )}
            </div>
            <div className="card-body">
              <div className="mb-3">
                <p><strong>Maximum Score:</strong> {assessment.maxScore}</p>
              </div>
              
              {isInstructor && (
                <div className="d-flex mb-4">
                  <button 
                    onClick={() => navigate(`/assessments/edit/${assessment.assessmentId}`)}
                    className="btn btn-outline-primary me-2"
                  >
                    Edit Assessment
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="btn btn-outline-danger"
                  >
                    Delete Assessment
                  </button>
                </div>
              )}
              
              {isStudent && (
                <form onSubmit={handleSubmit}>
                  {questions.map((question, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">
                          Question {index + 1}: {question.question}
                        </h5>
                        {question.options ? (
                          <div className="mt-3">
                            {question.options.map((option, optIndex) => (
                              <div className="form-check" key={optIndex}>
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`question-${index}`}
                                  id={`q${index}-opt${optIndex}`}
                                  value={option}
                                  checked={answers[index] === option}
                                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                                  required
                                />
                                <label 
                                  className="form-check-label" 
                                  htmlFor={`q${index}-opt${optIndex}`}
                                >
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Your answer"
                              value={answers[index] || ''}
                              onChange={(e) => handleAnswerChange(index, e.target.value)}
                              required
                            />
                          </div>
                        )}
                        {question.points && (
                          <div className="text-muted mt-2">
                            Points: {question.points}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="d-grid gap-2 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        'Submit Assessment'
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              {isInstructor && questions && (
                <div className="mt-3">
                  <h4>Questions Preview</h4>
                  <div className="list-group">
                    {questions.map((question, index) => (
                      <div key={index} className="list-group-item">
                        <h5>Question {index + 1}: {question.question}</h5>
                        {question.options && (
                          <div className="ms-3 mt-2">
                            <p><strong>Options:</strong></p>
                            <ul>
                              {question.options.map((option, i) => (
                                <li key={i} className={option === question.correctAnswer ? "text-success fw-bold" : ""}>
                                  {option} {option === question.correctAnswer && "(Correct)"}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {!question.options && (
                          <div className="ms-3 mt-2">
                            <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                          </div>
                        )}
                        {question.points && (
                          <p className="text-muted">Points: {question.points}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AssessmentDetail;
