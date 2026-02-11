import axios from 'axios';

const API_URL = import.meta.env.MODE === "development" ? 'http://localhost:5001/api' :"/api";

// Axios instance for user routes
const userApi = axios.create({
  baseURL: `${API_URL}/users`,
});

// Add interceptor for JWT
userApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Fetch the logged-in user's profile data (/me)
 * @returns {Promise<object>} { user, blogs }
 */
export const getMyProfile = async () => {
    try {
        const response = await userApi.get('/me');
        return response.data;
    } catch (error) {
        console.error('Get My Profile API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch profile');
    }
};

/**
 * Fetch a specific user's public profile data
 * @param {string} userId
 * @returns {Promise<object>} { user, blogs }
 */
export const getUserProfile = async (userId) => {
    try {
        const response = await userApi.get(`/profile/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Get User Profile API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch user profile');
    }
};

/**
 * Update the logged-in user's profile
 * @param {FormData} profileData - FormData containing fields and optional profilePic file
 * @returns {Promise<object>} Updated user object
 */
export const updateMyProfile = async (profileData) => {
    try {
        const response = await userApi.put('/me', profileData, {
             headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Update Profile API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update profile');
    }
};

// --- Admin Functions ---

/**
 * Get all users (Admin)
 * @param {object} params - Optional query parameters (e.g., page, limit)
 * @returns {Promise<Array>} List of users
 */
export const getAllUsers = async (params = {}) => {
    try {
        const response = await userApi.get('/', { params });
        return response.data;
    } catch (error) {
        console.error('Get All Users API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch users');
    }
};

/**
 * Get user by ID (Admin)
 * @param {string} userId
 * @returns {Promise<object>} User object
 */
export const getUserByIdAdmin = async (userId) => {
    try {
        const response = await userApi.get(`/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Get User By ID (Admin) API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch user');
    }
};

/**
 * Update user by ID (Admin)
 * @param {string} userId 
 * @param {object} userData - Fields to update (e.g., role, username, email, bio)
 * @returns {Promise<object>} Updated user object
 */
export const updateUserAdmin = async (userId, userData) => {
     try {
        const response = await userApi.put(`/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Update User (Admin) API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update user');
    }
};

/**
 * Delete user by ID (Admin)
 * @param {string} userId
 * @returns {Promise<object>} Success message
 */
export const deleteUserAdmin = async (userId) => {
     try {
        const response = await userApi.delete(`/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Delete User (Admin) API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to delete user');
    }
};

// TODO: Add functions for admin user management (getAllUsers, etc.) 