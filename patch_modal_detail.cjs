const fs = require('fs');
let code = fs.readFileSync('components/ModalDetailKendaraan.tsx', 'utf8');

const oldUrlLogic = `  const fotoUrl = data['fotoUrl'] || data['Foto Kendaraan'] || data['Foto'] || '';
  const stnkUrl = data['stnkUrl'] || data['Scan STNK'] || '';
  const bpkbUrl = data['bpkbUrl'] || data['Scan BPKB'] || '';`;

const newUrlLogic = `  // Fungsi pencari properti yang lebih robust
  const findProp = (obj, keywords) => {
    if (!obj) return '';
    for (let key in obj) {
      const k = key.toLowerCase();
      if (keywords.some(kw => k.includes(kw))) {
        if (typeof obj[key] === 'string' && (obj[key].startsWith('http') || obj[key].startsWith('data:'))) {
           return obj[key];
        }
      }
    }
    return '';
  };

  const fotoUrl = data['fotoUrl'] || data['Foto Kendaraan'] || data['Foto'] || findProp(data, ['foto', 'kendaraan']);
  const stnkUrl = data['stnkUrl'] || data['Scan STNK'] || findProp(data, ['stnk']);
  const bpkbUrl = data['bpkbUrl'] || data['Scan BPKB'] || findProp(data, ['bpkb']);`;

code = code.replace(oldUrlLogic, newUrlLogic);

fs.writeFileSync('components/ModalDetailKendaraan.tsx', code);
