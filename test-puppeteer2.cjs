const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  // Click the first service card
  console.log('Clicking service card...');
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.group.cursor-pointer');
    if(cards.length > 0) cards[0].click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
