import fs from 'fs';
let content = fs.readFileSync('components/DaftarHadirAdmin.tsx', 'utf8');

const newLogoStr = `try {
      if (leftLogoBase64) {
        const leftProps = doc.getImageProperties(leftLogoBase64);
        const leftWidth = 18;
        const leftHeight = (leftProps.height * leftWidth) / leftProps.width;
        let lFormat = 'PNG';
        if (leftLogoBase64.startsWith('data:image/jpeg')) lFormat = 'JPEG';
        doc.addImage(leftLogoBase64, lFormat, 14, logoY, leftWidth, leftHeight);
      }
      if (rightLogoBase64) {
        const rightProps = doc.getImageProperties(rightLogoBase64);
        const rightWidth = 18;
        const rightHeight = (rightProps.height * rightWidth) / rightProps.width;
        let rFormat = 'PNG';
        if (rightLogoBase64.startsWith('data:image/jpeg')) rFormat = 'JPEG';
        doc.addImage(rightLogoBase64, rFormat, pageWidth - 14 - rightWidth, logoY, rightWidth, rightHeight);
      }
} catch(err) {
  console.error("Error drawing logos", err);
}`;

content = content.replace(`try {
      if (leftLogoBase64) {
        const leftProps = doc.getImageProperties(leftLogoBase64);
        const leftWidth = 18;
        const leftHeight = (leftProps.height * leftWidth) / leftProps.width;
        doc.addImage(leftLogoBase64, 'PNG', 14, logoY, leftWidth, leftHeight);
      }
      if (rightLogoBase64) {
        const rightProps = doc.getImageProperties(rightLogoBase64);
        const rightWidth = 18;
        const rightHeight = (rightProps.height * rightWidth) / rightProps.width;
        doc.addImage(rightLogoBase64, 'PNG', pageWidth - 14 - rightWidth, logoY, rightWidth, rightHeight);
      }
} catch(err) {
  console.error("Error drawing logos", err);
}`, newLogoStr);

fs.writeFileSync('components/DaftarHadirAdmin.tsx', content);
