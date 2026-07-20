const fs = require('fs');
let code = fs.readFileSync('GoogleAppsScript.gs', 'utf8');

const oldNoPolisi = `  let noPolisiColIdx = headers.indexOf('Polisi') + 1;
  if (noPolisiColIdx === 0) noPolisiColIdx = headers.indexOf('Nomor Polisi') + 1;
  if (noPolisiColIdx === 0) noPolisiColIdx = 4; // default to 4 if not found`;

const newNoPolisi = `  let noPolisiColIdx = 0;
  for (let c = 0; c < headers.length; c++) {
    let hStr = String(headers[c]).trim().toLowerCase();
    if (hStr === 'polisi' || hStr === 'nomor polisi' || hStr === 'nopol' || hStr === 'plat') {
      noPolisiColIdx = c + 1;
      break;
    }
  }
  if (noPolisiColIdx === 0) noPolisiColIdx = 4; // default to 4 if not found`;
code = code.replace(oldNoPolisi, newNoPolisi);

fs.writeFileSync('GoogleAppsScript.gs', code);
