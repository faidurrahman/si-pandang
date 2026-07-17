/**
 * Google Apps Script untuk Daftar Kendaraan SI-PANDANG
 * 
 * 1. Buka Google Sheets Anda.
 * 2. Klik Ekstensi > Apps Script.
 * 3. Hapus semua kode default (function myFunction) dan paste kode di bawah ini.
 * 4. Simpan, lalu klik "Terapkan" (Deploy) > "Penerapan Baru" (New Deployment).
 * 5. Pilih jenis: "Aplikasi Web" (Web App).
 * 6. Set Akses: "Siapa saja" (Anyone).
 * 7. Klik "Terapkan" dan berikan izin otorisasi jika diminta.
 * 8. Copy "URL Aplikasi Web" dan gunakan di aplikasi React Anda.
 */

function doGet(e) {
  var sheetName = "DaftarKendaraan"; // Nama tab sheet Anda
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet " + sheetName + " tidak ditemukan!" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  
  // Data dimulai dari baris ke-9, jadi jika lastRow kurang dari 9 berarti belum ada data
  if (lastRow < 9) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Header ada di baris ke-7
  var headers = sheet.getRange(7, 1, 1, lastColumn).getValues()[0];
  
  // Ambil semua data mulai dari baris ke-9
  var numRows = lastRow - 8;
  var dataValues = sheet.getRange(9, 1, numRows, lastColumn).getValues();
  
  var data = [];
  
  for (var i = 0; i < dataValues.length; i++) {
    var row = dataValues[i];
    var rowObject = {};
    
    // Cek apakah baris ini kosong (misal berdasarkan kolom pertama 'Polisi')
    if (row[0] === "" && row[1] === "") {
      continue; // Lewati baris kosong
    }
    
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      
      // Jika header tidak kosong, tambahkan ke object
      if (header !== "") {
        var cellValue = row[j];
        
        // Menangani format tanggal agar jadi string yang rapi di JSON
        if (cellValue instanceof Date) {
          // Format sesuai zona waktu script (default Asia/Jakarta jika diatur)
          cellValue = Utilities.formatDate(cellValue, Session.getScriptTimeZone(), "dd MMM yyyy");
        }
        
        rowObject[header] = cellValue;
      }
    }
    
    data.push(rowObject);
  }
  
  // ContentService Apps Script otomatis mengizinkan request cross-origin (CORS) ketika dipanggil via fetch dengan follow redirects
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
