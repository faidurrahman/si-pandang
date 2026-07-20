const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');
fs.writeFileSync('index.html', html);
