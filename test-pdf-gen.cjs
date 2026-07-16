const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Click on "Rekap Kehadiran" tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const rekapTab = tabs.find(t => t.textContent.includes('Rekap Kehadiran'));
    if (rekapTab) rekapTab.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Select the first kegiatan
  await page.evaluate(() => {
    const select = document.querySelector('select');
    if (select && select.options.length > 1) {
      select.value = select.options[1].value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await new Promise(r => setTimeout(r, 2000));
  
  // Click "Save PDF"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const saveBtn = buttons.find(t => t.textContent.includes('Save PDF'));
    if (saveBtn) saveBtn.click();
  });

  // Wait for some time to let PDF generation run
  await new Promise(r => setTimeout(r, 5000));

  await browser.close();
})();
