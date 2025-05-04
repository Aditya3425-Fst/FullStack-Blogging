import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, likeBlog, unlikeBlog, deleteBlog } from '../api/blog';
import { getCommentsForBlog, addComment, deleteComment } from '../api/comment';
import { useAuth } from '../contexts/AuthContext';
import './BlogDetailsPage.css'; // Create later for styling

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
}

function BlogDetailsPage() {
  const { id: blogId } = useParams();
  const { user } = useAuth(); // Get logged-in user info
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likeError, setLikeError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  // Fetch blog post and comments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [blogData, commentsData] = await Promise.all([
          getBlogById(blogId),
          getCommentsForBlog(blogId)
        ]);
        setBlog(blogData);
        setComments(commentsData);
        // Check if the current user has liked this post
        if (user && blogData?.likedBy?.includes(user._id)) {
            setIsLiked(true);
        } else {
            setIsLiked(false); // Ensure it's reset if user logs out or changes
        }
      } catch (err) {
        setError(err.message || 'Failed to load blog post or comments.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [blogId, user]); // Refetch if blogId changes or user logs in/out

  // --- Like/Unlike Handler ---
  const handleLikeToggle = async () => {
    if (!user) {
        setLikeError('You must be logged in to like posts.');
        return;
    }
    setLikeError('');
    // Optimistic UI update
    const originalLikedState = isLiked;
    const originalBlogState = { ...blog };
    setIsLiked(!originalLikedState);
    setBlog(prev => ({
        ...prev,
        likes: originalLikedState ? prev.likes - 1 : prev.likes + 1,
        likedBy: originalLikedState
            ? prev.likedBy.filter(id => id !== user._id)
            : [...prev.likedBy, user._id]
    }));

    try {
        let response;
        if (originalLikedState) { // If it was liked, call unlike
            response = await unlikeBlog(blogId);
        } else { // If it was not liked, call like
            response = await likeBlog(blogId);
        }
        // Update state with response from server to ensure consistency (optional, if optimistic is enough)
        // setBlog(prev => ({ ...prev, likes: response.likes, likedBy: response.likedBy }));
        // setIsLiked(response.likedBy.includes(user._id));

    } catch (err) {
        // Revert optimistic update on error
        setIsLiked(originalLikedState);
        setBlog(originalBlogState);
        setLikeError(err.message || 'Failed to update like status.');
    }
  };

  // --- Comment Handlers ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        setCommentError('You must be logged in to comment.');
        return;
    }
    if (!newCommentText.trim()) {
        setCommentError('Comment cannot be empty.');
        return;
    }
    setCommentError('');
    try {
        const addedComment = await addComment(blogId, { text: newCommentText });
        // Ensure author details are populated (backend should do this, but double-check)
        if (!addedComment.author) {
            addedComment.author = { _id: user._id, username: user.username, profilePic: user.profilePic };
        }
        setComments(prev => [addedComment, ...prev]); // Add new comment to the top
        setNewCommentText(''); // Clear input field
    } catch (err) {
        setCommentError(err.message || 'Failed to add comment.');
    }
  };

  const handleCommentDelete = async (commentId) => {
      if (!window.confirm('Are you sure you want to delete this comment?')) return;
      setCommentError(''); // Clear previous errors
      try {
          await deleteComment(commentId);
          setComments(prev => prev.filter(comment => comment._id !== commentId));
      } catch (err) {
          setCommentError(err.message || 'Failed to delete comment.');
      }
  };

  // --- Blog Delete Handler ---
  const handleBlogDelete = async () => {
       if (!window.confirm('Are you sure you want to delete this blog post?')) return;
       setError(''); // Clear previous errors
       try {
           await deleteBlog(blogId);
           navigate('/blogs'); // Redirect after successful deletion
       } catch (err) {
            setError(err.message || 'Failed to delete blog post.');
       }
  };


  // --- Render Logic ---
  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!blog) return <NotFoundPage />; // Use NotFoundPage if blog fetch resulted in null/error

  const canEditDelete = user && (user._id === blog.author?._id || user.role === 'admin');

  return (
    <div className="blog-details-page container"> {/* Add container class */}
      <img src={blog.coverImage || 'https://via.placeholder.com/800x300?text=No+Image'} alt={blog.title} className="blog-details-cover" />
      <h1>{blog.title}</h1>
      <div className="blog-meta">
        <span>By: <Link to={`/profile/${blog.author?._id || 'unknown'}`}>{blog.author?.username || 'Unknown'}</Link></span>
        <span> | On: {formatDate(blog.createdAt)}</span>
        {blog.category && <span> | Category: <Link to={`/blogs?category=${blog.category._id}`}>{blog.category.name}</Link></span>}
         {/* Display Edit/Delete buttons if authorized */}
         {canEditDelete && (
             <div className="blog-actions">
                 <Link to={`/edit-blog/${blog._id}`} className="edit-button">Edit Post</Link> {/* TODO: Create EditBlogPage and route */}
                 <button onClick={handleBlogDelete} className="delete-button">Delete Post</button>
             </div>
         )}
      </div>
      {blog.tags && blog.tags.length > 0 && (
        <div className="blog-tags">
          Tags: {blog.tags.map(tag => <Link key={tag} to={`/blogs?tags=${tag}`} className="tag-link">#{tag}</Link>)}
        </div>
      )}
      {/* Use dangerouslySetInnerHTML cautiously if content contains HTML, otherwise just render text */}
      {/* Consider using a sanitizer library (like DOMPurify) if content is user-generated HTML */}
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>

      <hr />

      {/* --- Like Section --- */}
      <div className="like-section">
        <button onClick={handleLikeToggle} disabled={!user || likeError} className={`like-button ${isLiked ? 'liked' : ''}`}>
          {isLiked ? '❤️ Liked' : '🤍 Like'} ({blog.likes || 0})
        </button>
        {likeError && <p className="error-message">{likeError}</p>}
      </div>

      <hr />

      {/* --- Comments Section --- */}
      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>
        {/* Add Comment Form (only if logged in) */}
        {user && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write your comment..."
              rows={3}
              required
            />
            <button type="submit">Submit Comment</button>
            {commentError && <p className="error-message">{commentError}</p>}
          </form>
        )}
        {!user && <p>Please <Link to="/login">login</Link> to add a comment.</p>}

        {/* Display Comments */}
        <ul className="comment-list">
          {comments.length > 0 ? (
            comments.map(comment => (
              <li key={comment._id} className="comment-item">
                <div className="comment-author">
                  {/* TODO: Add profile pic? */}
                  <Link to={`/profile/${comment.author?._id || 'unknown'}`}>{comment.author?.username || 'Unknown User'}</Link>
                  <span> - {formatDate(comment.createdAt)}</span>
                </div>
                <p>{comment.text}</p>
                {/* Delete button for own comments or if user is admin */}
                {(user && (user._id === comment.author?._id || user.role === 'admin')) && (
                    <button onClick={() => handleCommentDelete(comment._id)} className="delete-comment-button">Delete</button>
                )}
              </li>
            ))
          ) : (
            !loading && <p>No comments yet. Be the first to comment!</p> // Show only if not loading
          )}
        </ul>
        {/* Show comment error globally if it occurred during delete */}
        {commentError && !user && <p className="error-message">{commentError}</p>}
      </div>
    </div>
  );
}

export default BlogDetailsPage;
