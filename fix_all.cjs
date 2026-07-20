// I will patch the implicit any in ModalDetailKendaraan.tsx just in case
const fs = require('fs');
let code = fs.readFileSync('components/ModalDetailKendaraan.tsx', 'utf8');
code = code.replace("const findProp = (obj, keywords) => {", "const findProp = (obj: any, keywords: string[]) => {");
fs.writeFileSync('components/ModalDetailKendaraan.tsx', code);
