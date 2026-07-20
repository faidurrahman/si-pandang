const fs = require('fs');

let content = fs.readFileSync('GoogleAppsScript.gs', 'utf8');

const regex = /function handleUpdateDaftarKendaraan\(sheet, data\) \{[\s\S]*?(?=if \(rowIndex === -1\))/;

const newBlock = `function handleUpdateDaftarKendaraan(sheet, data) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return ContentService.createTextOutput("Empty Sheet").setMimeType(ContentService.MimeType.TEXT);

  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (!headers.includes('Polisi') && !headers.includes('Nomor Polisi')) {
    headers = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];
  }
  
  let noPolisiColIdx = headers.indexOf('Polisi') + 1;
  if (noPolisiColIdx === 0) noPolisiColIdx = headers.indexOf('Nomor Polisi') + 1;
  if (noPolisiColIdx === 0) noPolisiColIdx = 4; // default to 4 if not found
  
  const idRange = sheet.getRange(1, noPolisiColIdx, lastRow, 1).getValues();
  const rawId = data['Polisi'] || data['Nomor Polisi'] || data.id;
  const searchId = String(rawId).trim();
  let rowIndex = -1;

  for (let i = 1; i < idRange.length; i++) {
    if (String(idRange[i][0]).trim() === searchId) {
      rowIndex = i + 1;
      break;
    }
  }
  `;

content = content.replace(regex, newBlock);
fs.writeFileSync('GoogleAppsScript.gs', content);
