import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import courseService from '../../services/courseService';
import authService from '../../services/authService';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = authService.getCurrentUser();
  const isInstructor = currentUser?.role === 'Instructor';

  useEffect(() => {
    const fetchAssessmentsAndCourses = async () => {
      try {
        const assessmentData = await assessmentService.getAllAssessments();
        setAssessments(assessmentData);
        
        // Fetch all courses to get their titles
        const courseData = await courseService.getAllCourses();
        const courseMap = {};
        courseData.forEach(course => {
          courseMap[course.courseId] = course;
        });
        
        setCourses(courseMap);
      } catch (err) {
        setError('Failed to load assessments. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentsAndCourses();
  }, []);

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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Assessments</h2>
        {isInstructor && (
          <Link to="/assessments/create" className="btn btn-primary">
            Create New Assessment
          </Link>
        )}
      </div>

      {assessments.length === 0 ? (
        <div className="alert alert-info">No assessments available.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Title</th>
                <th>Course</th>
                <th>Max Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment.assessmentId}>
                  <td>{assessment.title}</td>
                  <td>
                    {courses[assessment.courseId] ? (
                      <Link to={`/courses/${assessment.courseId}`}>
                        {courses[assessment.courseId].title}
                      </Link>
                    ) : (
                      <span className="text-muted">Unknown Course</span>
                    )}
                  </td>
                  <td>{assessment.maxScore}</td>
                  <td>
                    <Link
                      to={`/assessments/${assessment.assessmentId}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      {currentUser?.role === 'Student' ? 'Take Quiz' : 'View'}
                    </Link>
                    {isInstructor && (
                      <>
                        <Link
                          to={`/assessments/edit/${assessment.assessmentId}`}
                          className="btn btn-sm btn-outline-secondary me-2"
                        >
                          Edit
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssessmentList;
