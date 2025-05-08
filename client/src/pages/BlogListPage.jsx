import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBlogs } from '../api/blog';
import PostCard from '../components/PostCard';
import './BlogListPage.css'; // Create later for styling

function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams(); // For filtering/sorting via URL query params

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError('');
      try {
        // Construct params from state and URL search params
        const params = {
            page: page,
            limit: 9, // Adjust limit as needed
            sort: searchParams.get('sort') || '-createdAt',
            category: searchParams.get('category'),
            tags: searchParams.get('tags'),
            author: searchParams.get('author'),
            search: searchParams.get('search'),
        };
        // Remove null/undefined params
        Object.keys(params).forEach(key => (params[key] == null || params[key] === '') && delete params[key]);

        const response = await getBlogs(params);
        setBlogs(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        setError(err.message || 'Failed to fetch blog posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, searchParams]); // Refetch when page or searchParams change

  const handlePrevPage = () => {
      setPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
      setPage(prev => Math.min(prev + 1, totalPages));
  };

  // Handle post deletion
  const handlePostDelete = (deletedPostId) => {
    // Remove the deleted post from state
    setBlogs(currentBlogs => currentBlogs.filter(blog => blog._id !== deletedPostId));
  };

  // TODO: Add UI elements for sorting, filtering, searching which update searchParams

  return (
    <div className="blog-list-page">
      <h2>All Blog Posts</h2>
      {/* TODO: Add filtering/sorting UI here */} 
      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && blogs.length === 0 && (
          <p>No blog posts found.</p>
      )}
      <div className="blog-list-container">
        {blogs.map(blog => (
          <PostCard key={blog._id} post={blog} onDelete={handlePostDelete} />
        ))}
      </div>

      {/* Pagination Controls */} 
      {!loading && totalPages > 1 && (
          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={page <= 1}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={page >= totalPages}>Next</button>
          </div>
      )}
    </div>
  );
}

export default BlogListPage; 