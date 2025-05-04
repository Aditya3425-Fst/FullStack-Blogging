import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Use Link for potential sub-routes
import './AdminDashboardPage.css'; // Create later

// Placeholder components for management sections
const ManageUsers = () => <div><h3>Manage Users</h3><p>User management table/actions here...</p></div>;
const ManagePosts = () => <div><h3>Manage Posts</h3><p>Post management table/actions here...</p></div>;
const ManageCategories = () => <div><h3>Manage Categories</h3><p>Category management form/table here...</p></div>;
const ManageComments = () => <div><h3>Manage Comments</h3><p>Comment moderation table/actions here...</p></div>;
const SiteAnalytics = () => <div><h3>Site Analytics</h3><p>Analytics data (total users, posts, etc.) here...</p></div>;


function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState('analytics'); // Default section

  const renderSection = () => {
      switch (activeSection) {
          case 'users':
              return <ManageUsers />;
          case 'posts':
              return <ManagePosts />;
          case 'categories':
              return <ManageCategories />;
          case 'comments':
              return <ManageComments />;
          case 'analytics':
          default:
              return <SiteAnalytics />;
      }
  };

  return (
    <div className="admin-dashboard container">
      <h2>Admin Dashboard</h2>
      <div className="admin-layout">
          <aside className="admin-sidebar">
              <ul>
                  <li className={activeSection === 'analytics' ? 'active' : ''} onClick={() => setActiveSection('analytics')}>Analytics</li>
                  <li className={activeSection === 'users' ? 'active' : ''} onClick={() => setActiveSection('users')}>Users</li>
                  <li className={activeSection === 'posts' ? 'active' : ''} onClick={() => setActiveSection('posts')}>Posts</li>
                  <li className={activeSection === 'categories' ? 'active' : ''} onClick={() => setActiveSection('categories')}>Categories</li>
                  <li className={activeSection === 'comments' ? 'active' : ''} onClick={() => setActiveSection('comments')}>Comments</li>
              </ul>
          </aside>
          <main className="admin-content">
              {renderSection()}
          </main>
      </div>
    </div>
  );
}

export default AdminDashboardPage; 