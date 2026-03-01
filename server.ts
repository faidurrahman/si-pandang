import express from 'express';
import { createServer as createViteServer } from 'vite';

// Hardcoded for now to avoid import issues with .tsx files in Node
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw_qce-_O5ELCBZhI9mJ0ZzcYY-jypZitUpM_Ph-w8R3bcp3pJ8aiazncFUubG-OlxE/exec";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());
  app.use(express.text());

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
        },
      };

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        options.body = JSON.stringify(req.body);
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
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
