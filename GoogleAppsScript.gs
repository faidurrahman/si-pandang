/**
 * BACKEND SI-PANDANG - Digitalisasi Kepegawaian (VERSI STABIL + NOTIFIKASI)
 * Struktur Sheet "Pengajuan":
 * A: Tanggal | B: Nama | C: NIP | D: Layanan | E: Nama File | F: Status | G: URL File | H: ID Pengajuan | I: Pengumuman | J: Is Read
 */

const SHEET_ID = "1PfITx5bKWrTM9m63L8fomxNf5LicNaDJ5tdpHP-C7GA";
const SHEET_NAME = "Pengajuan";
const FOLDER_ID = "1wzYoeJmy95Tm8yAsAyyEx9RwWbDrClp-";

// Fungsi doOptions diperlukan untuk menangani preflight request (CORS) dari browser
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);

    // =====================================================================
    // 1. LOGIKA BARU: Menangani action 'addPegawai', 'deletePegawai', 'updatePegawai'
    // =====================================================================
    if (data.action === 'addPegawai') {
      // Cari sheet KGB (mengatasi kemungkinan ada spasi di nama sheet)
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
        // Jika sheet tidak ada, buat sheet baru dengan header
        sheetKgb = ss.insertSheet('KGB');
        sheetKgb.appendRow(['ID', 'Timestamp', 'Nama', 'NIP', 'Pangkat', 'Jabatan', 'TMT KGB', 'Gaji Pokok', 'URL SK', 'URL KGB']);
      }
      
      // Pastikan sheet memiliki setidaknya 1 baris untuk menghindari error getRange
      if (sheetKgb.getMaxRows() === 0) {
        sheetKgb.insertRows(1, 1);
      }

      // ID Folder Google Drive untuk menyimpan file SK dan KGB (Sesuai permintaan)
      var folderId = '1k7GNGD9kAbn2JjfZV4gJIGLya_WVaKVs'; 
      var folder = DriveApp.getFolderById(folderId);

      var skUrl = '';
      var kgbUrl = '';

      // Proses upload file jika ada (mengubah base64 kembali menjadi file)
      if (data.files && data.files.length > 0) {
        data.files.forEach(function(file) {
          var blob = Utilities.newBlob(Utilities.base64Decode(file.data), file.mimetype, file.filename);
          var uploadedFile = folder.createFile(blob);
          
          // Set permission agar file bisa dilihat oleh siapa saja yang memiliki link
          uploadedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          
          // Pisahkan URL berdasarkan tipe file yang dikirim dari frontend
          if (file.type === 'sk') {
            skUrl = uploadedFile.getUrl();
          } else if (file.type === 'kgb') {
            kgbUrl = uploadedFile.getUrl();
          }
        });
      }

      // Cari baris terakhir yang memiliki data di kolom A (ID)
      var columnA = sheetKgb.getRange('A:A').getValues();
      var lastRow = 0;
      for (var i = columnA.length - 1; i >= 0; i--) {
        if (columnA[i][0] !== "") {
          lastRow = i + 1;
          break;
        }
      }
      var targetRow = lastRow + 1;

      // Pastikan targetRow tidak melebihi jumlah baris maksimum sheet
      if (targetRow > sheetKgb.getMaxRows()) {
        sheetKgb.insertRowAfter(sheetKgb.getMaxRows());
      }

      // Urutan kolom: ID, Timestamp, Nama, NIP, Pangkat, Jabatan, TMT KGB, Gaji Pokok, URL SK, URL KGB
      sheetKgb.getRange(targetRow, 1, 1, 10).setValues([[
        data.id || '',
        data.timestamp || new Date().toISOString(),
        data.nama || '',
        "'" + (data.nip || ''), // Tambahkan petik agar NIP tidak jadi angka scientific
        data.pangkat || '',
        data.jabatan || '',
        data.tmtKgb || '',
        data.gajiPokok || '',
        skUrl,
        kgbUrl
      ]]);

      SpreadsheetApp.flush();

      // Kembalikan respons sukses ke frontend
      return ContentService.createTextOutput("Success Insert KGB").setMimeType(ContentService.MimeType.TEXT);
    }

    if (data.action === 'deletePegawai') {
      var sheets = ss.getSheets();
      var sheetKgb = null;
      for (var s = 0; s < sheets.length; s++) {
        var sName = sheets[s].getName().trim().toUpperCase();
        if (sName === 'KGB') {
          sheetKgb = sheets[s];
          break;
        }
      }
      if (!sheetKgb) return ContentService.createTextOutput("Sheet KGB not found").setMimeType(ContentService.MimeType.TEXT);
      
      var rows = sheetKgb.getDataRange().getValues();
      var idToDelete = data.id;
      var rowIndex = -1;

      // Cari baris berdasarkan ID (Kolom A / index 0)
      for (var i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(idToDelete)) {
          rowIndex = i + 1; // 1-based index
          break;
        }
      }

      if (rowIndex !== -1) {
        sheetKgb.deleteRow(rowIndex);
        SpreadsheetApp.flush();
        return ContentService.createTextOutput("Success Delete KGB").setMimeType(ContentService.MimeType.TEXT);
      } else {
        return ContentService.createTextOutput("ID Not Found").setMimeType(ContentService.MimeType.TEXT);
      }
    }

    if (data.action === 'updatePegawai') {
      var sheets = ss.getSheets();
      var sheetKgb = null;
      for (var s = 0; s < sheets.length; s++) {
        var sName = sheets[s].getName().trim().toUpperCase();
        if (sName === 'KGB') {
          sheetKgb = sheets[s];
          break;
        }
      }
      if (!sheetKgb) return ContentService.createTextOutput("Sheet KGB not found").setMimeType(ContentService.MimeType.TEXT);
      
      var rows = sheetKgb.getDataRange().getValues();
      var idToUpdate = data.id;
      var rowIndex = -1;

      // Cari baris berdasarkan ID (Kolom A / index 0)
      for (var i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(idToUpdate)) {
          rowIndex = i + 1; // 1-based index
          break;
        }
      }

      if (rowIndex !== -1) {
        // ID Folder Google Drive untuk menyimpan file SK dan KGB
        var folderId = '1k7GNGD9kAbn2JjfZV4gJIGLya_WVaKVs'; 
        var folder = DriveApp.getFolderById(folderId);

        var skUrl = '';
        var kgbUrl = '';

        // Proses upload file jika ada
        if (data.files && data.files.length > 0) {
          data.files.forEach(function(file) {
            var blob = Utilities.newBlob(Utilities.base64Decode(file.data), file.mimetype, file.filename);
            var uploadedFile = folder.createFile(blob);
            
            uploadedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            
            if (file.type === 'sk') {
              skUrl = uploadedFile.getUrl();
            } else if (file.type === 'kgb') {
              kgbUrl = uploadedFile.getUrl();
            }
          });
        }

        // Update kolom yang dikirim
        // Urutan kolom: ID(0), Timestamp(1), Nama(2), NIP(3), Pangkat(4), Jabatan(5), TMT KGB(6), Gaji Pokok(7), URL SK(8), URL KGB(9)
        
        if (data.nama) sheetKgb.getRange(rowIndex, 3).setValue(data.nama);
        if (data.nip) sheetKgb.getRange(rowIndex, 4).setValue("'" + data.nip);
        if (data.pangkat) sheetKgb.getRange(rowIndex, 5).setValue(data.pangkat);
        if (data.jabatan) sheetKgb.getRange(rowIndex, 6).setValue(data.jabatan);
        if (data.tmtKgb) sheetKgb.getRange(rowIndex, 7).setValue(data.tmtKgb);
        if (data.gajiPokok) sheetKgb.getRange(rowIndex, 8).setValue(data.gajiPokok);
        if (skUrl) sheetKgb.getRange(rowIndex, 9).setValue(skUrl);
        if (kgbUrl) sheetKgb.getRange(rowIndex, 10).setValue(kgbUrl);
        
        SpreadsheetApp.flush();
        return ContentService.createTextOutput("Success Update KGB").setMimeType(ContentService.MimeType.TEXT);
      } else {
        return ContentService.createTextOutput("ID Not Found").setMimeType(ContentService.MimeType.TEXT);
      }
    }

    // =====================================================================
    // 2. LOGIKA UTAMA: Pengajuan & Notifikasi
    // =====================================================================

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
    
    // --- FITUR NOTIFIKASI (BARU) ---
    if (data.action === 'markAsRead') {
      return handleMarkAsRead(sheet, data);
    }
    if (data.action === 'markAllAsRead') {
      return handleMarkAllAsRead(sheet);
    }
    // -------------------------------
    
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
    let fileUrls = [];
    let filenames = [];
    
    const folder = DriveApp.getFolderById(FOLDER_ID);

    if (data.files && data.files.length > 0) {
      data.files.forEach(f => {
        const blob = Utilities.newBlob(Utilities.base64Decode(f.data), f.mimetype || 'application/octet-stream', f.filename);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrls.push(file.getUrl());
        filenames.push(f.filename);
      });
    } else if (data.file) {
      const blob = Utilities.newBlob(Utilities.base64Decode(data.file), data.mimetype || 'application/octet-stream', data.filename);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      fileUrls.push(file.getUrl());
      filenames.push(data.filename);
    }

    const finalFileUrl = fileUrls.length > 0 ? fileUrls.join('|') : "#";
    const finalFilename = filenames.length > 0 ? filenames.join('|') : "Berkas.pdf";

    // Gunakan ID dari frontend
    const uniqueId = data.id || ("SIP-" + Math.floor(Math.random() * 1000000));

    sheet.appendRow([
      data.timestamp,      // A (0)
      data.nama,           // B (1)
      "'" + data.nip,      // C (2) - Prefiks petik agar teks
      data.layanan,        // D (3)
      finalFilename,       // E (4)
      "Dalam Proses",      // F (5)
      finalFileUrl,        // G (6)
      uniqueId,            // H (7)
      "",                  // I (8) - Kolom Pengumuman
      0                    // J (9) - Is Read (0 = Belum Dibaca)
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

/**
 * Menandai satu notifikasi sebagai sudah dibaca (Kolom J = 1)
 */
function handleMarkAsRead(sheet, data) {
  const rowIndex = findRowById(sheet, data.id);
  if (rowIndex !== -1) {
    // Kolom J adalah kolom ke-10
    sheet.getRange(rowIndex, 10).setValue(1); 
    return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({status: "not found"})).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Menandai SEMUA notifikasi sebagai sudah dibaca (Kolom J = 1)
 */
function handleMarkAllAsRead(sheet) {
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
  
  // Update Kolom J (10) untuk semua baris data (mulai baris 2)
  var range = sheet.getRange(2, 10, rows.length - 1, 1);
  range.setValue(1);
  
  return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Cek parameter action
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
}
