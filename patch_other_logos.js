import fs from 'fs';
let contentApp = fs.readFileSync('App.tsx', 'utf8');
contentApp = contentApp.replace(
  'src="https://lh3.googleusercontent.com/d/1BU0DPMBjVe379MQ7Rczjn3_s4DAEa5L9"',
  'src="/logo-kecamatan.png"'
);
contentApp = contentApp.replace(
  'src="https://lh3.googleusercontent.com/d/1dxwhUWW20e4w8BdOcrwaojHbz0GxGOwQ"',
  'src="/logo-pemkot.png"'
);
fs.writeFileSync('App.tsx', contentApp);

let contentPT = fs.readFileSync('components/PageTransition.tsx', 'utf8');
contentPT = contentPT.replace(
  'src="https://lh3.googleusercontent.com/d/1BU0DPMBjVe379MQ7Rczjn3_s4DAEa5L9"',
  'src="/logo-kecamatan.png"'
);
fs.writeFileSync('components/PageTransition.tsx', contentPT);
