const fs = require('fs');
// Let's create a red square PNG so it's visible like their red boxes, maybe?
// Actually just a transparent one, wait, a red one would let them see it works.
const redPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FAADKEws1y1/9AAAAAElFTkSuQmCC";
const buf = Buffer.from(redPngBase64, 'base64');
fs.writeFileSync('public/logo-pemkot.png', buf);
fs.writeFileSync('public/logo-kecamatan.png', buf);
