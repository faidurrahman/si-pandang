import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
  const html = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log('ROOT HTML LENGTH:', html.length);
  if (html.length < 100) {
    console.log('ROOT HTML:', html);
  }
  await browser.close();
})();
