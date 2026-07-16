import fs from 'fs';
let content = fs.readFileSync('components/DaftarHadirAdmin.tsx', 'utf8');

const oldDrawCell = `                doc.addImage(
                  ttdBase64,
                  'PNG',
                  xOffset,
                  yOffset,
                  imgWidth,
                  imgHeight
                );`;
                
const newDrawCell = `                let format = 'PNG';
                if (ttdBase64.startsWith('data:image/jpeg')) format = 'JPEG';
                else if (ttdBase64.startsWith('data:image/png')) format = 'PNG';
                else if (ttdBase64.startsWith('data:image/webp')) format = 'WEBP';
                
                doc.addImage(
                  ttdBase64,
                  format,
                  xOffset,
                  yOffset,
                  imgWidth,
                  imgHeight
                );`;

content = content.replace(oldDrawCell, newDrawCell);
fs.writeFileSync('components/DaftarHadirAdmin.tsx', content);
