import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, updateBlog } from '../api/blog';
import { getAllCategories } from '../api/category';
import { useAuth } from '../contexts/AuthContext';
import './CreateBlogPage.css'; // Reuse styles from Create page for now

function EditBlogPage() {
  const { blogId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [currentCoverImageUrl, setCurrentCoverImageUrl] = useState('');
  const [status, setStatus] = useState('draft');
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Fetch blog data and categories
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [blogData, catsData] = await Promise.all([
                getBlogById(blogId),
                getAllCategories()
            ]);

            // Authorization check
            if (!user || (blogData.author._id !== user._id && user.role !== 'admin')) {
                setError('You are not authorized to edit this post.');
                setIsAuthorized(false);
                setLoading(false);
                return;
            }
            setIsAuthorized(true);

            // Populate form state
            setTitle(blogData.title || '');
            setContent(blogData.content || '');
            setCategory(blogData.category?._id || '');
            setTags(blogData.tags?.join(', ') || '');
            setStatus(blogData.status || 'draft');
            setCurrentCoverImageUrl(blogData.coverImage || '');

            // Set categories
            setCategories(catsData || []);
            // Ensure the fetched category is selected if categories loaded
            if (catsData && catsData.length > 0 && !blogData.category?._id) {
                // If blog has no category, default to first? Or require selection?
                // For now, leave it blank if it was blank
            }

        } catch (err) {
            setError(err.message || 'Failed to load blog data or categories.');
            setIsAuthorized(false); // Cannot edit if data fails to load
        } finally {
            setLoading(false);
        }
    };

    if (blogId) {
        fetchData();
    } else {
        setError('No blog ID provided.');
        setLoading(false);
    }

  }, [blogId, user]);

  const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setCoverImage(e.target.files[0]);
        setCurrentCoverImageUrl(URL.createObjectURL(e.target.files[0])); // Show preview
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthorized) return; // Prevent submission if not authorized

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('status', status);
    
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    tagsArray.forEach(tag => formData.append('tags[]', tag)); 

    if (coverImage) { // Only append if a *new* image was selected
        formData.append('coverImage', coverImage);
    } else {
        // If no new image, but maybe user wants to remove?
        // Backend handles updating based on presence/absence of coverImage field
        // To explicitly *remove* image, maybe send coverImage=""? Requires backend adjustment.
        // For now, if no new image selected, the old one remains unless explicitly cleared via URL field (not implemented here)
    }

    try {
      const updatedBlog = await updateBlog(blogId, formData);
      navigate(`/blog/${updatedBlog._id}`); // Navigate to the updated blog post
    } catch (err) {
      setError(err.message || 'Failed to update blog post.');
    } finally {
      setLoading(false);
    }
  };

  // Render Logic
  if (loading) return <p className="container">Loading editor...</p>;
  if (error) return <p className="error-message container">Error: {error}</p>;
  if (!isAuthorized) return <p className="error-message container">Unauthorized.</p>; // Already handled by error state, but explicit check

  return (
    <div className="create-blog-page container"> {/* Reuse class */} 
      <h2>Edit Blog Post</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data"> 
        {error && <p className="error-message">{error}</p>}
        
        {/* Title */} 
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Content */} 
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            required
          />
        </div>

        {/* Category */} 
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select 
            id="category"
            value={category} // Value should be category ID
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={categories.length === 0}
          >
             <option value="" disabled>-- Select a Category --</option>
            {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Tags */} 
        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated):</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., react, javascript, webdev"
          />
        </div>

        {/* Cover Image */} 
         <div className="form-group">
          <label htmlFor="coverImage">Cover Image:</label>
          {currentCoverImageUrl && (
              <img src={currentCoverImageUrl} alt="Current cover" style={{ maxWidth: '200px', display: 'block', marginBottom: '10px' }}/>
          )}
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Upload a new image to replace the current one.</small>
        </div>

        {/* Status */} 
        <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select 
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
            >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
            </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default EditBlogPage; 