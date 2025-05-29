import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './assets/css/custom.css';

// Auth Context Provider
import { AuthProvider } from './utils/AuthContext';
import { NotificationProvider } from './utils/NotificationContext';

// Import API configuration
import apiConfig from './config/apiConfig';

// Components - Common
import Navbar from './components/common/Navbar';
import Unauthorized from './components/common/Unauthorized';
import Notifications from './components/common/Notifications';
import Footer from './components/layout/Footer';

// Components - Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Components - Courses
import CourseList from './components/courses/CourseList';
import CourseDetail from './components/courses/CourseDetail';
import EditableForm from './components/courses/EditableForm';

// Components - Assessments
import AssessmentList from './components/assessments/AssessmentList';
import AssessmentDetail from './components/assessments/AssessmentDetail';
import AssessmentForm from './components/assessments/AssessmentForm';

// Components - Results
import ResultList from './components/results/ResultList';

// Pages
import Home from './pages/Home';

// Utils
import { useAuth } from './utils/AuthContext';

// Import the Loading component
import Loading from './components/common/Loading';

// Import API configuration manager
import ApiConfigManager from './utils/ApiConfigManager';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return <Loading message="Verifying your access..." />;
  }
  
  if (!isAuthenticated()) {
    // Save the attempted URL for redirection after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <Notifications />
          
          <main className="flex-grow-1 mb-5">
            {/* API Configuration Manager - floating gear icon */}
            <ApiConfigManager />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Course Routes */}
            <Route path="/courses" element={<CourseList />} />
            
            {/* IMPORTANT: More specific routes must come before less specific ones */}
            <Route 
              path="/courses/create" 
              element={
                <ProtectedRoute requiredRole="Instructor">
                  <EditableForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses/edit/:id" 
              element={
                <ProtectedRoute requiredRole="Instructor">
                  <EditableForm />
                </ProtectedRoute>
              } 
            />
            <Route path="/courses/:id" element={<CourseDetail />} />
            
            {/* Assessment Routes */}
            <Route 
              path="/assessments" 
              element={
                <ProtectedRoute>
                  <AssessmentList />
                </ProtectedRoute>
              } 
            />
            
            {/* IMPORTANT: More specific routes must come before less specific ones */}
            <Route 
              path="/assessments/create" 
              element={
                <ProtectedRoute requiredRole="Instructor">
                  <AssessmentForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assessments/edit/:id" 
              element={
                <ProtectedRoute requiredRole="Instructor">
                  <AssessmentForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assessments/:id" 
              element={
                <ProtectedRoute>
                  <AssessmentDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* Result Routes */}
            <Route 
              path="/results" 
              element={
                <ProtectedRoute requiredRole="Instructor">
                  <ResultList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-results" 
              element={
                <ProtectedRoute requiredRole="Student">
                  <ResultList userOnly={true} />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
          <Footer />
        </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
