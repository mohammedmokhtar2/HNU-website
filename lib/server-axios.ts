import axios from 'axios';
import { getUserIdHeader } from './auth-headers';

// Create server-side axios instance with default config
export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for server-side requests
serverApi.interceptors.request.use(
  async config => {
    const userId = await getUserIdHeader();
    if (userId) {
      config.headers['x-user-id'] = userId;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
serverApi.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access');
    } else if (error.response?.status === 404) {
      // Handle not found
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);
