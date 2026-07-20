const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('dist/index.html', 'utf8');

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "outside-only",
  resources: "usable"
});

// Polyfill
dom.window.fetch = async () => ({ json: async () => ({}), text: async () => "{}" });
dom.window.alert = () => {};
dom.window.scrollTo = () => {};

// Add a script that we can run
const bundleCode = fs.readFileSync(fs.readdirSync('dist/assets').filter(f => f.startsWith('index') && f.endsWith('.js')).map(f => 'dist/assets/' + f)[0], 'utf8');

dom.window.onerror = function(message, source, lineno, colno, error) {
  console.log("JSDOM ERROR:", message);
  if (error) console.log(error.stack);
};

dom.window.console.error = function(...args) {
  console.log("JSDOM CONSOLE ERROR:", ...args);
};

try {
  dom.window.eval(bundleCode);
} catch(e) {
  console.log("EVAL ERROR:", e.stack);
}

setTimeout(() => {
  console.log("Body innerHTML:", dom.window.document.body.innerHTML.substring(0, 200));
  process.exit(0);
}, 3000);
