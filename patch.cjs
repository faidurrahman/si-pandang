const fs = require('fs');
let code = fs.readFileSync('GoogleAppsScript.gs', 'utf8');

// Replace header logic in getDaftarKendaraan
const getHeaderLogicOld = `      let dataValues = sheetKendaraan.getRange(1, 1, lastRow, Math.max(lastColumn, 29)).getValues();
      let headers = dataValues[0];
      let startRow = 1;
      
      if (!headers.includes('Polisi') && !headers.includes('Nomor Polisi')) {
        headers = dataValues[1];
        startRow = 2;
      }`;

const getHeaderLogicNew = `      let dataValues = sheetKendaraan.getRange(1, 1, lastRow, Math.max(lastColumn, 29)).getValues();
      let headers = dataValues[0];
      let startRow = 1;
      
      for (let r = 0; r < Math.min(dataValues.length, 5); r++) {
        let rowStr = dataValues[r].join(" ").toLowerCase();
        if (rowStr.includes("polisi") || rowStr.includes("nomor polisi") || rowStr.includes("bpkb") || rowStr.includes("stnk")) {
          headers = dataValues[r];
          startRow = r + 1;
          break;
        }
      }`;
code = code.replace(getHeaderLogicOld, getHeaderLogicNew);

// Replace header logic in handleUpdateDaftarKendaraan
const updateHeaderLogicOld = `  let headerRow = 1;
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (!headers.includes('Polisi') && !headers.includes('Nomor Polisi')) {
    headers = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];
    headerRow = 2;
  }`;

const updateHeaderLogicNew = `  let headerRow = 1;
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  let checkRows = sheet.getRange(1, 1, Math.min(lastRow, 5), sheet.getLastColumn()).getValues();
  for (let r = 0; r < checkRows.length; r++) {
    let rowStr = checkRows[r].join(" ").toLowerCase();
    if (rowStr.includes("polisi") || rowStr.includes("nomor polisi") || rowStr.includes("bpkb") || rowStr.includes("stnk")) {
      headers = checkRows[r];
      headerRow = r + 1;
      break;
    }
  }`;
code = code.replace(updateHeaderLogicOld, updateHeaderLogicNew);

fs.writeFileSync('GoogleAppsScript.gs', code);
