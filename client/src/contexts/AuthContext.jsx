import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; // We'll need axios later for API calls

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken')); // Load token from local storage

  useEffect(() => {
    // TODO: Fetch user data if token exists when app loads
    // This might involve a GET /api/auth/me endpoint on the backend
    // For now, we'll just assume the token holds enough info or decode it locally (less secure)
    if (token) {
      // Option 1: Decode token locally (simpler, less secure, less info)
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Basic decode, NO verification
        // You might store basic info like id, role directly in token
        // IMPORTANT: DO NOT trust this data for critical actions without backend verification
        setUser({ id: decodedToken.id, role: decodedToken.role /*, maybe username? */ });
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
      // Option 2: Call backend to verify token and get user data (more secure)
      // async function fetchUser() { ... call backend ... setUser(data); setLoading(false); }
      // fetchUser();
    }
    setLoading(false);
  }, [token]);

  const login = (userData) => {
    // userData should contain the user object and the token
    localStorage.setItem('authToken', userData.token);
    setToken(userData.token);
    setUser({ 
        _id: userData._id, 
        username: userData.username, 
        email: userData.email, 
        role: userData.role 
        // Add other fields as needed
    });
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    // Navigate user to dashboard or home page (handled in component)
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    // Navigate user to login page (handled in component)
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
}; 