import axios from 'axios';

const API = axios.create({
  // Use environment variable for hosted backend URL, fallback to localhost for development
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

export default API;
