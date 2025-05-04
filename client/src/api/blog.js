import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create an Axios instance for blog API
const blogApi = axios.create({
  baseURL: `${API_URL}/blogs`,
});

// Add JWT token to requests if available (using interceptor)
// This assumes your AuthContext sets the default header, but an interceptor is more robust
blogApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


/**
 * Fetch multiple blog posts with filtering, sorting, pagination
 * @param {object} params - Query parameters (page, limit, sort, category, tags, author, search)
 * @returns {Promise<object>} - Promise resolving to { data: [blogs], page, totalPages, totalBlogs, results }
 */
export const getBlogs = async (params = {}) => {
  try {
    const response = await blogApi.get('/', { params });
    return response.data; // { data: [], page, totalPages, ... }
  } catch (error) {
    console.error('Get Blogs API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch blogs');
  }
};

/**
 * Fetch a single blog post by ID
 * @param {string} blogId
 * @returns {Promise<object>}
 */
export const getBlogById = async (blogId) => {
  try {
    const response = await blogApi.get(`/${blogId}`);
    return response.data;
  } catch (error) {
    console.error('Get Blog By ID API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch blog post');
  }
};

/**
 * Create a new blog post
 * @param {FormData} blogData - FormData containing blog fields and optionally coverImage file
 * @returns {Promise<object>}
 */
export const createBlog = async (blogData) => {
    // Sending FormData requires specific headers - axios handles this automatically
    // IF NOT using FormData (e.g., just sending JSON), use: blogApi.post('/', blogData);
  try {
    const response = await blogApi.post('/', blogData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
  } catch (error) {
    console.error('Create Blog API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to create blog post');
  }
};

/**
 * Update a blog post
 * @param {string} blogId
 * @param {FormData} blogData - FormData containing updated fields and optionally new coverImage
 * @returns {Promise<object>}
 */
export const updateBlog = async (blogId, blogData) => {
  try {
    const response = await blogApi.put(`/${blogId}`, blogData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
  } catch (error) {
    console.error('Update Blog API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to update blog post');
  }
};

/**
 * Delete a blog post
 * @param {string} blogId
 * @returns {Promise<object>}
 */
export const deleteBlog = async (blogId) => {
  try {
    const response = await blogApi.delete(`/${blogId}`);
    return response.data;
  } catch (error) {
    console.error('Delete Blog API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to delete blog post');
  }
};

/**
 * Like a blog post
 * @param {string} blogId
 * @returns {Promise<object>}
 */
export const likeBlog = async (blogId) => {
    try {
        const response = await blogApi.put(`/${blogId}/like`);
        return response.data; // { message, likes, likedBy }
    } catch (error) {
        console.error('Like Blog API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to like post');
    }
};

/**
 * Unlike a blog post
 * @param {string} blogId
 * @returns {Promise<object>}
 */
export const unlikeBlog = async (blogId) => {
    try {
        const response = await blogApi.put(`/${blogId}/unlike`);
        return response.data; // { message, likes, likedBy }
    } catch (error) {
        console.error('Unlike Blog API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to unlike post');
    }
}; 