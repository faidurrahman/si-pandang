const fs = require('fs');
let code = fs.readFileSync('GoogleAppsScript.gs', 'utf8');

// The replacement I did earlier messed up the if block. Let's fix it.
code = code.replace(
  `      if (e.parameter.action === 'getDaftarPegawai') {
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
      }

      if (!sheetKgb) {`, 
      `      if (!sheetKgb) {`
);

// Now insert getDaftarPegawai correctly
code = code.replace(
  `    if (e.parameter && e.parameter.action === 'getKGB') {`,
  `    if (e.parameter && e.parameter.action === 'getDaftarPegawai') {
      var sheets = ss.getSheets();
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
    }
    
    if (e.parameter && e.parameter.action === 'getKGB') {`
);

fs.writeFileSync('GoogleAppsScript.gs', code);
