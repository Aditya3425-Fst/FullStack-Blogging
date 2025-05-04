import React from 'react';
import './Footer.css'; // Create this CSS file later

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {currentYear} MyBlog. All rights reserved.</p>
      {/* Add other links or info if needed */}
    </footer>
  );
}

export default Footer; 