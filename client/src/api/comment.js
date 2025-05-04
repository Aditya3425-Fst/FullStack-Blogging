import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create separate instances for blog-nested routes and direct comment routes
const blogNestedCommentApi = axios.create({
  baseURL: `${API_URL}/blogs`,
});

const directCommentApi = axios.create({
  baseURL: `${API_URL}/comments`,
});

// Add interceptor to both instances (or create a helper)
[blogNestedCommentApi, directCommentApi].forEach(apiInstance => {
    apiInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
});


/**
 * Fetch comments for a specific blog post
 * @param {string} blogId
 * @returns {Promise<Array>}
 */
export const getCommentsForBlog = async (blogId) => {
  try {
    // Uses GET /api/blogs/:blogId/comments
    const response = await blogNestedCommentApi.get(`/${blogId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Get Comments API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch comments');
  }
};

/**
 * Add a comment to a blog post
 * @param {string} blogId
 * @param {{ text: string }} commentData
 * @returns {Promise<object>}
 */
export const addComment = async (blogId, commentData) => {
    try {
        // Uses POST /api/blogs/:blogId/comments
        const response = await blogNestedCommentApi.post(`/${blogId}/comments`, commentData);
        return response.data;
    } catch (error) { 
        console.error('Add Comment API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to add comment');
    }
};

/**
 * Delete a comment
 * @param {string} commentId
 * @returns {Promise<object>}
 */
export const deleteComment = async (commentId) => {
    try {
        // Uses DELETE /api/comments/:commentId
        const response = await directCommentApi.delete(`/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Delete Comment API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to delete comment');
    }
};

// TODO: Add function for updating comment (PUT /api/comments/:commentId) 