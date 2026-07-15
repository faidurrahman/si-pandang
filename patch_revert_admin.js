import fs from 'fs';
let content = fs.readFileSync('components/DaftarHadirAdmin.tsx', 'utf8');

content = content.replace(
  "const leftLogoUrl = '/logo-pemkot.png';",
  "const leftLogoUrl = `/api/image-proxy?url=${encodeURIComponent('https://drive.google.com/uc?export=view&id=1dxwhUWW20e4w8BdOcrwaojHbz0GxGOwQ')}`;"
);

content = content.replace(
  "const rightLogoUrl = '/logo-kecamatan.png';",
  "const rightLogoUrl = `/api/image-proxy?url=${encodeURIComponent('https://drive.google.com/uc?export=view&id=1BU0DPMBjVe379MQ7Rczjn3_s4DAEa5L9')}`;"
);

content = content.replace(
  `  const getDirectDriveLink = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:image')) return url;
    const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\\/d\\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return \`https://drive.google.com/uc?export=view&id=\${match[1]}\`;
    }
    return url;
  };
  
  const getDriveImageUrl = (url: string) => {`,
  "  const getDriveImageUrl = (url: string) => {"
);

content = content.replace(/<img src=\{getDirectDriveLink\(k\.ttd\)\} alt="ttd" className="h-10 object-contain mx-auto" referrerPolicy="no-referrer" \/>/g, 
  '<img src={getDriveImageUrl(k.ttd)} alt="ttd" className="h-12 object-contain mx-auto" referrerPolicy="no-referrer" />');

content = content.replace(/getBase64ImageFromUrl\(getDirectDriveLink\(ttdUrl\)\)/g, 'getBase64ImageFromUrl(getDriveImageUrl(ttdUrl))');

fs.writeFileSync('components/DaftarHadirAdmin.tsx', content);
