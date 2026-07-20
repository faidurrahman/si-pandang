const { JSDOM } = require('jsdom');

JSDOM.fromURL("https://si-pandang.vercel.app", {
  runScripts: "dangerously",
  resources: "usable"
}).then(dom => {
  dom.window.onerror = function(message, source, lineno, colno, error) {
    console.log("JSDOM VERCEL ERROR:", message);
  };
  
  dom.window.console.error = function(...args) {
    console.log("JSDOM VERCEL CONSOLE ERROR:", ...args);
  };

  setTimeout(() => {
    console.log("Vercel Body HTML:", dom.window.document.body.innerHTML.substring(0, 300));
    process.exit(0);
  }, 5000);
}).catch(e => {
  console.log("JSDOM Failed:", e);
});
