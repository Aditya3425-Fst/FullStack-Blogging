import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const categoryApi = axios.create({
  baseURL: `${API_URL}/categories`,
});

// Add interceptor (optional, but good practice if admin actions need token)
categoryApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Fetch all categories
 * @returns {Promise<Array>}
 */
export const getAllCategories = async () => {
    try {
        const response = await categoryApi.get('/');
        return response.data;
    } catch (error) {
        console.error('Get Categories API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch categories');
    }
};

/**
 * Create a new category (Admin only)
 * @param {{ name: string, description?: string }} categoryData 
 * @returns {Promise<object>}
 */
export const createCategory = async (categoryData) => {
    try {
        const response = await categoryApi.post('/', categoryData);
        return response.data;
    } catch (error) {
        console.error('Create Category API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to create category');
    }
};

/**
 * Update a category (Admin only)
 * @param {string} categoryId
 * @param {{ name?: string, description?: string }} categoryData 
 * @returns {Promise<object>}
 */
export const updateCategory = async (categoryId, categoryData) => {
     try {
        const response = await categoryApi.put(`/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Update Category API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update category');
    }
};

/**
 * Delete a category (Admin only)
 * @param {string} categoryId
 * @returns {Promise<object>}
 */
export const deleteCategory = async (categoryId) => {
     try {
        const response = await categoryApi.delete(`/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Delete Category API error:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to delete category');
    }
};

// TODO: Add functions for create, update, delete categories (Admin only) 