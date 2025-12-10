import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = process.env.PORT || (dev ? 3001 : 3000);

console.log('🚀 Starting Next.js server...');
console.log('🌐 Environment:', dev ? 'development' : 'production');
console.log('🔌 Port:', port);
console.log('🌍 Hostname:', hostname);

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

  // Start server
  server.listen(port, err => {
    if (err) throw err;
    console.log(`✅ Server ready on http://${hostname}:${port}`);
  });
});
