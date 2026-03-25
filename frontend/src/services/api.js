import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

// Add a request interceptor to include JWT token in headers
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;