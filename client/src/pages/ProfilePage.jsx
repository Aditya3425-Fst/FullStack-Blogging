import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyProfile, getUserProfile, updateMyProfile } from '../api/user';
import PostCard from '../components/PostCard'; // Reuse PostCard to display user's blogs
import './ProfilePage.css'; // Create later

function ProfilePage() {
  const { userId } = useParams(); // Get userId from URL if viewing someone else's profile
  const { user: loggedInUser, login: updateAuthContext } = useAuth(); // Get logged-in user and context update function

  const [profileData, setProfileData] = useState(null); // { user: {}, blogs: [] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Default avatar as SVG data URL - completely self-contained
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%233182ce' /%3E%3Ccircle cx='75' cy='55' r='30' fill='%23fff' /%3E%3Cpath d='M35,120 C35,85 115,85 115,120 Z' fill='%23fff' /%3E%3C/svg%3E";

  // Check for dark mode and apply fixes
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.body.classList.contains('dark-mode');
      setIsDarkMode(isDark);
      
      // Apply emergency styles to all form inputs when in edit mode
      if (isDark && isEditing) {
        const formInputs = document.querySelectorAll('.profile-edit-form input, .profile-edit-form textarea');
        formInputs.forEach(input => {
          input.style.backgroundColor = '#2c2c2c';
          input.style.color = '#ffffff';
          input.style.borderColor = '#444';
        });
      }
    };
    
    // Check on mount and when editing state changes
    checkDarkMode();
    
    // Set up observer for changes to body class
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, [isEditing]);

  // Fixed styles for dark mode
  const forcedInputStyle = {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#333333',
    borderColor: isDarkMode ? '#444' : '#ddd',
    caretColor: isDarkMode ? '#ffffff' : 'auto'
  };

  // Add emergency styles to head
  useEffect(() => {
    if (!isEditing) return; // Only add when editing

    const style = document.createElement('style');
    style.innerHTML = `
      .dark-mode .profile-edit-form input, 
      .dark-mode .profile-edit-form textarea, 
      .dark-mode .profile-edit-form select {
        background-color: #2c2c2c !important;
        color: #ffffff !important;
        border-color: #444 !important;
        caret-color: #ffffff !important;
      }
      
      .dark-mode .profile-edit-form label {
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [isEditing]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      setIsOwnProfile(false); // Reset
      setIsEditing(false);    // Reset editing state on profile change
      try {
        let data;
        if (userId) {
          // Viewing someone else's profile
          data = await getUserProfile(userId);
          if (loggedInUser && loggedInUser._id === userId) {
              setIsOwnProfile(true);
          }
        } else if (loggedInUser) {
          // Viewing own profile (no userId in URL, but user is logged in)
          data = await getMyProfile();
          setIsOwnProfile(true);
        } else {
          // Not logged in and no userId specified
          throw new Error('Please log in to view your profile.'); 
        }
        setProfileData(data);
        // Initialize edit form if it's own profile
        if (data && (loggedInUser?._id === data.user?._id || !userId) ) {
            setEditFormData({
                username: data.user.username || '',
                email: data.user.email || '',
                bio: data.user.bio || '',
                twitter: data.user.socialLinks?.twitter || '',
                linkedin: data.user.socialLinks?.linkedin || '',
                github: data.user.socialLinks?.github || '',
            });
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, loggedInUser]); // Depend on userId (from URL) and loggedInUser (from context)

  const handleEditToggle = () => {
      setIsEditing(!isEditing);
      if (isEditing) {
        setProfilePicFile(null);
        setImagePreview(null);
      }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setProfilePicFile(file);
          
          // Create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleUpdateSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('username', editFormData.username);
      formData.append('email', editFormData.email);
      formData.append('bio', editFormData.bio);
      // Structure social links correctly
      formData.append('socialLinks[twitter]', editFormData.twitter);
      formData.append('socialLinks[linkedin]', editFormData.linkedin);
      formData.append('socialLinks[github]', editFormData.github);

      if (profilePicFile) {
          formData.append('profilePic', profilePicFile);
      }

      try {
          const updatedUser = await updateMyProfile(formData);
          // Update profileData state immediately
          setProfileData(prev => ({ ...prev, user: updatedUser }));
          // Update AuthContext if username/email/pic changed (token doesn't change here)
          updateAuthContext({ ...loggedInUser, ...updatedUser }); 
          setIsEditing(false); // Exit edit mode
          setProfilePicFile(null); // Clear file input state
          setImagePreview(null);
          
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.className = 'success-message';
          successMessage.textContent = 'Profile updated successfully!';
          document.querySelector('.profile-page').appendChild(successMessage);
          
          // Remove after 3 seconds
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
          
      } catch (err) {
          setError(err.message || 'Failed to update profile.');
      } finally {
          setLoading(false);
      }
  };

  // Render Logic
  if (loading && !profileData) {
    return (
      <div className="loading-container container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  if (error && !profileData) {
    return (
      <div className="error-container container">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
        <Link to="/" className="back-link">Return to Home</Link>
      </div>
    );
  }
  
  if (!profileData || !profileData.user) {
    return (
      <div className="not-found-container container">
        <div className="not-found-icon">🔍</div>
        <h2>User profile not found</h2>
        <Link to="/" className="back-link">Return to Home</Link>
      </div>
    );
  }

  const { user: profileUser, blogs } = profileData;
  const profileImageUrl = profileUser.profilePic || defaultAvatar;

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <img 
          src={imagePreview || profileImageUrl} 
          alt={`${profileUser.username}'s profile`} 
          className="profile-pic" 
        />
        <div className="profile-info">
          <h1>{profileUser.username}</h1>
          <p className="profile-email">{profileUser.email}</p>
          {profileUser.bio && <p className="profile-bio">{profileUser.bio}</p>}
          <div className="profile-socials">
             {profileUser.socialLinks?.twitter && <a href={`https://twitter.com/${profileUser.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer">Twitter</a>}
             {profileUser.socialLinks?.linkedin && <a href={`https://linkedin.com/in/${profileUser.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
             {profileUser.socialLinks?.github && <a href={`https://github.com/${profileUser.socialLinks.github}`} target="_blank" rel="noopener noreferrer">GitHub</a>}
          </div>
        </div>
        {isOwnProfile && (
            <button onClick={handleEditToggle} className="edit-profile-button">
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
        )}
      </div>

      {/* Edit Form (Conditional) */} 
      {isEditing && isOwnProfile && (
          <form onSubmit={handleUpdateSubmit} className="profile-edit-form">
              <h3>Edit Your Profile</h3>
              {error && <p className="error-message">{error}</p>} 
              <div className="form-group">
                  <label htmlFor="username" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Username:</label>
                  <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    value={editFormData.username} 
                    onChange={handleInputChange} 
                    placeholder="Your username" 
                    required 
                    style={forcedInputStyle}
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="email" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Email:</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={editFormData.email} 
                    onChange={handleInputChange} 
                    placeholder="Your email address" 
                    required 
                    style={forcedInputStyle}
                  />
              </div>
              <div className="form-group">
                  <label htmlFor="bio" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Bio:</label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    value={editFormData.bio} 
                    onChange={handleInputChange} 
                    placeholder="Tell us about yourself" 
                    rows="4"
                    style={forcedInputStyle}
                  ></textarea>
              </div>
              <div className="form-group">
                  <label htmlFor="profilePic" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Profile Picture:</label>
                  <input 
                    type="file" 
                    id="profilePic" 
                    name="profilePic" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ color: isDarkMode ? '#ffffff' : 'inherit' }}
                  />
                  {imagePreview && (
                    <div className="profile-pic-preview">
                      <img src={imagePreview} alt="Profile preview" />
                    </div>
                  )}
              </div>
              <h4 style={{ color: isDarkMode ? '#ffffff' : '#333' }}>Social Links (Usernames/Handles)</h4>
               <div className="form-group">
                  <label htmlFor="twitter" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Twitter:</label>
                  <input 
                    type="text" 
                    id="twitter" 
                    name="twitter" 
                    value={editFormData.twitter} 
                    onChange={handleInputChange} 
                    placeholder="Twitter username without @"
                    style={forcedInputStyle}
                  />
              </div>
               <div className="form-group">
                  <label htmlFor="linkedin" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>LinkedIn:</label>
                  <input 
                    type="text" 
                    id="linkedin" 
                    name="linkedin" 
                    value={editFormData.linkedin} 
                    onChange={handleInputChange} 
                    placeholder="LinkedIn username"
                    style={forcedInputStyle}
                  />
              </div>
               <div className="form-group">
                  <label htmlFor="github" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>GitHub:</label>
                  <input 
                    type="text" 
                    id="github" 
                    name="github" 
                    value={editFormData.github} 
                    onChange={handleInputChange} 
                    placeholder="GitHub username"
                    style={forcedInputStyle}
                  />
              </div>

              <div className="form-actions">
                  <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" onClick={handleEditToggle} disabled={loading}>Cancel</button>
              </div>
          </form>
      )}

      {/* User's Blog Posts */} 
      <div className="user-blogs-section">
          <h2>{isOwnProfile ? 'Your' : `${profileUser.username}'s`} Blog Posts ({blogs?.length || 0})</h2>
           {blogs && blogs.length > 0 ? (
               <div className="blog-list-container"> {/* Reuse class from BlogListPage */} 
                  {blogs.map(blog => (
                      <PostCard key={blog._id} post={blog} />
                  ))}
               </div>
           ) : (
               <div className="no-posts-message">
                   <p>{isOwnProfile ? 'You haven\'t created any blog posts yet.' : `${profileUser.username} hasn't created any blog posts yet.`}</p>
                   {isOwnProfile && (
                       <Link to="/create-blog" className="create-post-link">Create Your First Post</Link>
                   )}
               </div>
           )}
      </div>
    </div>
  );
}

export default ProfilePage; 