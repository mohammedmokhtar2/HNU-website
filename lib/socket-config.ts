// Socket.IO configuration utilities
export const getSocketConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isClient = typeof window !== 'undefined';

  // For client-side, use the public environment variable
  if (isClient) {
    return {
      url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
      path: '/api/socketio',
      transports: ['websocket', 'polling'],
      autoConnect: true,
    };
  }

  // For server-side, construct the URL
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (isDevelopment ? 'http://localhost:3001' : 'https://yourdomain.com');

  return {
    url: baseUrl,
    path: '/api/socketio',
    transports: ['websocket', 'polling'],
    autoConnect: true,
  };
};

export const getCorsOrigins = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (isDevelopment ? 'http://localhost:3001' : 'https://yourdomain.com');

  if (isDevelopment) {
    return [
      'http://localhost:3000',
      'http://localhost:3000/en',
      'http://localhost:3000/ar',
      'http://localhost:3000/en/admin',
      'http://localhost:3000/ar/admin',
      'http://localhost:3000/en/admin/system/messages',
      'http://localhost:3000/ar/admin/system/messages',
      'http://localhost:3001',
      'http://localhost:3001/en',
      'http://localhost:3001/ar',
      'http://localhost:3001/en/admin',
      'http://localhost:3001/ar/admin',
      'http://localhost:3001/en/admin/system/messages',
      'http://localhost:3001/ar/admin/system/messages',
    ];
  }

  return [
    baseUrl,
    `${baseUrl}/en`,
    `${baseUrl}/ar`,
    `${baseUrl}/en/admin`,
    `${baseUrl}/ar/admin`,
    `${baseUrl}/en/admin/system/messages`,
    `${baseUrl}/ar/admin/system/messages`,
  ].filter(Boolean);
};

export const getApiUrl = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (isDevelopment ? 'http://localhost:3000' : 'https://yourdomain.com')
  );
};
