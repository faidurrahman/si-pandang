import fs from 'fs';

let content = fs.readFileSync('components/DaftarHadirAdmin.tsx', 'utf8');

const ttdOld = `      const enrichedKehadirans = await Promise.all(filteredKehadirans.map(async (k) => {
        let ttdBase64 = null;
        if (k.ttd) {
           const fileId = k.ttd.split('id=')[1];
           if (fileId) {
             const driveThumbUrl = \`https://drive.google.com/thumbnail?id=\${fileId}&sz=w200\`;
             const thumbUrl = \`/api/image-proxy?url=\${encodeURIComponent(driveThumbUrl)}\`;
             ttdBase64 = await urlToBase64(thumbUrl);
           }
        }
        return {
          ...k,
          ttdBase64
        };
      }));`;

const ttdNew = `      const enrichedKehadirans = await Promise.all(filteredKehadirans.map(async (k) => {
        let ttdBase64 = null;
        if (k.ttd) {
           const processedUrl = getDriveImageUrl(k.ttd);
           if (processedUrl.startsWith('data:image')) {
             ttdBase64 = processedUrl;
           } else {
             ttdBase64 = await urlToBase64(processedUrl);
           }
        }
        return {
          ...k,
          ttdBase64
        };
      }));`;

content = content.replace(ttdOld, ttdNew);

fs.writeFileSync('components/DaftarHadirAdmin.tsx', content);
