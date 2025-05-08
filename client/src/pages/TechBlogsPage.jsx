import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TechBlogsPage.css';

function TechBlogsPage() {
  const [techBlogs, setTechBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTechBlogs = async () => {
      setLoading(true);
      try {
        // Using NewsAPI.org to fetch technology articles
        const apiKey = import.meta.env.VITE_NEWS_API_KEY || 'your_default_api_key';
        const response = await axios.get('https://newsapi.org/v2/top-headlines', {
          params: {
            category: 'technology',
            language: 'en',
            pageSize: 12, // Number of articles to display
            apiKey
          }
        });
        
        if (response.data.status === 'ok') {
          setTechBlogs(response.data.articles);
        } else {
          throw new Error('Failed to fetch technology blogs');
        }
      } catch (err) {
        console.error('Tech Blogs fetch error:', err);
        setError('Failed to load technology blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTechBlogs();
  }, []);

  return (
    <div className="tech-blogs-page">
      <div className="tech-blogs-header">
        <h1>Technology Blogs</h1>
        <p>Discover the latest insights, trends, and news in the technology world.</p>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading technology blogs...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="tech-blogs-grid">
          {techBlogs.map((blog, index) => (
            <div className="tech-blog-card" key={index}>
              <div className="blog-image-container">
                {blog.urlToImage ? (
                  <img src={blog.urlToImage} alt={blog.title} className="blog-image" />
                ) : (
                  <div className="placeholder-image">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              <div className="blog-content">
                <h2 className="blog-title">{blog.title}</h2>
                <p className="blog-description">{blog.description}</p>
                <div className="blog-meta">
                  <span className="blog-source">{blog.source.name}</span>
                  <span className="blog-date">{new Date(blog.publishedAt).toLocaleDateString()}</span>
                </div>
                <a href={blog.url} target="_blank" rel="noopener noreferrer" className="read-more-link">
                  Read Full Article <span className="arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && techBlogs.length === 0 && (
        <div className="no-blogs-message">
          <p>No technology blogs found. Please try again later.</p>
        </div>
      )}
    </div>
  );
}

export default TechBlogsPage; 