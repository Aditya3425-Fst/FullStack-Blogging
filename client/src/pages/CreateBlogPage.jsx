import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../api/blog';
import { getAllCategories } from '../api/category';
import './CreateBlogPage.css';

function CreateBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState(''); // Comma-separated string
  const [coverImage, setCoverImage] = useState(null); // File object
  const [imagePreview, setImagePreview] = useState(null); // For displaying image preview
  const [status, setStatus] = useState('draft'); // Default to draft
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(true);

  const navigate = useNavigate();

  // Check for dark mode on mount and when body class changes
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.body.classList.contains('dark-mode');
      setIsDarkMode(isDark);
      
      // Apply emergency styles to all form inputs
      if (isDark) {
        const formInputs = document.querySelectorAll('.create-blog-page input, .create-blog-page textarea, .create-blog-page select');
        formInputs.forEach(input => {
          input.style.backgroundColor = '#2c2c2c';
          input.style.color = '#ffffff';
          input.style.borderColor = '#444';
        });
      }
    };
    
    // Check on mount
    checkDarkMode();
    
    // Set up observer for changes to body class
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Very strong inline styles that will override anything
  const forcedInputStyle = {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#333333',
    borderColor: isDarkMode ? '#444' : '#ddd',
    caretColor: isDarkMode ? '#ffffff' : 'auto'
  };

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
        const file = e.target.files[0];
        setCoverImage(file);
        
        // Create preview URL for the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
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

  // Add emergency fix styles to head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .dark-mode .create-blog-page input, 
      .dark-mode .create-blog-page textarea, 
      .dark-mode .create-blog-page select {
        background-color: #2c2c2c !important;
        color: #ffffff !important;
        border-color: #444 !important;
        caret-color: #ffffff !important;
      }
      
      .dark-mode .create-blog-page .form-group label {
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="create-blog-page container">
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data"> 
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="title" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging title"
            required
            style={forcedInputStyle}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            placeholder="Write your blog content here (Markdown supported)"
            required
            style={forcedInputStyle}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Category</label>
          <select 
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={categoryLoading}
            style={forcedInputStyle}
          >
            {categoryLoading ? (
                <option className="category-loading">Loading categories...</option>
            ) : categories.length > 0 ? (
                categories.map(cat => (
                    <option key={cat._id} value={cat._id} style={{ color: isDarkMode ? '#ffffff' : '#333' }}>
                      {cat.name}
                    </option>
                ))
            ) : (
                <option value="">No categories found</option> // Handle case with no categories
            )}
          </select>
        </div>

        <div className="form-group tags-field">
          <label htmlFor="tags" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Tags</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., react, javascript, webdev"
            style={forcedInputStyle}
          />
          <span className="tags-helper" style={{ color: isDarkMode ? '#dddddd' : '#6c757d' }}>Separate with commas</span>
        </div>

        <div className="form-group">
          <label htmlFor="coverImage" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Cover Image</label>
          <input
            type="file"
            id="coverImage"
            accept="image/*" // Accept only image files
            onChange={handleImageChange}
            style={{ color: isDarkMode ? '#ffffff' : 'inherit' }}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Cover preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="status" style={{ color: isDarkMode ? '#ffffff' : '#444' }}>Status</label>
          <div className="status-options">
            <div 
              className={`status-option draft ${status === 'draft' ? 'active' : ''}`}
              onClick={() => setStatus('draft')}
              style={{
                color: isDarkMode ? '#ffffff' : 'inherit',
                backgroundColor: isDarkMode ? '#2c2c2c' : 'inherit',
                borderColor: isDarkMode ? '#444' : 'inherit'
              }}
            >
              Draft
            </div>
            <div 
              className={`status-option published ${status === 'published' ? 'active' : ''}`}
              onClick={() => setStatus('published')}
              style={{
                color: isDarkMode ? '#ffffff' : 'inherit',
                backgroundColor: isDarkMode ? '#2c2c2c' : 'inherit',
                borderColor: isDarkMode ? '#444' : 'inherit'
              }}
            >
              Published
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading || categoryLoading}
        >
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

export default CreateBlogPage; 