const fs = require('fs');
let code = fs.readFileSync('GoogleAppsScript.gs', 'utf8');

if (!code.includes("getDaftarPegawai")) {
  code = code.replace(
    /if \(e.parameter && e.parameter.action === 'getKGB'\) \{/,
    `if (e.parameter && e.parameter.action === 'getDaftarPegawai') {
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
  
  code = code.replace(
    /if \(data.action === 'updateStatusOnly'\) \{/,
    `if (data.action === 'updateDaftarPegawai') {
      var sheets = ss.getSheets();
      var sheetDaftar = null;
      for (var s = 0; s < sheets.length; s++) {
        if (sheets[s].getName().trim().toUpperCase() === 'DAFTAR PEGAWAI') {
          sheetDaftar = sheets[s];
          break;
        }
      }
      if (sheetDaftar) {
        return handleUpdateDaftarPegawai(sheetDaftar, data);
      } else {
        return ContentService.createTextOutput("Sheet Daftar Pegawai not found").setMimeType(ContentService.MimeType.TEXT);
      }
    }

    if (data.action === 'updateStatusOnly') {`
  );
}

fs.writeFileSync('GoogleAppsScript.gs', code);
