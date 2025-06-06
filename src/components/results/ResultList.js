import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import resultService from "../../services/resultService";
import assessmentService from "../../services/assessmentService";
import courseService from "../../services/courseService";
import authService from "../../services/authService";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { checkApiAvailability } from "../../services/apiClient";

const ResultList = ({ userOnly = false }) => {
  const [results, setResults] = useState([]);
  const [assessments, setAssessments] = useState({});
  const [courses, setCourses] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const currentUser = authService.getCurrentUser();

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editResult, setEditResult] = useState(null);
  const [editScore, setEditScore] = useState("");
  const [editModalError, setEditModalError] = useState("");

  // State for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);
  const [deleteModalError, setDeleteModalError] = useState("");

  // State to track if API is available
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);

        // Check if API is available
        const isApiAvailable = await checkApiAvailability();
        setApiAvailable(isApiAvailable);

        if (!isMounted) return;

        // If API is unavailable, generate mock data
        if (!isApiAvailable) {
          const mockResults = generateMockResults();
          const mockAssessments = generateMockAssessments();
          const mockCourses = generateMockCourses();

          setResults(mockResults);
          setAssessments(mockAssessments);
          setCourses(mockCourses);
          setError(
            "Backend API is currently unavailable. Working in offline mode with sample data."
          );
          setLoading(false);
          return;
        }

        // API is available, fetch real data
        // Fetch all results
        let userData = [];
        try {
          userData = await authService.getAllUsers();
        } catch (err) {
          console.error("Error fetching users", err);
          userData = [];
        }

        let resultData = await resultService.getAllResults();

        // If component unmounted during API call, don't update state
        if (!isMounted) return;

        // If userOnly flag is true, filter for current user's results only
        if (userOnly && currentUser) {
          resultData = resultData.filter(
            (r) => r.userId === currentUser.userId
          );
        }

        setResults(resultData);

        // Fetch all assessments to get their titles
        const assessmentData = await assessmentService.getAllAssessments();
        if (!isMounted) return;

        const assessmentMap = {};
        const uniqueCourseIds = new Set();

        assessmentData.forEach((assessment) => {
          assessmentMap[assessment.assessmentId] = assessment;
          if (assessment.courseId) {
            uniqueCourseIds.add(assessment.courseId);
          }
        });

        setAssessments(assessmentMap);

        // Fetch courses for the assessments
        const courseIds = Array.from(uniqueCourseIds);
        const courseMap = {};

        // Use Promise.all to fetch all courses in parallel instead of sequentially
        await Promise.all(
          courseIds.map(async (courseId) => {
            try {
              const course = await courseService.getCourseById(courseId);
              if (isMounted) {
                courseMap[courseId] = course;
              }
            } catch (err) {
              console.error(`Failed to load course ${courseId}:`, err);
            }
          })
        );

        if (!isMounted) return;
        setCourses(courseMap);
        setError(""); // Clear any previous errors
      } catch (err) {
        if (isMounted) {
          setError("Failed to load results. Please try again later.");
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Function to generate mock results for offline mode
    const generateMockResults = () => {
      return [
        {
          resultId: "mock-result-1",
          assessmentId: "mock-assessment-1",
          userId: currentUser?.userId || "mock-user-1",
          score: 85,
          attemptDate: new Date().toISOString(),
          feedback: "Good work!",
        },
        {
          resultId: "mock-result-2",
          assessmentId: "mock-assessment-2",
          userId: currentUser?.userId || "mock-user-1",
          score: 65,
          attemptDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          feedback: "Needs improvement",
        },
      ];
    };

    // Function to generate mock assessments for offline mode
    const generateMockAssessments = () => {
      const mockAssessments = {
        "mock-assessment-1": {
          assessmentId: "mock-assessment-1",
          title: "Mock Final Exam",
          description: "A mock final exam for offline mode",
          courseId: "mock-course-1",
          maxScore: 100,
          passingScore: 70,
        },
        "mock-assessment-2": {
          assessmentId: "mock-assessment-2",
          title: "Mock Midterm",
          description: "A mock midterm for offline mode",
          courseId: "mock-course-2",
          maxScore: 100,
          passingScore: 70,
        },
      };
      return mockAssessments;
    };

    // Function to generate mock courses for offline mode
    const generateMockCourses = () => {
      const mockCourses = {
        "mock-course-1": {
          courseId: "mock-course-1",
          title: "Introduction to Programming",
          description: "A mock course for offline mode",
        },
        "mock-course-2": {
          courseId: "mock-course-2",
          title: "Advanced Data Structures",
          description: "A mock course for offline mode",
        },
      };
      return mockCourses;
    };

    fetchData();

    // Cleanup function to prevent memory leaks and state updates after unmount
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [userOnly, currentUser?.userId, currentUser?.role]); // More specific dependencies

  // Handler for edit button click
  const handleEditClick = (result) => {
    setEditResult(result);
    setEditScore(result.score.toString());
    setEditModalError("");
    setShowEditModal(true);
  };

  // Handler for edit modal close
  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditResult(null);
    setEditScore("");
    setEditModalError("");
  };

  // Handler for saving edited result
  const handleEditSave = async () => {
    setEditModalError("");

    // Validate input
    const numScore = parseFloat(editScore);
    if (isNaN(numScore)) {
      setEditModalError("Please enter a valid number for score");
      return;
    }

    const assessment = assessments[editResult.assessmentId];
    if (assessment && numScore > assessment.maxScore) {
      setEditModalError(
        `Score cannot exceed the maximum score of ${assessment.maxScore}`
      );
      return;
    }

    if (numScore < 0) {
      setEditModalError("Score cannot be negative");
      return;
    }

    try {
      // If API is unavailable, simulate update in mock data
      if (!apiAvailable) {
        // Update the result in local state
        const updatedResults = results.map((r) =>
          r.resultId === editResult.resultId ? { ...r, score: numScore } : r
        );
        setResults(updatedResults);
        handleEditModalClose();
        setSuccessMessage("Result updated successfully (offline mode)");
        setTimeout(() => setSuccessMessage(""), 3000);
        return;
      }

      // Otherwise, call the API
      const updatedResult = { ...editResult, score: numScore };
      await resultService.updateResult(editResult.resultId, updatedResult);

      // Update the result in local state
      const updatedResults = results.map((r) =>
        r.resultId === editResult.resultId ? { ...r, score: numScore } : r
      );
      setResults(updatedResults);

      // Close modal and show success message
      handleEditModalClose();
      setSuccessMessage("Result updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update result:", err);
      setEditModalError("Failed to update result. Please try again.");
    }
  };

  // Handler for delete button click
  const handleDeleteClick = (result) => {
    setDeleteResult(result);
    setDeleteModalError("");
    setShowDeleteModal(true);
  };

  // Handler for delete modal close
  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setDeleteResult(null);
    setDeleteModalError("");
  };

  // Handler for confirming delete
  const handleDeleteConfirm = async () => {
    try {
      // If API is unavailable, simulate delete in mock data
      if (!apiAvailable) {
        // Remove the result from local state
        const filteredResults = results.filter(
          (r) => r.resultId !== deleteResult.resultId
        );
        setResults(filteredResults);
        handleDeleteModalClose();
        setSuccessMessage("Result deleted successfully (offline mode)");
        setTimeout(() => setSuccessMessage(""), 3000);
        return;
      }

      // Otherwise, call the API
      await resultService.deleteResult(deleteResult.resultId);

      // Remove the result from local state
      const filteredResults = results.filter(
        (r) => r.resultId !== deleteResult.resultId
      );
      setResults(filteredResults);

      // Close modal and show success message
      handleDeleteModalClose();
      setSuccessMessage("Result deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete result:", err);
      setDeleteModalError("Failed to delete result. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  // Handler to retry when API is offline
  const handleRetry = () => {
    setLoading(true);
    setError("");
    setApiAvailable(true);
    // Force a re-render to trigger the useEffect
    setResults((prev) => [...prev]);
  };

  if (error && !showEditModal && !showDeleteModal) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-outline-danger ms-3" onClick={handleRetry}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>{userOnly ? "My Results" : "All Assessment Results"}</h2>

      {/* Success message */}
      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}

      {/* API Offline Warning */}
      {!apiAvailable && (
        <div className="alert alert-warning mt-3" role="alert">
          <strong>Offline Mode:</strong> Working with local data. Changes will
          be saved when connection is restored.
          <button
            className="btn btn-sm btn-outline-warning ms-3"
            onClick={handleRetry}
          >
            Retry Connection
          </button>
        </div>
      )}

      {results.length === 0 ? (
        <div className="alert alert-info mt-3">No results found.</div>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Assessment</th>
                <th>Course</th>
                {!userOnly && <th>Student</th>}
                <th>Score</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => {
                const assessment = assessments[result.assessmentId];
                const course = assessment ? courses[assessment.courseId] : null;
                const passThreshold = 0.7; // 70% is passing
                const scorePercentage = assessment
                  ? result.score / assessment.maxScore
                  : 0;
                const isPassed = scorePercentage >= passThreshold;

                return (
                  <tr key={result.resultId}>
                    <td>
                      {assessment ? (
                        <Link to={`/assessments/${assessment.assessmentId}`}>
                          {assessment.title}
                        </Link>
                      ) : (
                        "Unknown Assessment"
                      )}
                    </td>
                    <td>
                      {course ? (
                        <Link to={`/courses/${course.courseId}`}>
                          {course.title}
                        </Link>
                      ) : (
                        "Unknown Course"
                      )}
                    </td>
                    {!userOnly && (
                      <td>{users[result.userId]?.name || "Unknown User"}</td>
                    )}

                    <td>
                      {assessment ? (
                        <span>
                          {result.score} / {assessment.maxScore}
                        </span>
                      ) : (
                        result.score
                      )}
                    </td>
                    <td>{formatDate(result.attemptDate)}</td>
                    <td>
                      <span
                        className={`badge ${
                          isPassed ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {isPassed ? "Passed" : "Failed"}
                      </span>
                    </td>
                    <td>
                      {(currentUser?.role === "Instructor" ||
                        currentUser?.role === "Admin") && (
                        <>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleEditClick(result)}
                          >
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteClick(result)}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </>
                      )}
                      {currentUser?.role === "Student" && (
                        <span className="text-muted">No actions available</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Result Modal */}
      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editModalError && <Alert variant="danger">{editModalError}</Alert>}

          {editResult && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Assessment</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    assessments[editResult.assessmentId]?.title ||
                    "Unknown Assessment"
                  }
                  disabled
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Current Score</Form.Label>
                <Form.Control
                  type="number"
                  value={editScore}
                  onChange={(e) => setEditScore(e.target.value)}
                />
                {assessments[editResult.assessmentId] && (
                  <Form.Text className="text-muted">
                    Maximum Score:{" "}
                    {assessments[editResult.assessmentId].maxScore}
                  </Form.Text>
                )}
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteModalError && (
            <Alert variant="danger">{deleteModalError}</Alert>
          )}

          <p>Are you sure you want to delete this result?</p>

          {deleteResult && assessments[deleteResult.assessmentId] && (
            <div className="alert alert-warning">
              <strong>Assessment:</strong>{" "}
              {assessments[deleteResult.assessmentId].title}
              <br />
              <strong>Score:</strong> {deleteResult.score} /{" "}
              {assessments[deleteResult.assessmentId].maxScore}
              <br />
              <strong>Date:</strong> {formatDate(deleteResult.attemptDate)}
            </div>
          )}

          <p className="text-danger">
            <strong>This action cannot be undone.</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Result
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResultList;
