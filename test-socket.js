// Test script to verify Socket.IO connection
// Run this with: node test-socket.js

const { io } = require('socket.io-client');

// Get configuration from environment or use defaults
const getSocketUrl = () => {
  return (
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001'
  ); // Updated to use port 3001
};

console.log('🧪 Testing Socket.IO connection...');
console.log('🌐 Socket URL:', getSocketUrl());

const socket = io(getSocketUrl(), {
  path: '/api/socketio',
  transports: ['websocket', 'polling'],
  timeout: 10000, // 10 second timeout
});

socket.on('connect', () => {
  console.log('✅ Connected to Socket.IO server');
  console.log('🆔 Socket ID:', socket.id);
  console.log('📡 Transport:', socket.io.engine.transport.name);

  // Test admin room join
  socket.emit('join-admin');
  console.log('✅ Joined admin room');

  // Test contact form submission
  socket.emit('contact-form-submit', {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Message',
    message: 'This is a test message from the socket test script',
  });
  console.log('✅ Sent test contact form submission');

  // Disconnect after 5 seconds
  setTimeout(() => {
    socket.disconnect();
    console.log('✅ Disconnected from server');
    process.exit(0);
  }, 5000);
});

socket.on('connect_error', error => {
  console.error('❌ Connection error:', error.message);
  console.error('📋 Error details:', error);
  process.exit(1);
});

socket.on('disconnect', reason => {
  console.log('📡 Disconnected from server:', reason);
});

socket.on('new-contact-message', data => {
  console.log('📨 Received new contact message:', data);
});

socket.on('error', error => {
  console.error('❌ Socket error:', error);
});

// Timeout after 15 seconds
setTimeout(() => {
  console.log('⏰ Connection timeout');
  socket.disconnect();
  process.exit(1);
}, 15000);

console.log(
  `🚀 Attempting to connect to Socket.IO at ${getSocketUrl()}/api/socketio`
);
