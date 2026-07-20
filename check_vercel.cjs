const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('VERCEL LOG:', msg.text()));
  page.on('pageerror', err => console.log('VERCEL ERROR:', err.toString()));
  
  try {
    await page.goto('https://si-pandang.vercel.app', { waitUntil: 'networkidle', timeout: 15000 });
    console.log("Vercel Page loaded");
    const content = await page.content();
    console.log("Body length:", content.length);
  } catch (e) {
    console.log("Navigation error:", e.message);
  }
  
  await browser.close();
})();
