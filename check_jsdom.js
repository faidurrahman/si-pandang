import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

(async () => {
  const html = await fetch('http://localhost:3000').then(r => r.text());
  const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable", url: "http://localhost:3000" });
  dom.window.addEventListener('error', (e) => console.log('ERROR:', e.error));
  dom.window.addEventListener('unhandledrejection', (e) => console.log('REJECTION:', e.reason));
  
  setTimeout(() => {
    console.log('HTML after 3s:', dom.window.document.getElementById('root').innerHTML.slice(0, 100));
    process.exit(0);
  }, 3000);
})();
