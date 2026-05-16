import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Changed from 5000 due to Mac AirPlay conflict
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
