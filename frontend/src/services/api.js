import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to attach JWT Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('apexquant_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated sessions
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin')) {
        localStorage.removeItem('apexquant_token');
        localStorage.removeItem('apexquant_user');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
