import fs from 'fs';
let content = fs.readFileSync('components/DaftarHadirAdmin.tsx', 'utf8');

// Replace leftLogoUrl
content = content.replace(
  "const leftLogoUrl = `/api/image-proxy?url=${encodeURIComponent('https://drive.google.com/uc?export=view&id=1dxwhUWW20e4w8BdOcrwaojHbz0GxGOwQ')}`;",
  "const leftLogoUrl = '/logo-pemkot.png';"
);

// Replace rightLogoUrl
content = content.replace(
  "const rightLogoUrl = `/api/image-proxy?url=${encodeURIComponent('https://drive.google.com/uc?export=view&id=1BU0DPMBjVe379MQ7Rczjn3_s4DAEa5L9')}`;",
  "const rightLogoUrl = '/logo-kecamatan.png';"
);

fs.writeFileSync('components/DaftarHadirAdmin.tsx', content);
