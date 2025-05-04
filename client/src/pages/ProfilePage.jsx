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
  const [isOwnProfile, setIsOwnProfile] = useState(false);

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
      // Reset file input if cancelling edit
      if (isEditing) setProfilePicFile(null); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          setProfilePicFile(e.target.files[0]);
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
          alert('Profile updated successfully!');
      } catch (err) {
          setError(err.message || 'Failed to update profile.');
      } finally {
          setLoading(false);
      }
  };

  // Render Logic
  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message container">Error: {error}</p>;
  if (!profileData || !profileData.user) return <p className="container">User profile not found.</p>;

  const { user: profileUser, blogs } = profileData;
  const profileImageUrl = profileUser.profilePic || 'https://via.placeholder.com/150?text=No+Image';

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <img src={profileImageUrl} alt={`${profileUser.username}'s profile`} className="profile-pic" />
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
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" name="username" value={editFormData.username} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" value={editFormData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                  <label htmlFor="bio">Bio:</label>
                  <textarea id="bio" name="bio" value={editFormData.bio} onChange={handleInputChange} rows="4"></textarea>
              </div>
              <div className="form-group">
                  <label htmlFor="profilePic">Profile Picture:</label>
                  <input type="file" id="profilePic" name="profilePic" accept="image/*" onChange={handleFileChange} />
              </div>
              <h4>Social Links (Usernames/Handles)</h4>
               <div className="form-group">
                  <label htmlFor="twitter">Twitter:</label>
                  <input type="text" id="twitter" name="twitter" value={editFormData.twitter} onChange={handleInputChange} />
              </div>
               <div className="form-group">
                  <label htmlFor="linkedin">LinkedIn:</label>
                  <input type="text" id="linkedin" name="linkedin" value={editFormData.linkedin} onChange={handleInputChange} />
              </div>
               <div className="form-group">
                  <label htmlFor="github">GitHub:</label>
                  <input type="text" id="github" name="github" value={editFormData.github} onChange={handleInputChange} />
              </div>

              <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" onClick={handleEditToggle} disabled={loading} style={{ marginLeft: '10px', backgroundColor: 'grey', borderColor: 'grey' }}>Cancel</button>
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
               <p>{isOwnProfile ? 'You haven\'t created any posts yet.' : 'This user hasn\'t created any posts yet.'}</p>
           )}
      </div>

    </div>
  );
}

export default ProfilePage; 