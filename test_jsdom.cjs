const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('dist/index.html', 'utf8');

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  resources: "usable"
});

dom.window.onerror = function(message, source, lineno, colno, error) {
  console.log("JSDOM ERROR:", message);
  if (error) console.log(error.stack);
};

dom.window.console.error = function(...args) {
  console.log("JSDOM CONSOLE ERROR:", ...args);
};

// We need to polyfill fetch and others if needed
dom.window.fetch = async () => ({ json: async () => ({}), text: async () => "" });

setTimeout(() => {
  console.log("Body innerHTML:", dom.window.document.body.innerHTML.substring(0, 200));
  process.exit(0);
}, 3000);
