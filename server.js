import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3001; // Use port 3001 to match the dev server

console.log('🚀 Starting custom Next.js server with Socket.IO...');
console.log('🌐 Environment:', dev ? 'development' : 'production');
console.log('🔌 Port:', port);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log('✅ Next.js app prepared');

  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      console.log('📡 Handling request:', req.method, req.url);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('❌ Error handling request:', err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.IO
  console.log('🔌 Initializing Socket.IO...');
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const corsOrigins = isDevelopment ? [
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
  ] : [
    'https://hnu-seven.vercel.app',
    'https://hnu-seven.vercel.app/en',
    'https://hnu-seven.vercel.app/ar',
    'https://hnu-seven.vercel.app/en/admin',
    'https://hnu-seven.vercel.app/ar/admin',
    'https://hnu-seven.vercel.app/en/admin/system/messages',
    'https://hnu-seven.vercel.app/ar/admin/system/messages',
  ];

  const io = new Server(server, {
    path: '/api/socketio',
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  console.log('✅ Socket.IO server created');

  // Store io instance globally for use in API routes
  global.io = io;

  // Socket.IO event handlers
  io.on('connection', socket => {
    console.log('🎉 New client connected!');
    console.log('🆔 Socket ID:', socket.id);
    console.log('🌐 Client origin:', socket.handshake.headers.origin);
    console.log(
      '🔍 Client user agent:',
      socket.handshake.headers['user-agent']
    );
    console.log('📡 Client transport:', socket.handshake.transport);
    console.log('🔗 Client query:', socket.handshake.query);

    socket.on('join-admin', () => {
      socket.join('admin');
      console.log('👑 Client joined admin room:', socket.id);
    });

    socket.on('leave-admin', () => {
      socket.leave('admin');
      console.log('👋 Client left admin room:', socket.id);
    });

    socket.on('contact-form-submit', data => {
      console.log('📝 Contact form submitted:', data);
      socket.to('admin').emit('new-contact-message', data);
      console.log('📤 Emitted new-contact-message to admin room');
    });

    socket.on('message-status-update', data => {
      console.log('📊 Message status updated:', data);
      socket.to('admin').emit('message-status-changed', data);
      console.log('📤 Emitted message-status-changed to admin room');
    });

    socket.on('message-deleted', data => {
      console.log('🗑️ Message deleted:', data);
      socket.to('admin').emit('message-deleted', data);
      console.log('📤 Emitted message-deleted to admin room');
    });

    socket.on('disconnect', reason => {
      console.log('❌ Client disconnected:', socket.id);
      console.log('📋 Disconnect reason:', reason);
    });

    socket.on('error', error => {
      console.error('💥 Socket error:', error);
    });
  });

  io.engine.on('connection_error', err => {
    console.error('🚨 Socket.IO engine connection error:', err);
    console.error('📋 Error details:', {
      message: err.message,
      description: err.description,
      context: err.context,
      type: err.type,
    });
  });

  // Start server
  server.listen(port, err => {
    if (err) throw err;
    console.log(`✅ Server ready on http://${hostname}:${port}`);
    console.log(
      `🔌 Socket.IO server running on http://${hostname}:${port}/api/socketio`
    );
  });
});
