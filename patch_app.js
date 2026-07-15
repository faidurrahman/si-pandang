const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf-8');

content = content.replace(
  "import { DaftarHadirPage } from './components/DaftarHadirPage';",
  "import { DaftarHadirAdmin } from './components/DaftarHadirAdmin';\nimport { FormKehadiran } from './components/FormKehadiran';"
);

// We should replace `<DaftarHadirPage />` with `<DaftarHadirAdmin />`
content = content.replace(
  ") : activeTab === 'daftar-hadir' ? (\n          <DaftarHadirPage />\n        )",
  ") : activeTab === 'daftar-hadir' ? (\n          <DaftarHadirAdmin />\n        )"
);
content = content.replace(
  ") : activeTab === 'daftar-hadir' ? (\n          <DaftarHadirPage />\n        )", // maybe spacing is different, let's use regex
  "xxx"
);

fs.writeFileSync('App.tsx', content);
console.log('patched app');
