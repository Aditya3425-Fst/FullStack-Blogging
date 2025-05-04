import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css'; // Create this CSS file later for styling

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MyBlog</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/blogs">Blogs</Link></li>
        {user ? (
          <>
            <li><Link to="/create-blog">Create Post</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            {user.role === 'admin' && (
                 <li><Link to="/admin">Admin</Link></li>
            )}
            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
            <li className="navbar-username">Hi, {user.username}!</li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar; 