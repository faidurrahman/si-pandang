const { chromium } = require('playwright');
const http = require('http');
const handler = require('serve-handler');

// Spin up a simple static server on port 8081
const server = http.createServer((request, response) => {
  return handler(request, response, { public: 'dist' });
});

server.listen(8081, async () => {
  console.log('Running at http://localhost:8081');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));
  
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    console.log('Page loaded');
    const content = await page.content();
    console.log('Page body length:', content.length);
  } catch (err) {
    console.log('Navigation failed', err);
  }
  
  await browser.close();
  server.close();
  process.exit(0);
});
