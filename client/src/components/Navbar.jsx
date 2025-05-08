import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css'; // Create this CSS file later for styling

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MyBlog</Link>
      </div>
      
      <button 
        className="mobile-menu-btn" 
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <div className={`mobile-menu-icon ${mobileMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
        <li><Link to="/blogs" onClick={() => setMobileMenuOpen(false)}>Blogs</Link></li>
        {user ? (
          <>
            <li><Link to="/create-blog" onClick={() => setMobileMenuOpen(false)}>Create Post</Link></li>
            <li><Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link></li>
            {user.role === 'admin' && (
              <li><Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link></li>
            )}
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            <li className="navbar-username">Hi, {user.username}!</li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link></li>
            <li className="signup-button"><Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Create your blog</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar; 