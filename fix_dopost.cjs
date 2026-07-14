const fs = require('fs');
let code = fs.readFileSync('GoogleAppsScript.gs', 'utf8');

const strToRemove = `      if (e.parameter.action === 'getDaftarPegawai') {
        var sheetDaftar = null;
        for (var s = 0; s < sheets.length; s++) {
          var sName = sheets[s].getName().trim().toUpperCase();
          if (sName === 'DAFTAR PEGAWAI') {
            sheetDaftar = sheets[s];
            break;
          }
        }
        if (!sheetDaftar) {
          return ContentService.createTextOutput(JSON.stringify({ data: [] }))
            .setMimeType(ContentService.MimeType.JSON);
        }
        const data = sheetDaftar.getDataRange().getValues();
        return ContentService.createTextOutput(JSON.stringify({ data: data }))
          .setMimeType(ContentService.MimeType.JSON);
      }`;

if (code.includes(strToRemove)) {
  code = code.replace(strToRemove, "");
  fs.writeFileSync('GoogleAppsScript.gs', code);
  console.log("Success removed from doPost");
} else {
  // Let's try matching with regex to ignore exact whitespace
  let codeClean = code;
  const regex = /if\s*\(e\.parameter\.action\s*===\s*'getDaftarPegawai'\)\s*\{[\s\S]*?\.setMimeType\(ContentService\.MimeType\.JSON\);\s*\}/;
  if (regex.test(code)) {
    code = code.replace(regex, "");
    fs.writeFileSync('GoogleAppsScript.gs', code);
    console.log("Success removed from doPost using regex");
  } else {
    console.log("Could not find string to remove");
  }
}
