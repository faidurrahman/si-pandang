const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/const result = await response.json\(\);/g, `const resultText = await response.text();\n      let result = {};\n      try { result = JSON.parse(resultText); } catch (e) { result = { status: resultText.includes("Success") ? "Success" : "Error" }; }`);
  fs.writeFileSync(file, content);
}

patchFile('components/FormKehadiran.tsx');
patchFile('components/DaftarHadirAdmin.tsx');
console.log('patched');
