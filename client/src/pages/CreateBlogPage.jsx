import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../api/blog';
import { getAllCategories } from '../api/category';
import './CreateBlogPage.css'; // Create later

function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState(''); // Comma-separated string
  const [coverImage, setCoverImage] = useState(null); // File object
  const [status, setStatus] = useState('draft'); // Default to draft
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
        setCategoryLoading(true);
        try {
            const cats = await getAllCategories();
            setCategories(cats || []);
            if (cats && cats.length > 0) {
                 setCategory(cats[0]._id); // Default to first category
            }
        } catch (err) {
            setError('Failed to load categories.');
            console.error(err);
        } finally {
            setCategoryLoading(false);
        }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setCoverImage(e.target.files[0]);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!category) {
        setError('Please select a category.');
        setLoading(false);
        return;
    }

    // Use FormData to send file and other data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('status', status);
    
    // Process tags string into array
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    tagsArray.forEach(tag => formData.append('tags[]', tag)); // Send tags as an array

    if (coverImage) {
        formData.append('coverImage', coverImage);
    }

    try {
      const newBlog = await createBlog(formData); // API expects FormData
      navigate(`/blog/${newBlog._id}`); // Navigate to the new blog post
    } catch (err) {
      setError(err.message || 'Failed to create blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-page container">
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data"> 
        {error && <p className="error-message">{error}</p>}
        
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

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          {/* Consider using a Rich Text Editor component here later */}
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select 
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={categoryLoading}
          >
            {categoryLoading ? (
                <option>Loading categories...</option>
            ) : categories.length > 0 ? (
                categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))
            ) : (
                <option value="">No categories found</option> // Handle case with no categories
            )}
          </select>
        </div>

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

         <div className="form-group">
          <label htmlFor="coverImage">Cover Image:</label>
          <input
            type="file"
            id="coverImage"
            accept="image/*" // Accept only image files
            onChange={handleImageChange}
          />
          {/* Optional: Show preview of selected image */} 
        </div>

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

        <button type="submit" disabled={loading || categoryLoading}>
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default CreateBlogPage; 