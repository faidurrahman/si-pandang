import sys

with open("GoogleAppsScript.gs", "r") as f:
    content = f.read()

# Fix handleUpdateDaftarKendaraan
old_block = """function handleUpdateDaftarKendaraan(sheet, data) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return ContentService.createTextOutput("Empty Sheet").setMimeType(ContentService.MimeType.TEXT);

  // Asumsi Nomor Polisi ada di kolom D (indeks 4, getRange(1, 4, ...))
  // Sesuai dengan sheet DAFTAR KENDARAAN
  // Tapi kita tidak tahu persis struktur kolom, mari kita cari berdasarkan id atau no polisi.
  // Dari frontend, id tampaknya adalah Nomor Polisi (data['Nomor Polisi']).
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const noPolisiColIdx = headers.indexOf('Nomor Polisi') + 1 || 4; // default to 4 if not found
  
  const idRange = sheet.getRange(1, noPolisiColIdx, lastRow, 1).getValues();
  const searchId = String(data['Nomor Polisi']).trim();"""

new_block = """function handleUpdateDaftarKendaraan(sheet, data) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return ContentService.createTextOutput("Empty Sheet").setMimeType(ContentService.MimeType.TEXT);

  // Headers can be on row 1 or 2, usually row 2 based on previous doGet logic.
  // Let's check row 1 and row 2 headers just in case.
  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (!headers.includes('Polisi') && !headers.includes('Nomor Polisi')) {
    headers = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];
  }
  
  let noPolisiColIdx = headers.indexOf('Polisi') + 1;
  if (noPolisiColIdx === 0) noPolisiColIdx = headers.indexOf('Nomor Polisi') + 1;
  if (noPolisiColIdx === 0) noPolisiColIdx = 4; // default to 4 if not found
  
  const idRange = sheet.getRange(1, noPolisiColIdx, lastRow, 1).getValues();
  const rawId = data['Polisi'] || data['Nomor Polisi'] || data.id;
  const searchId = String(rawId).trim();"""

content = content.replace(old_block, new_block)

# Also check if the idRange matching is correct
match_old = """  for (let i = 1; i < idRange.length; i++) {
    if (String(idRange[i][0]).trim() === searchId) {
      rowIndex = i + 1;
      break;
    }
  }"""
  
match_new = """  for (let i = 1; i < idRange.length; i++) {
    if (String(idRange[i][0]).trim() === searchId) {
      rowIndex = i + 1;
      break;
    }
  }
  if (rowIndex === -1) {
    return ContentService.createTextOutput("Error: Kendaraan tidak ditemukan di database dengan Plat: " + searchId).setMimeType(ContentService.MimeType.TEXT);
  }"""

content = content.replace(match_old, match_new)

with open("GoogleAppsScript.gs", "w") as f:
    f.write(content)
