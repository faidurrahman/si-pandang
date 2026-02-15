/**
 * BACKEND SI-PANDANG - Digitalisasi Kepegawaian (VERSI STABIL)
 * Struktur Sheet "Pengajuan":
 * A: Tanggal | B: Nama | C: NIP | D: Layanan | E: Nama File | F: Status | G: URL File | H: ID Pengajuan | I: Pengumuman
 */

const SHEET_ID = "1PfITx5bKWrTM9m63L8fomxNf5LicNaDJ5tdpHP-C7GA";
const SHEET_NAME = "Pengajuan";
const FOLDER_NAME = "SI-PANDANG_BERKAS";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return ContentService.createTextOutput("Error: Sheet '" + SHEET_NAME + "' tidak ditemukan").setMimeType(ContentService.MimeType.TEXT);
    }

    // Routing aksi berdasarkan parameter 'action'
    if (data.action === 'updateData') {
      return handleUpdateFullData(sheet, data);
    }
    if (data.action === 'updateStatus') {
      return handleUpdateStatusOnly(sheet, data);
    }
    
    // Default: Simpan Pengajuan Baru
    return handleInsertNewSubmission(sheet, data);

  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * MENCARI NOMOR BARIS BERDASARKAN ID PENGAJUAN (Kolom H / Kolom ke-8)
 */
function findRowById(sheet, idToFind) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  
  // Ambil data di kolom H saja untuk performa pencarian
  const idRange = sheet.getRange(1, 8, lastRow, 1).getValues();
  const searchId = String(idToFind).trim().toUpperCase();
  
  for (let i = 1; i < idRange.length; i++) {
    const rowId = String(idRange[i][0]).trim().toUpperCase();
    if (rowId === searchId) {
      return i + 1; // Baris ditemukan (indeks 1-based)
    }
  }
  return -1;
}

/**
 * Menyimpan data pengajuan baru ke baris terakhir
 */
function handleInsertNewSubmission(sheet, data) {
  try {
    let fileUrl = "#";
    
    if (data.file) {
      const folder = getOrCreateFolder(FOLDER_NAME);
      const blob = Utilities.newBlob(Utilities.base64Decode(data.file), data.mimetype || 'application/octet-stream', data.filename);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrl = file.getUrl();
    }

    // Gunakan ID dari frontend
    const uniqueId = data.id || ("SIP-" + Math.floor(Math.random() * 1000000));

    sheet.appendRow([
      data.timestamp,      // A (0)
      data.nama,           // B (1)
      "'" + data.nip,      // C (2) - Prefiks petik agar teks
      data.layanan,        // D (3)
      data.filename,       // E (4)
      "Dalam Proses",      // F (5)
      fileUrl,             // G (6)
      uniqueId,            // H (7)
      ""                   // I (8) - Kolom Pengumuman (kosong saat awal)
    ]);

    SpreadsheetApp.flush();
    return ContentService.createTextOutput("Success Insert").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error insert: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Memperbarui data lengkap berdasarkan ID Pengajuan (Kolom H)
 * Logika kolom Pengumuman (Kolom I) ditambahkan agar terbaca di papan pengumuman.
 */
function handleUpdateFullData(sheet, data) {
  const rowIndex = findRowById(sheet, data.id);

  if (rowIndex !== -1) {
    sheet.getRange(rowIndex, 2).setValue(data.nama);               // B
    sheet.getRange(rowIndex, 3).setValue("'" + data.nip);          // C
    sheet.getRange(rowIndex, 4).setValue(data.layanan);            // D
    sheet.getRange(rowIndex, 6).setValue(data.status);             // F
    sheet.getRange(rowIndex, 9).setValue(data.pengumuman || "");   // I: Pengumuman
    
    SpreadsheetApp.flush();
    return ContentService.createTextOutput("Data Updated").setMimeType(ContentService.MimeType.TEXT);
  }
  return ContentService.createTextOutput("ID Not Found").setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Memperbarui Status saja berdasarkan ID Pengajuan (Kolom H)
 */
function handleUpdateStatusOnly(sheet, data) {
  const rowIndex = findRowById(sheet, data.id);

  if (rowIndex !== -1) {
    sheet.getRange(rowIndex, 6).setValue(data.status); // F
    SpreadsheetApp.flush();
    return ContentService.createTextOutput("Status Updated").setMimeType(ContentService.MimeType.TEXT);
  }
  return ContentService.createTextOutput("ID Not Found").setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

function doGet(e) {
  return ContentService.createTextOutput("SI-PANDANG API is Active. Use POST for transactions.").setMimeType(ContentService.MimeType.TEXT);
}