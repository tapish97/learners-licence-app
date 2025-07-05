import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
});

// Attach JWT token to protected routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ✅
  console.log('💬 token from localStorage:', token);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
(error) => Promise.reject(error)
);
export default api;
