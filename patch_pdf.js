import fs from 'fs';

let content = fs.readFileSync('components/DaftarHadirAdmin.tsx', 'utf8');

// 1. Add state isGeneratingPdf
content = content.replace(
  "const [selectedRekapKegiatan, setSelectedRekapKegiatan] = useState<any>(null);",
  "const [selectedRekapKegiatan, setSelectedRekapKegiatan] = useState<any>(null);\n  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);"
);

// 2. Replace getBase64ImageFromUrl with urlToBase64
const urlToBase64Impl = `const urlToBase64 = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error fetching image:", url, error);
      return null;
    }
  };\n`;

const startIdx = content.indexOf('const getBase64ImageFromUrl =');
const endStr = 'img.src = url;\n    });\n  };\n';
const endIdx = content.indexOf(endStr, startIdx) + endStr.length;
content = content.substring(0, startIdx) + urlToBase64Impl + content.substring(endIdx);

fs.writeFileSync('components/DaftarHadirAdmin.tsx', content);
