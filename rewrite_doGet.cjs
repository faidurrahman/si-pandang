const fs = require('fs');
let code = fs.readFileSync('GoogleAppsScript.gs', 'utf8');

const newDoGet = `function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Cek parameter action untuk Daftar Pegawai
    if (e.parameter && e.parameter.action === 'getDaftarPegawai') {
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

    // Cek parameter action KGB
    if (e.parameter && e.parameter.action === 'getKGB') {
      var sheets = ss.getSheets();
      var sheetKgb = null;
      for (var s = 0; s < sheets.length; s++) {
        var sName = sheets[s].getName().trim().toUpperCase();
        if (sName === 'KGB') {
          sheetKgb = sheets[s];
          break;
        }
      }
      if (!sheetKgb) {
        return ContentService.createTextOutput(JSON.stringify({ data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const data = sheetKgb.getDataRange().getValues();
      return ContentService.createTextOutput(JSON.stringify({ data: data }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default: Ambil data Pengajuan
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const data = sheet.getDataRange().getValues();
    return ContentService.createTextOutput(JSON.stringify({ data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

const doGethdr = 'function doGet(e) {';
const nextFn = 'function handleUpdateDaftarPegawai';
if (code.includes(doGethdr) && code.includes(nextFn)) {
  const start = code.indexOf(doGethdr);
  const end = code.indexOf(nextFn);
  code = code.substring(0, start) + newDoGet + "\\n\\n" + code.substring(end);
  fs.writeFileSync('GoogleAppsScript.gs', code);
  console.log("Success replacing doGet");
} else {
  console.log("Could not find delimiters");
}
