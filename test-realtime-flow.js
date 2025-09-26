// Test script to verify real-time message flow between contact form and admin panel
// Run this with: node test-realtime-flow.js

const { io } = require('socket.io-client');

console.log('🧪 Testing Real-time Message Flow...');
console.log('🌐 Socket URL: http://localhost:3001');

// Create two socket connections: one for contact form, one for admin panel
const contactFormSocket = io('http://localhost:3001', {
  path: '/api/socketio',
  transports: ['websocket', 'polling'],
});

const adminPanelSocket = io('http://localhost:3001', {
  path: '/api/socketio',
  transports: ['websocket', 'polling'],
});

let contactFormConnected = false;
let adminPanelConnected = false;

// Contact Form Socket (simulates homepage contact form)
contactFormSocket.on('connect', () => {
  console.log('📝 Contact Form Socket Connected:', contactFormSocket.id);
  contactFormConnected = true;

  if (adminPanelConnected) {
    testMessageFlow();
  }
});

// Admin Panel Socket (simulates admin panel)
adminPanelSocket.on('connect', () => {
  console.log('👑 Admin Panel Socket Connected:', adminPanelSocket.id);

  // Join admin room
  adminPanelSocket.emit('join-admin');
  console.log('✅ Admin Panel joined admin room');

  adminPanelConnected = true;

  if (contactFormConnected) {
    testMessageFlow();
  }
});

// Listen for new contact messages in admin panel
adminPanelSocket.on('new-contact-message', data => {
  console.log('📨 Admin Panel received new contact message:', data);
  console.log('✅ Real-time flow working! Message delivered to admin panel');

  // Clean up and exit
  setTimeout(() => {
    contactFormSocket.disconnect();
    adminPanelSocket.disconnect();
    console.log('👋 Test completed successfully');
    process.exit(0);
  }, 1000);
});

// Error handling
contactFormSocket.on('connect_error', error => {
  console.error('❌ Contact Form connection error:', error.message);
});

adminPanelSocket.on('connect_error', error => {
  console.error('❌ Admin Panel connection error:', error.message);
});

// Test the message flow
function testMessageFlow() {
  console.log('🚀 Starting message flow test...');

  // Simulate contact form submission
  const testMessage = {
    id: `test-message-${Date.now()}`,
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject - Real-time Flow',
    message:
      'This is a test message to verify real-time communication between contact form and admin panel.',
    createdAt: new Date().toISOString(),
  };

  console.log('📤 Contact Form sending message:', testMessage);
  contactFormSocket.emit('contact-form-submit', testMessage);
}

// Timeout after 15 seconds
setTimeout(() => {
  console.log('⏰ Test timeout');
  contactFormSocket.disconnect();
  adminPanelSocket.disconnect();
  process.exit(1);
}, 15000);

console.log('🚀 Attempting to connect both sockets...');
