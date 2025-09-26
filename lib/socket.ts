import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { getCorsOrigins } from './socket-config';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const SocketHandler = (req: any, res: NextApiResponseServerIO) => {
  console.log('🔌 SocketHandler called');
  console.log('📡 Request URL:', req.url);
  console.log('🌐 Request origin:', req.headers.origin);
  console.log('🔍 Request method:', req.method);

  if (res.socket.server.io) {
    console.log('✅ Socket is already running');
  } else {
    console.log('🚀 Socket is initializing...');
    const corsOrigins = getCorsOrigins();
    console.log('🌍 CORS Origins:', corsOrigins);

    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socketio',
      cors: {
        origin: corsOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    res.socket.server.io = io;
    console.log('✅ Socket.IO server created and attached');

    io.on('connection', socket => {
      console.log('🎉 New client connected!');
      console.log('🆔 Socket ID:', socket.id);
      console.log('🌐 Client origin:', socket.handshake.headers.origin);
      console.log(
        '🔍 Client user agent:',
        socket.handshake.headers['user-agent']
      );
      console.log('📡 Client transport:', socket.conn.transport.name);
      console.log('🔗 Client query:', socket.handshake.query);

      // Join admin room for real-time updates
      socket.on('join-admin', () => {
        socket.join('admin');
        console.log('👑 Client joined admin room:', socket.id);
      });

      // Leave admin room
      socket.on('leave-admin', () => {
        socket.leave('admin');
        console.log('👋 Client left admin room:', socket.id);
      });

      // Handle contact form submissions
      socket.on('contact-form-submit', data => {
        console.log('📝 Contact form submitted:', data);
        // Broadcast to admin room
        socket.to('admin').emit('new-contact-message', data);
        console.log('📤 Emitted new-contact-message to admin room');
      });

      // Handle message status updates
      socket.on('message-status-update', data => {
        console.log('📊 Message status updated:', data);
        // Broadcast to admin room
        socket.to('admin').emit('message-status-changed', data);
        console.log('📤 Emitted message-status-changed to admin room');
      });

      // Handle message deletion
      socket.on('message-deleted', data => {
        console.log('🗑️ Message deleted:', data);
        // Broadcast to admin room
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
  }

  console.log('🏁 SocketHandler completed, ending response');
  res.end();
};

// Export the Socket.IO instance for use in API routes
export const getSocketIO = () => {
  return global.io;
};

// Store the Socket.IO instance globally
declare global {
  var io: any;
}
