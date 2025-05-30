import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import apiConfig from "../../config/apiConfig";
import api from "../../services/api";

// Use the centralized API configuration with complete base URL
const API_BASE_URL =
  "https://myservice75-dne6hagwa7gzgbbg.canadacentral-01.azurewebsites.net";
const API_URL = `${API_BASE_URL}/api${apiConfig.API_ENDPOINTS.COURSES.BASE}`;
console.log("API URL for courses:", API_URL);

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isEditing = !!id;

  // Create refs for directly accessing form elements
  const titleRef = useRef();
  const descriptionRef = useRef();
  const mediaUrlRef = useRef();

  // Keep instructorId in state since it's not directly edited
  const [instructorId, setInstructorId] = useState(currentUser?.userId || "");

  // Internal state to track if we've loaded initial data
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Other state
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Embedded service functions with simplified error handling
  const createCourse = async (data) => {
    console.log("Creating course with data:", data);
    try {
      const response = await api.post(API_URL, data);
      console.log("Create course response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error creating course:", err);
      throw err;
    }
  };

  const getCourseById = async (courseId) => {
    try {
      console.log(
        `Fetching course with ID ${courseId} from ${API_URL}/${courseId}`
      );
      const response = await api.get(`${API_URL}/${courseId}`);
      console.log("Received course data:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching course:", err);
      throw err;
    }
  };

  const updateCourse = async (courseId, data) => {
    try {
      console.log(`Updating course with ID ${courseId}`);
      console.log("Update data:", data);

      // Build a clean update payload
      const updatePayload = {
        courseId: courseId,
        title: data.title,
        description: data.description,
        mediaUrl: data.mediaUrl || "",
        instructorId: data.instructorId,
      };

      const updateUrl = `${API_URL}/${courseId}`;
      console.log("Sending update to:", updateUrl);
      console.log("With payload:", updatePayload);

      const response = await api.put(updateUrl, updatePayload);
      console.log("Update successful:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error updating course:", err);
      throw err;
    }
  };

  // Load course data when in edit mode
  useEffect(() => {
    if (!currentUser) {
      setError("You must be logged in to manage courses.");
      return;
    }

    if (isEditing) {
      const fetchCourse = async () => {
        try {
          console.log("Fetching course data for ID:", id);
          const courseData = await getCourseById(id);

          // Directly set the DOM input values after a brief delay to ensure refs are available
          setTimeout(() => {
            if (titleRef.current)
              titleRef.current.value = courseData.title || "";
            if (descriptionRef.current)
              descriptionRef.current.value = courseData.description || "";
            if (mediaUrlRef.current)
              mediaUrlRef.current.value = courseData.mediaUrl || "";
            setInstructorId(
              courseData.instructorId || currentUser?.userId || ""
            );

            // Mark that we've loaded initial data
            setInitialDataLoaded(true);
            console.log("Course data loaded successfully into DOM elements");
          }, 50);
        } catch (err) {
          setError("Failed to load course details for editing.");
          console.error("Error fetching course:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [id, isEditing, currentUser]);

  // URL validation to prevent database truncation errors
  const validateMediaUrl = (url) => {
    if (!url) return true; // Empty URLs are fine

    // Increased the limit to 2000 characters to accommodate longer URLs
    const MAX_URL_LENGTH = 5000;

    if (url.length > MAX_URL_LENGTH) {
      console.warn(`URL is very long: ${url.length} characters`);
      return false;
    }
    return true;
  };

  // Function to shorten a URL for storage if needed
  const shortenUrl = (url) => {
    if (!url) return "";

    try {
      // Try to extract just the essential parts of common image URLs
      const urlObj = new URL(url);
      const MAX_URL_LENGTH = 5000;

      // For image hosting sites, we can often simplify the URL
      if (urlObj.hostname.includes("imgur.com")) {
        // Extract the image ID from imgur URLs
        const imgurId = url.split("/").pop().split(".")[0];
        return `https://i.imgur.com/${imgurId}.jpg`;
      }

      // For general URLs that are extremely long, we'll truncate with a warning
      if (url.length > MAX_URL_LENGTH) {
        console.warn("URL was extremely long and had to be truncated:", url);
        return url.substring(0, MAX_URL_LENGTH - 3) + "...";
      }

      return url;
    } catch (e) {
      console.error("Error processing URL:", e);
      return url;
    }
  };

  // Single handler for validation
  const handleMediaUrlValidation = () => {
    const value = mediaUrlRef.current?.value || "";

    // Validate media URL
    if (!validateMediaUrl(value)) {
      setError(
        "Media URL is too long. Please use a shorter URL (max 5000 characters)."
      );
      return false;
    } else if (error) {
      // Clear error if it was fixed
      setError("");
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Get values directly from the DOM elements
    const submissionData = {
      title: (titleRef.current?.value || "").trim(),
      description: (descriptionRef.current?.value || "").trim(),
      mediaUrl: (mediaUrlRef.current?.value || "").trim(),
      instructorId: instructorId,
    };

    console.log("About to submit course data:", submissionData);

    // Validate the media URL if present
    if (submissionData.mediaUrl && !validateMediaUrl(submissionData.mediaUrl)) {
      // Try to shorten it
      const originalUrl = submissionData.mediaUrl;
      submissionData.mediaUrl = shortenUrl(originalUrl);

      // Check if shortening worked
      if (!validateMediaUrl(submissionData.mediaUrl)) {
        setError(
          "Media URL is too long. Please use a shorter URL (max 5000 characters)."
        );
        setSubmitting(false);
        return;
      }
    }

    try {
      if (isEditing) {
        // For updates, explicitly log what we're sending
        console.log("UPDATING COURSE:");
        console.log("Course ID:", id);
        console.log("Data being sent:", submissionData);

        await updateCourse(id, submissionData);
        console.log("Course updated successfully!");
      } else {
        // For creation
        console.log("Creating new course with data:", submissionData);
        await createCourse(submissionData);
        console.log("Course created successfully!");
      }

      // Navigate away on success
      navigate("/courses");
    } catch (err) {
      console.error("Error saving course:", err);

      // Improved error handling
      if (err.message === "Network Error") {
        setError(
          "Network error. Please check your internet connection or API configuration."
        );
      } else {
        setError(
          `Failed to save course: ${err.response?.data?.message || err.message}`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // UI rendering code continues (same as before)...
  // You can copy the full UI from previous message if needed
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
              <h3 className="mb-0">
                {isEditing ? "Edit Course" : "Create New Course"}
              </h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Course Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    defaultValue=""
                    ref={titleRef}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    defaultValue=""
                    ref={descriptionRef}
                    rows="4"
                    autoComplete="off"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="mediaUrl" className="form-label">
                    Media URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="mediaUrl"
                    name="mediaUrl"
                    defaultValue=""
                    ref={mediaUrlRef}
                    onBlur={handleMediaUrlValidation}
                    autoComplete="off"
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="form-text">
                    URL to course cover image. Make sure the URL is a direct
                    link to an image file (ending in .jpg, .png, etc.)
                    <br />
                    <small className="text-muted">
                      Tip: Right-click on an image on the web and select "Copy
                      image address"
                    </small>
                  </div>

                  {/* Always provide image preview container, but only show image when URL exists */}
                  <div className="mt-2">
                    <label className="form-label">Image Preview:</label>
                    <div className="border rounded p-2">
                      {mediaUrlRef.current?.value ? (
                        <img
                          src={mediaUrlRef.current?.value}
                          alt="Preview"
                          className="img-fluid"
                          style={{
                            maxHeight: "150px",
                            display: "block",
                            margin: "0 auto",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                          }}
                        />
                      ) : (
                        <div className="text-center text-muted">
                          <p>Enter a URL above to see image preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/courses")}
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
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {isEditing ? "Updating..." : "Creating..."}
                      </>
                    ) : isEditing ? (
                      "Update Course"
                    ) : (
                      "Create Course"
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

export default CourseForm;
