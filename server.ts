import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Hardcoded for now to avoid import issues with .tsx files in Node
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVVBp0iPfhIg6mGHdzolUquFHSG5bd6Ir3IeFzFvDyFt2zGZXgoTsIbJBs0K1b8slY/exec";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());
  app.use(express.text());

  // Proxy endpoint for images (to bypass CORS)
  app.get('/api/image-proxy', async (req, res) => {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
      }
      
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).send('Failed to fetch image');
      }
      
      res.set('Content-Type', response.headers.get('content-type') || 'image/jpeg');
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Cache-Control', 'public, max-age=31536000');
      
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Image proxy error:', error);
      res.status(500).json({ error: 'Failed to proxy image' });
    }
  });

  // Proxy endpoint for Google Apps Script
  app.all('/api/proxy', async (req, res) => {
    try {
      const url = new URL(APPS_SCRIPT_URL);
      
      // Forward query parameters
      Object.keys(req.query).forEach(key => {
        url.searchParams.append(key, req.query[key] as string);
      });

      const options: RequestInit = {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        redirect: 'follow',
      };

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      }

      console.log(`Proxying ${req.method} request to Google Apps Script...`);
      const response = await fetch(url.toString(), options);
      
      if (!response.ok) {
        console.error(`Google Apps Script returned ${response.status}: ${response.statusText}`);
        return res.status(response.status).send(await response.text());
      }

      const data = await response.text();
      res.status(200).send(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Failed to fetch from Google Apps Script' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
