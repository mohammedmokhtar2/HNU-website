import axios from 'axios';

// Get the correct base URL for API calls
const getBaseURL = () => {
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (typeof window !== 'undefined') {
    // Client-side: use current origin + /api
    const clientURL = `${window.location.origin}/api`;
    console.log(`🌐 Client-side API URL: ${clientURL}`);
    return clientURL;
  }

  // Server-side: use environment variable for production, localhost for development
  if (isDevelopment) {
    const devURL = 'http://localhost:3000/api';
    console.log(`🔧 Development API URL: ${devURL}`);
    return devURL;
  }

  // Production: use environment variable
  const prodURL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : 'http://localhost:3000/api';
  console.log(`🚀 Production API URL: ${prodURL}`);
  return prodURL;
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
    const baseURL = config.baseURL || 'unknown';
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url} (Base: ${baseURL})`
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
