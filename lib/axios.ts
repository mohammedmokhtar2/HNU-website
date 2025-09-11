import axios from 'axios';

// Get the correct base URL for API calls
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin + /api
    return `${window.location.origin}/api`;
  }
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : 'http://localhost:3000/api';
};

// Client-side instance
export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  error => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error(
      '❌ API Response Error:',
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

// Server-side instance (if needed)
export const serverApi = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Set custom header
export const setUserIdHeader = (userId: string | null) => {
  if (userId) {
    api.defaults.headers.common['x-user-id'] = userId;
    serverApi.defaults.headers.common['x-user-id'] = userId;
  } else {
    delete api.defaults.headers.common['x-user-id'];
    delete serverApi.defaults.headers.common['x-user-id'];
  }
};
