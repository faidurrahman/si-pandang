const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  try {
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log("Page loaded successfully");
  } catch (e) {
    console.log("Navigation error:", e.message);
  }
  
  await browser.close();
})();
