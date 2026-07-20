const fs = require('fs');
let code = fs.readFileSync('components/ModalEditKendaraan.tsx', 'utf8');

const oldFotoLogic = "formData['Foto'] && !formData.fotoKendaraanBase64";
const newFotoLogic = "(formData['fotoUrl'] || formData['Foto Kendaraan'] || formData['Foto']) && !formData.fotoKendaraanBase64";

const oldFotoHref = "href={formData['Foto']}";
const newFotoHref = "href={formData['fotoUrl'] || formData['Foto Kendaraan'] || formData['Foto']}";

const oldStnkLogic = "formData['Scan STNK'] && !formData.stnkBase64";
const newStnkLogic = "(formData['stnkUrl'] || formData['Scan STNK']) && !formData.stnkBase64";

const oldStnkHref = "href={formData['Scan STNK']}";
const newStnkHref = "href={formData['stnkUrl'] || formData['Scan STNK']}";

const oldBpkbLogic = "formData['Scan BPKB'] && !formData.bpkbBase64";
const newBpkbLogic = "(formData['bpkbUrl'] || formData['Scan BPKB']) && !formData.bpkbBase64";

const oldBpkbHref = "href={formData['Scan BPKB']}";
const newBpkbHref = "href={formData['bpkbUrl'] || formData['Scan BPKB']}";

code = code.replace(oldFotoLogic, newFotoLogic).replace(oldFotoHref, newFotoHref);
code = code.replace(oldStnkLogic, newStnkLogic).replace(oldStnkHref, newStnkHref);
code = code.replace(oldBpkbLogic, newBpkbLogic).replace(oldBpkbHref, newBpkbHref);

fs.writeFileSync('components/ModalEditKendaraan.tsx', code);
