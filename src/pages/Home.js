import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import assessmentService from '../services/assessmentService';
import resultService from '../services/resultService';
import { useAuth } from '../utils/AuthContext';
import Loading from '../components/common/Loading';

const Home = () => {
  const [recentCourses, setRecentCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [assessmentStats, setAssessmentStats] = useState({
    total: 0,
    completed: 0,
    avgScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isStudent, isInstructor, loading: authLoading } = useAuth();

  // Redirect to login if not authenticated and auth check is complete
  useEffect(() => {
    if (!authLoading && !isAuthenticated()) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch dashboard data when authentication is confirmed
  useEffect(() => {
    // Only fetch data if authenticated and auth check is complete
    if (authLoading || !isAuthenticated()) {
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all courses
        const courses = await courseService.getAllCourses();
        
        // Get 4 most recent courses
        setRecentCourses(courses.slice(0, 4)); 
        
        // Featured courses (different from recent)
        // In a real app, you might have a separate endpoint for featured courses
        const randomizedCourses = [...courses]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setFeaturedCourses(randomizedCourses);
        
        // Fetch assessments to calculate stats
        const assessments = await assessmentService.getAllAssessments();
        
        // Fetch results
        const results = await resultService.getAllResults();
        
        if (currentUser) {
          // Filter results for current user if student
          const userResults = isStudent() 
            ? results.filter(r => r.userId === currentUser.userId)
            : results;
            
          // Sort by date (newest first) and take only first 5
          const sortedResults = userResults
            .sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate))
            .slice(0, 5);
          
          setRecentResults(sortedResults);
          
          // Calculate assessment stats
          if (isStudent()) {
            const totalAssessments = assessments.length;
            const completedAssessments = new Set(userResults.map(r => r.assessmentId)).size;
            
            // Calculate average score
            let totalScore = 0;
            let totalMaxScore = 0;
            
            userResults.forEach(result => {
              totalScore += result.score;
              
              // Find corresponding assessment to get max score
              const assessment = assessments.find(a => a.assessmentId === result.assessmentId);
              if (assessment) {
                totalMaxScore += assessment.maxScore;
              }
            });
            
            const avgScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
            
            setAssessmentStats({
              total: totalAssessments,
              completed: completedAssessments,
              avgScore: Math.round(avgScore)
            });
          }
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser, isStudent, isInstructor, authLoading, isAuthenticated]);

  if (authLoading) {
    return <Loading fullScreen message="Initializing EduSync..." />;
  }
  
  // If not authenticated, show public home page
  if (!isAuthenticated()) {
    return (
      <div className="container-fluid px-0">
        {/* Hero Section */}
        <div className="bg-primary text-white py-5" style={{
          background: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
          minHeight: '500px'
        }}>
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <h1 className="display-3 fw-bold mb-4">Welcome to EduSync</h1>
                <p className="lead mb-4 fs-4">
                  A comprehensive learning management system that helps students master new skills and instructors deliver effective educational content.
                </p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                  <Link to="/login" className="btn btn-light btn-lg px-4 me-md-2 fw-medium">
                    <i className="bi bi-box-arrow-in-right me-2"></i> Sign In
                  </Link>
                  <Link to="/register" className="btn btn-outline-light btn-lg px-4 fw-medium">
                    <i className="bi bi-person-plus me-2"></i> Create Account
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 d-none d-lg-block text-center">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="EduSync Platform" 
                  className="img-fluid rounded-3 shadow-lg" 
                  style={{ maxHeight: '400px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="bg-light py-5">
          <div className="container py-4">
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3">Why Choose EduSync?</h2>
              <p className="lead text-muted">Empowering education through technology</p>
            </div>
            
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                      <i className="bi bi-book text-primary fs-1"></i>
                    </div>
                    <h4 className="card-title mb-3">Comprehensive Courses</h4>
                    <p className="card-text">Access a wide range of high-quality courses designed for effective learning.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                      <i className="bi bi-graph-up text-primary fs-1"></i>
                    </div>
                    <h4 className="card-title mb-3">Progress Tracking</h4>
                    <p className="card-text">Monitor your learning journey with detailed performance analytics.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                      <i className="bi bi-people text-primary fs-1"></i>
                    </div>
                    <h4 className="card-title mb-3">Expert Instructors</h4>
                    <p className="card-text">Learn from industry professionals and experienced educators.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Authenticated user dashboard
  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <div className="container-fluid py-4 bg-light">
      {/* Dashboard Header */}
      <div className="container mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h2 className="fw-bold mb-0">
              <i className="bi bi-speedometer2 me-2 text-primary"></i>
              Dashboard
            </h2>
            <p className="text-muted mb-0">Welcome back, {currentUser?.name}</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            {isInstructor() ? (
              <div className="btn-group">
                <Link to="/courses/create" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>New Course
                </Link>
                <Link to="/assessments/create" className="btn btn-outline-primary">
                  <i className="bi bi-file-earmark-text me-2"></i>New Assessment
                </Link>
              </div>
            ) : (
              <Link to="/courses" className="btn btn-primary">
                <i className="bi bi-collection-play me-2"></i>Browse Courses
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="container mb-4">
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        </div>
      )}
      
      <div className="container">
        {/* Stats Cards - For students */}
        {isStudent() && (
          <div className="row mb-4 g-3">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded p-2 bg-primary bg-opacity-10 me-3">
                      <i className="bi bi-journal-check text-primary fs-4"></i>
                    </div>
                    <h5 className="card-title mb-0">Available Courses</h5>
                  </div>
                  <h2 className="display-5 fw-bold mb-0">{recentCourses.length}</h2>
                  <p className="text-muted">Total courses available to you</p>
                  <Link to="/courses" className="btn btn-sm btn-outline-primary mt-2">
                    View All Courses
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded p-2 bg-success bg-opacity-10 me-3">
                      <i className="bi bi-patch-check text-success fs-4"></i>
                    </div>
                    <h5 className="card-title mb-0">Assessments</h5>
                  </div>
                  <h2 className="display-5 fw-bold mb-0">{assessmentStats.completed} <span className="fs-6 fw-normal text-muted">/ {assessmentStats.total}</span></h2>
                  <p className="text-muted">Completed assessments</p>
                  <Link to="/assessments" className="btn btn-sm btn-outline-success mt-2">
                    View Assessments
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded p-2 bg-info bg-opacity-10 me-3">
                      <i className="bi bi-graph-up-arrow text-info fs-4"></i>
                    </div>
                    <h5 className="card-title mb-0">Average Score</h5>
                  </div>
                  <h2 className="display-5 fw-bold mb-0">
                    {assessmentStats.avgScore}%
                  </h2>
                  <p className="text-muted">Your overall performance</p>
                  <Link to="/my-results" className="btn btn-sm btn-outline-info mt-2">
                    View Results
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats Cards - For instructors */}
        {isInstructor() && (
          <div className="row mb-4 g-3">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded p-2 bg-primary bg-opacity-10 me-3">
                      <i className="bi bi-journal-bookmark text-primary fs-4"></i>
                    </div>
                    <h5 className="card-title mb-0">Your Courses</h5>
                  </div>
                  <h2 className="display-5 fw-bold mb-0">{recentCourses.length}</h2>
                  <p className="text-muted">Active courses</p>
                  <Link to="/courses" className="btn btn-sm btn-outline-primary mt-2">
                    Manage Courses
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded p-2 bg-warning bg-opacity-10 me-3">
                      <i className="bi bi-file-earmark-text text-warning fs-4"></i>
                    </div>
                    <h5 className="card-title mb-0">Assessments</h5>
                  </div>
                  <h2 className="display-5 fw-bold mb-0">{recentResults.length}</h2>
                  <p className="text-muted">Recent assessment submissions</p>
                  <Link to="/assessments" className="btn btn-sm btn-outline-warning mt-2">
                    Manage Assessments
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded p-2 bg-success bg-opacity-10 me-3">
                      <i className="bi bi-plus-circle text-success fs-4"></i>
                    </div>
                    <h5 className="card-title mb-0">Quick Actions</h5>
                  </div>
                  <div className="d-grid gap-2">
                    <Link to="/courses/create" className="btn btn-sm btn-outline-success">
                      <i className="bi bi-plus-circle me-2"></i>New Course
                    </Link>
                    <Link to="/assessments/create" className="btn btn-sm btn-outline-success">
                      <i className="bi bi-file-earmark-text me-2"></i>New Assessment
                    </Link>
                    <Link to="/results" className="btn btn-sm btn-outline-success">
                      <i className="bi bi-graph-up me-2"></i>View Results
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          {/* Recent Courses */}
          <div className="col-lg-8 mb-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-collection text-primary me-2"></i>Recent Courses
                  </h5>
                  <Link to="/courses" className="btn btn-sm btn-outline-primary">
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body p-0">
                {recentCourses.length === 0 ? (
                  <div className="p-4 text-center">
                    <i className="bi bi-inbox text-muted fs-1"></i>
                    <p className="mt-3 mb-0">No courses available yet.</p>
                    {isInstructor() && (
                      <Link to="/courses/create" className="btn btn-primary mt-3">
                        Create Your First Course
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">Course</th>
                          <th scope="col">Description</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentCourses.map((course) => (
                          <tr key={course.courseId}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="me-3">
                                  {course.mediaUrl ? (
                                    <img 
                                      src={course.mediaUrl} 
                                      alt={course.title} 
                                      className="rounded" 
                                      width="48" 
                                      height="48"
                                      style={{ objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div className="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                      <i className="bi bi-book text-primary"></i>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h6 className="mb-0">{course.title}</h6>
                                </div>
                              </div>
                            </td>
                            <td className="text-muted small">
                              {course.description?.length > 80
                                ? `${course.description.substring(0, 80)}...`
                                : course.description}
                            </td>
                            <td>
                              <Link to={`/courses/${course.courseId}`} className="btn btn-sm btn-primary">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Results */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-clipboard-check text-primary me-2"></i>
                    {isStudent() ? 'My Results' : 'Recent Results'}
                  </h5>
                  <Link to={isStudent() ? '/my-results' : '/results'} className="btn btn-sm btn-outline-primary">
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body p-0">
                {recentResults.length === 0 ? (
                  <div className="p-4 text-center">
                    <i className="bi bi-clipboard text-muted fs-1"></i>
                    <p className="mt-3 mb-0">No results available yet.</p>
                    {isStudent() && (
                      <Link to="/assessments" className="btn btn-primary mt-3">
                        Take an Assessment
                      </Link>
                    )}
                  </div>
                ) : (
                  <ul className="list-group list-group-flush">
                    {recentResults.map((result) => (
                      <li key={result.resultId} className="list-group-item px-4 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">Assessment ID: {result.assessmentId.substring(0, 8)}...</h6>
                            <small className="text-muted">
                              <i className="bi bi-calendar3 me-1"></i>
                              {new Date(result.attemptDate).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </small>
                          </div>
                          <span className="badge bg-primary rounded-pill fs-6">{result.score}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-star-fill text-warning me-2"></i>Featured Courses
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row row-cols-1 row-cols-md-3 g-4">
                    {featuredCourses.map((course) => (
                      <div className="col" key={course.courseId}>
                        <div className="card h-100 border shadow-sm">
                          {course.mediaUrl ? (
                            <img
                              src={course.mediaUrl}
                              className="card-img-top"
                              alt={course.title}
                              style={{ height: '160px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: '160px' }}>
                              <i className="bi bi-journal-richtext text-primary fs-1"></i>
                            </div>
                          )}
                          <div className="card-body">
                            <h5 className="card-title">{course.title}</h5>
                            <p className="card-text small text-muted">
                              {course.description?.length > 100
                                ? `${course.description.substring(0, 100)}...`
                                : course.description}
                            </p>
                          </div>
                          <div className="card-footer bg-white border-top-0 text-end">
                            <Link
                              to={`/courses/${course.courseId}`}
                              className="btn btn-sm btn-primary"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
