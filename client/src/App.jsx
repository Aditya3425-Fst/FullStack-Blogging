import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import Pages
import HomePage from './pages/HomePage'; // Create this page later
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BlogListPage from './pages/BlogListPage'; // Create this page later
import BlogDetailsPage from './pages/BlogDetailsPage'; // Create this page later
import CreateBlogPage from './pages/CreateBlogPage'; // Create this page later
import EditBlogPage from './pages/EditBlogPage'; // Import EditBlogPage
import ProfilePage from './pages/ProfilePage'; // Create this page later
import AdminDashboardPage from './pages/AdminDashboardPage'; // Create this page later
import NotFoundPage from './pages/NotFoundPage'; // Import 404 page

// Import Components
import Navbar from './components/Navbar'; // Create this component later
import Footer from './components/Footer'; // Import Footer
import ProtectedRoute from './components/ProtectedRoute'; // Create this component later

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading Application...</div>; // Or a spinner component
  }

  return (
    <div className="App">
      <Navbar /> {/* Display Navbar on all pages */} 
      <main style={{ padding: '20px', minHeight: 'calc(100vh - 120px)' }}> {/* Adjust padding/minHeight as needed */} 
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blog/:id" element={<BlogDetailsPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} /> {/* Public profile view */}

          {/* Protected Routes */}
          <Route path="/create-blog" element={
            <ProtectedRoute>
              <CreateBlogPage />
            </ProtectedRoute>
          } />
          <Route path="/edit-blog/:blogId" element={
            <ProtectedRoute>
              <EditBlogPage />
            </ProtectedRoute>
          } />
           <Route path="/profile" element={ /* Route for OWN profile */
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          {/* TODO: Add protected route for editing blog post */}
          
          {/* Admin Route */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          } />

          {/* Not Found Route */}
          <Route path="*" element={<NotFoundPage />} /> 
        </Routes>
      </main>
      <Footer /> {/* Add Footer */} 
    </div>
  );
}

export default App;
