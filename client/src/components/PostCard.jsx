import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { deleteBlog } from '../api/blog';
import './PostCard.css';

// Format date to a readable string
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Function to generate a short snippet from content
const createSnippet = (content, length = 100) => {
  if (!content) return '';
  // Basic snippet (doesn't handle HTML tags well)
  return content.length > length ? content.substring(0, length) + '...' : content;
};

function PostCard({ post, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!post) return null;

  // Basic placeholder image if coverImage is missing
  const imageUrl = post.coverImage || 'https://picsum.photos/800/400?random=' + post._id;

  // Check if current user is author or admin
  const canDelete = user && (
    (post.author && post.author._id === user.id) || 
    user.role === 'admin'
  );

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        setIsDeleting(true);
        await deleteBlog(post._id);
        
        // If onDelete callback exists, call it to refresh the post list
        if (onDelete) {
          onDelete(post._id);
        } else {
          // Otherwise, refresh the page
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="post-card">
      <div className="post-card-image-container">
        <Link to={`/blog/${post._id}`} className="post-card-image-link">
          <img src={imageUrl} alt={post.title} className="post-card-image" />
        </Link>
        {post.category && (
          <Link to={`/blogs?category=${post.category._id}`} className="post-card-category">
            {post.category.name}
          </Link>
        )}
        {canDelete && (
          <button 
            className="post-card-delete-btn" 
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label="Delete post"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        )}
      </div>
      <div className="post-card-content">
        <Link to={`/blog/${post._id}`} className="post-card-title-link">
          <h3 className="post-card-title">{post.title}</h3>
        </Link>
        <p className="post-card-snippet">{createSnippet(post.content, 120)}</p>
        <div className="post-card-meta">
          {post.author && (
            <div className="post-card-author">
              <div className="author-avatar">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt={post.author.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {post.author.username && post.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="author-info">
                <Link to={`/profile/${post.author._id}`} className="author-name">
                  {post.author.username}
                </Link>
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>
            </div>
          )}
          <div className="post-card-stats">
            <span className="post-card-likes">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {post.likes || 0}
            </span>
            <span className="post-card-comments">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              {post.comments?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard; 