import fs from 'fs';
let contentApp = fs.readFileSync('App.tsx', 'utf8');
contentApp = contentApp.replace(
  'src="/logo-kecamatan.png"',
  'src="https://lh3.googleusercontent.com/d/1BU0DPMBjVe379MQ7Rczjn3_s4DAEa5L9"'
);
contentApp = contentApp.replace(
  'src="/logo-pemkot.png"',
  'src="https://lh3.googleusercontent.com/d/1dxwhUWW20e4w8BdOcrwaojHbz0GxGOwQ"'
);
fs.writeFileSync('App.tsx', contentApp);

let contentPT = fs.readFileSync('components/PageTransition.tsx', 'utf8');
contentPT = contentPT.replace(
  'src="/logo-kecamatan.png"',
  'src="https://lh3.googleusercontent.com/d/1BU0DPMBjVe379MQ7Rczjn3_s4DAEa5L9"'
);
fs.writeFileSync('components/PageTransition.tsx', contentPT);
