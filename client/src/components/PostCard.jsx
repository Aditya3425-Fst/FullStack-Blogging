import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css'; // Create this CSS file later

// Function to generate a short snippet from content
const createSnippet = (content, length = 100) => {
    if (!content) return '';
    // Basic snippet (doesn't handle HTML tags well)
    return content.length > length ? content.substring(0, length) + '...' : content;
};

function PostCard({ post }) {
  if (!post) return null;

  // Basic placeholder image if coverImage is missing
  const imageUrl = post.coverImage || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="post-card">
        <Link to={`/blog/${post._id}`} className="post-card-image-link">
            <img src={imageUrl} alt={post.title} className="post-card-image" />
        </Link>
        <div className="post-card-content">
            {post.category && (
                <Link to={`/blogs?category=${post.category._id}`} className="post-card-category">
                    {post.category.name}
                 </Link>
            )}
            <Link to={`/blog/${post._id}`} className="post-card-title-link">
                 <h3 className="post-card-title">{post.title}</h3>
            </Link>
            <p className="post-card-snippet">{createSnippet(post.content, 120)}</p>
            <div className="post-card-footer">
                <span className="post-card-author">
                    By {post.author ? (
                        <Link to={`/profile/${post.author._id}`}>{post.author.username}</Link>
                     ) : (
                        'Unknown Author'
                    )}
                </span>
                <span className="post-card-likes">❤️ {post.likes || 0}</span> 
                {/* TODO: Add date */} 
            </div>
        </div>
    </div>
  );
}

export default PostCard; 