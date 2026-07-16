const fs = require('fs');
const canvas = require('canvas'); // Not available? I'll just write a static valid PNG
const pngHex = "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082";
const buf = Buffer.from(pngHex, 'hex');
fs.writeFileSync('public/logo-pemkot.png', buf);
fs.writeFileSync('public/logo-kecamatan.png', buf);
