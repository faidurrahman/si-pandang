import fs from 'fs';
let content = fs.readFileSync('components/DaftarHadirAdmin.tsx', 'utf8');
content = content.replace(
  "  const getDriveImageUrl = (url: string) => {",
  `  const getDirectDriveLink = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:image')) return url;
    const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\\/d\\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return \`https://drive.google.com/uc?export=view&id=\${match[1]}\`;
    }
    return url;
  };
  
  const getDriveImageUrl = (url: string) => {`
);
// replace getDriveImageUrl in img src
content = content.replace(/<img src=\{getDriveImageUrl\(k\.ttd\)\} alt="ttd" className="h-12 object-contain mx-auto" referrerPolicy="no-referrer" \/>/g, 
  '<img src={getDirectDriveLink(k.ttd)} alt="ttd" className="h-10 object-contain mx-auto" referrerPolicy="no-referrer" />');
// replace in getBase64ImageFromUrl(getDriveImageUrl(ttdUrl))
content = content.replace(/getBase64ImageFromUrl\(getDriveImageUrl\(ttdUrl\)\)/g, 'getBase64ImageFromUrl(getDirectDriveLink(ttdUrl))');

fs.writeFileSync('components/DaftarHadirAdmin.tsx', content);
