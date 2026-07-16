import fs from 'fs';

let content = fs.readFileSync('components/DaftarHadirAdmin.tsx', 'utf8');

content = content.replace(
  "console.error(err);",
  "console.error('PDF Error:', err);"
);

content = content.replace(
  "text: 'Terjadi kesalahan saat membuat PDF'",
  "text: 'Terjadi kesalahan saat membuat PDF: ' + (err instanceof Error ? err.message : String(err))"
);

// Also wrap the logo fetching in try/catch just in case
const logoStr = `if (leftLogoBase64) {`;
const newLogoStr = `try {
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
}`;

content = content.replace(`if (leftLogoBase64) {
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
      }`, newLogoStr);

fs.writeFileSync('components/DaftarHadirAdmin.tsx', content);
