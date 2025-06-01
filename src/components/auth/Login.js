import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import authService from "../../services/authService";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for session expired parameter
  const searchParams = new URLSearchParams(location.search);
  const sessionExpired = searchParams.get("expired") === "true";

  // Check if user is already logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Remove the useEffect that was causing login loops
  // We'll handle redirection directly in the login function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      // Your exact API endpoint
      const url =
        "https://myservice75-dne6hagwa7gzgbbg.canadacentral-01.azurewebsites.net/api/Users/login";
      console.log("Sending login request to:", url);

      // Option 1: Send credentials as-is (camelCase)
      // Use authService to handle login
      const { user } = await authService.login(credentials);
      console.log("Login successful, user:", user);
      
      // Redirect to home or intended URL
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectUrl;
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8 col-xl-6">
          <div className="card shadow border-0 rounded-lg overflow-hidden">
            <div className="row g-0">
              {/* Left side - Image and branding */}
              <div className="col-lg-5 d-none d-lg-block">
                <div
                  className="bg-primary h-100 d-flex flex-column justify-content-center text-white p-4"
                  style={{
                    background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
                    minHeight: "500px",
                  }}
                >
                  <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold mb-4">EduSync</h1>
                    <p className="lead">
                      Smart Learning Management & Assessment Platform
                    </p>
                  </div>
                  <div className="mt-auto text-center">
                    <p className="mb-0 small opacity-75">
                      © {new Date().getFullYear()} EduSync LMS
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - Login form */}
              <div className="col-lg-7">
                <div className="card-body p-4 p-lg-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold">Welcome Back</h2>
                    <p className="text-muted">Sign in to continue to EduSync</p>
                  </div>

                  {/* Session expired alert */}
                  {sessionExpired && (
                    <div className="alert alert-warning" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Your session has expired. Please login again.
                    </div>
                  )}

                  {/* Error alert */}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-x-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label fw-medium">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control py-2"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          value={credentials.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <label
                          htmlFor="password"
                          className="form-label fw-medium"
                        >
                          Password
                        </label>
                        <Link to="#" className="small text-decoration-none">
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type="password"
                          className="form-control py-2"
                          id="password"
                          name="password"
                          placeholder="Enter your password"
                          value={credentials.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-check mb-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me on this device
                      </label>
                    </div>

                    <div className="d-grid gap-2 mb-4">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg px-4 py-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="fw-medium text-decoration-none"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
