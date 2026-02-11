import axios from 'axios';

const API_URL = import.meta.env.MODE === "development" ? 'http://localhost:5001/api' :"/api"; // Changed port to 5001

const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
});

export const signupUser = async (userData) => {
  try {
    const response = await authApi.post('/signup', userData);
    return response.data; // Should return { _id, username, email, role, token }
  } catch (error) {
    console.error('Signup API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Signup failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await authApi.post('/login', credentials);
    return response.data; // Should return { _id, username, email, role, token }
  } catch (error) {
    console.error('Login API error:', error.response?.data || error.message);
    throw error.response?.data || new Error('Login failed');
  }
};

// TODO: Add functions for forgot password, reset password, fetch user profile (GET /me) 