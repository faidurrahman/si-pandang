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
    
    // -------------------------------------------------------------
    // LOGIKA DAFTAR HADIR & KEGIATAN
    // -------------------------------------------------------------
    if (data.action === 'addDataKegiatan') {
      let sheetDataKegiatan = ss.getSheetByName('Data_Kegiatan');
      if (!sheetDataKegiatan) {
        sheetDataKegiatan = ss.insertSheet('Data_Kegiatan');
        sheetDataKegiatan.appendRow(['id_kegiatan', 'nama_kegiatan', 'hari_tanggal', 'waktu', 'tempat']);
      }
      
      let idKegiatan = data.id_kegiatan || Utilities.getUuid();
      
      sheetDataKegiatan.appendRow([
        idKegiatan,
        data.nama_kegiatan || '',
        data.hari_tanggal || '',
        data.waktu || '',
        data.tempat || ''
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "Success", id_kegiatan: idKegiatan }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === 'addDaftarHadir') {
      let sheetDaftarHadir = ss.getSheetByName('Daftar_Hadir');
      if (!sheetDaftarHadir) {
        sheetDaftarHadir = ss.insertSheet('Daftar_Hadir');
        sheetDaftarHadir.appendRow(['timestamp', 'id_kegiatan', 'nama_lengkap', 'instansi', 'gender', 'no_hp', 'email', 'ttd_digital']);
      }
      
      // Upload TTD ke Google Drive
      let ttdUrl = '';
      if (data.ttd_digital) {
        try {
          let driveFolder = DriveApp.getFolderById(FOLDER_ID);
          let namaFile = 'TTD_' + (data.nama_lengkap || 'Unknown') + '_' + new Date().getTime() + '.png';
          let blob = Utilities.newBlob(Utilities.base64Decode(data.ttd_digital), 'image/png', namaFile);
          let uploadedFile = driveFolder.createFile(blob);
          uploadedFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          ttdUrl = uploadedFile.getUrl();
        } catch (e) {
          ttdUrl = 'Gagal upload TTD: ' + e.toString();
        }
      }
      
      sheetDaftarHadir.appendRow([
        new Date().toISOString(),
        data.id_kegiatan || '',
        data.nama_lengkap || '',
        data.instansi || '',
        data.gender || '',
        "'" + (data.no_hp || ''),
        data.email || '',
        ttdUrl || '' // URL file dari Google Drive
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "Success" }))
        .setMimeType(ContentService.MimeType.JSON);
    }


    if (data.action === 'updateDaftarKendaraan') {
      let sheets = ss.getSheets();
      let sheetKendaraan = null;
      for (let s = 0; s < sheets.length; s++) {
        let sName = sheets[s].getName().trim().toUpperCase();
        if (sName === 'DAFTAR KENDARAAN') {
          sheetKendaraan = sheets[s];
          break;
        }
      }
      if (sheetKendaraan) {
        return handleUpdateDaftarKendaraan(sheetKendaraan, data);
      } else {
        return ContentService.createTextOutput("Sheet Daftar Kendaraan not found").setMimeType(ContentService.MimeType.TEXT);
      }
    }

    if (data.action === 'updateDaftarPegawai') {
      let sheets = ss.getSheets();
      let sheetDaftar = null;
      for (let s = 0; s < sheets.length; s++) {
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
    
    if (data.action === 'addPegawai') {
      // Cari sheet KGB (mengatasi kemungkinan ada spasi di nama sheet)
      let sheets = ss.getSheets();
      let sheetKgb = null;
      for (let s = 0; s < sheets.length; s++) {
        let sName = sheets[s].getName().trim().toUpperCase();
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
      let driveFolderId = '1k7GNGD9kAbn2JjfZV4gJIGLya_WVaKVs'; 
      let driveFolder = DriveApp.getFolderById(folderId);

      let skUrl = '';
      let kgbUrl = '';

      // Proses upload file jika ada (mengubah base64 kembali menjadi file)
      if (data.files && data.files.length > 0) {
        data.files.forEach(function(file) {
          let blob = Utilities.newBlob(Utilities.base64Decode(file.data), file.mimetype, file.filename);
          let uploadedFile = driveFolder.createFile(blob);
          
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
      let columnA = sheetKgb.getRange('A:A').getValues();
      let lastRow = 0;
      for (let i = columnA.length - 1; i >= 0; i--) {
        if (columnA[i][0] !== "") {
          lastRow = i + 1;
          break;
        }
      }
      let targetRow = lastRow + 1;

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
      let sheets = ss.getSheets();
      let sheetKgb = null;
      for (let s = 0; s < sheets.length; s++) {
        let sName = sheets[s].getName().trim().toUpperCase();
        if (sName === 'KGB') {
          sheetKgb = sheets[s];
          break;
        }
      }
      if (!sheetKgb) return ContentService.createTextOutput("Sheet KGB not found").setMimeType(ContentService.MimeType.TEXT);
      
      let rows = sheetKgb.getDataRange().getValues();
      let idToDelete = data.id;
      let rowIndex = -1;

      // Cari baris berdasarkan ID (Kolom A / index 0)
      for (let i = 1; i < rows.length; i++) {
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
      let sheets = ss.getSheets();
      let sheetKgb = null;
      for (let s = 0; s < sheets.length; s++) {
        let sName = sheets[s].getName().trim().toUpperCase();
        if (sName === 'KGB') {
          sheetKgb = sheets[s];
          break;
        }
      }
      if (!sheetKgb) return ContentService.createTextOutput("Sheet KGB not found").setMimeType(ContentService.MimeType.TEXT);
      
      let rows = sheetKgb.getDataRange().getValues();
      let idToUpdate = data.id;
      let rowIndex = -1;

      // Cari baris berdasarkan ID (Kolom A / index 0)
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][0]) === String(idToUpdate)) {
          rowIndex = i + 1; // 1-based index
          break;
        }
      }

      if (rowIndex !== -1) {
        // ID Folder Google Drive untuk menyimpan file SK dan KGB
        let driveFolderId = '1k7GNGD9kAbn2JjfZV4gJIGLya_WVaKVs'; 
        let driveFolder = DriveApp.getFolderById(folderId);

        let skUrl = '';
        let kgbUrl = '';

        // Proses upload file jika ada
        if (data.files && data.files.length > 0) {
          data.files.forEach(function(file) {
            let blob = Utilities.newBlob(Utilities.base64Decode(file.data), file.mimetype, file.filename);
            let uploadedFile = driveFolder.createFile(blob);
            
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
    
    const driveFolder = DriveApp.getFolderById(FOLDER_ID);

    if (data.files && data.files.length > 0) {
      data.files.forEach(f => {
        const blob = Utilities.newBlob(Utilities.base64Decode(f.data), f.mimetype || 'application/octet-stream', f.filename);
        const file = driveFolder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        fileUrls.push(file.getUrl());
        filenames.push(f.filename);
      });
    } else if (data.file) {
      const blob = Utilities.newBlob(Utilities.base64Decode(data.file), data.mimetype || 'application/octet-stream', data.filename);
      const file = driveFolder.createFile(blob);
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
  let rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
  
  // Update Kolom J (10) untuk semua baris data (mulai baris 2)
  let range = sheet.getRange(2, 10, rows.length - 1, 1);
  range.setValue(1);
  
  return ContentService.createTextOutput(JSON.stringify({status: "success"})).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    // Cek parameter action untuk Daftar Pegawai
    if (e.parameter && e.parameter.action === 'getDaftarPegawai') {
      let sheets = ss.getSheets();
      let sheetDaftar = null;
      for (let s = 0; s < sheets.length; s++) {
        let sName = sheets[s].getName().trim().toUpperCase();
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
      let sheets = ss.getSheets();
      let sheetKgb = null;
      for (let s = 0; s < sheets.length; s++) {
        let sName = sheets[s].getName().trim().toUpperCase();
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
    
    

    if (e.parameter && e.parameter.action === 'getDaftarKendaraan') {
      let sheets = ss.getSheets();
      let sheetKendaraan = null;
      for (let s = 0; s < sheets.length; s++) {
        let sName = sheets[s].getName().trim().toUpperCase();
        if (sName === 'DAFTAR KENDARAAN') {
          sheetKendaraan = sheets[s];
          break;
        }
      }
      if (!sheetKendaraan) {
        return ContentService.createTextOutput(JSON.stringify({ data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      let lastRow = sheetKendaraan.getLastRow();
      let lastColumn = sheetKendaraan.getLastColumn();
      if (lastRow < 2) {
        return ContentService.createTextOutput(JSON.stringify({ data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Ambil Header (Asumsi header di baris 1, atau baris 2).
      // Untuk aman, mari kita ambil semua data
      // Namun, jika "Kolom AC adalah index 28 (0-indexed)", berarti minimal ada 29 kolom.
      // Kita perlu pastikan Math.max(lastColumn, 29) digunakan saat getValues
      
      let dataValues = sheetKendaraan.getRange(1, 1, lastRow, Math.max(lastColumn, 29)).getValues();
      let headers = dataValues[0];
      let startRow = 1;
      
      for (let r = 0; r < Math.min(dataValues.length, 5); r++) {
        let rowStr = dataValues[r].join(" ").toLowerCase();
        if (rowStr.includes("polisi") || rowStr.includes("nomor polisi") || rowStr.includes("bpkb") || rowStr.includes("stnk")) {
          headers = dataValues[r];
          startRow = r + 1;
          break;
        }
      }
      
      let items = [];
      
      for (let i = startRow; i < dataValues.length; i++) {
        let row = dataValues[i];
        let obj = {};
        for (let c = 0; c < headers.length; c++) {
          let key = headers[c] ? String(headers[c]).trim() : '';
            if (key) {
              obj[key] = row[c];
            }
          }
          
          // Tangani kolom AC (index 28) = "Jatuh Tempo Plat"
          let tglPlat = row[28];
          if (tglPlat instanceof Date) {
            tglPlat = Utilities.formatDate(tglPlat, Session.getScriptTimeZone(), "dd MMM yyyy");
          } else {
            tglPlat = tglPlat ? String(tglPlat).trim() : "";
          }
          obj['Jatuh Tempo Plat'] = tglPlat;
          
          items.push(obj);
        }
      
      return ContentService.createTextOutput(JSON.stringify({ data: items }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Cek parameter action untuk Daftar Hadir
    if (e.parameter && e.parameter.action === 'getDataKegiatan') {
      let sheetDataKegiatan = ss.getSheetByName('Data_Kegiatan');
      if (!sheetDataKegiatan) {
        return ContentService.createTextOutput(JSON.stringify({ data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const data = sheetDataKegiatan.getDataRange().getValues();
      return ContentService.createTextOutput(JSON.stringify({ data: data }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (e.parameter && e.parameter.action === 'getDaftarHadir') {
      let sheetDaftarHadir = ss.getSheetByName('Daftar_Hadir');
      if (!sheetDaftarHadir) {
        return ContentService.createTextOutput(JSON.stringify({ data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const data = sheetDaftarHadir.getDataRange().getValues();
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

function handleUpdateDaftarPegawai(sheet, data) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return ContentService.createTextOutput("Empty Sheet").setMimeType(ContentService.MimeType.TEXT);
  
  const nipRange = sheet.getRange(1, 4, lastRow, 1).getValues();
  const searchNip = String(data.nip).trim();
  let rowIndex = -1;
  for (let i = 1; i < nipRange.length; i++) {
    if (String(nipRange[i][0]).trim() === searchNip || String(nipRange[i][0]).replace(/'/g, '').trim() === searchNip) {
      rowIndex = i + 1;
      break;
    }
  }

  if (rowIndex !== -1) {
    const cols = {
      'nama': 2, 'tempatTanggalLahir': 3, 'nip': 4, 'unitKerja': 5, 'golongan': 6, 'golonganPangkat': 7,
      'tmtGolongan': 8, 'eselon': 9, 'namaJabatan': 10, 'tmtJabatan': 11, 'statusPegawai': 12,
      'tmtPegawai': 13, 'masaKerjaTahun': 14, 'masaKerjaBulan': 15, 'jenisKelamin': 16, 'agama': 17,
      'statusPerkawinan': 18, 'pendidikanAwal': 19, 'pendidikanAkhir': 20, 'noAskes': 21, 'noNpwp': 22,
      'noKtp': 23, 'alamatRumah': 24, 'kelurahan': 25, 'kecamatan': 26, 'telp': 27, 'email': 28
    };
    
    for (const key in cols) {
      if (data[key] !== undefined) {
        let val = data[key];
        if (key === 'nip' || key === 'noAskes' || key === 'noNpwp' || key === 'noKtp' || key === 'telp') {
          val = "'" + val; // force string
        }
        sheet.getRange(rowIndex, cols[key]).setValue(val);
      }
    }
    SpreadsheetApp.flush();
    return ContentService.createTextOutput("Success Update Daftar Pegawai").setMimeType(ContentService.MimeType.TEXT);
  }
  return ContentService.createTextOutput("NIP Not Found").setMimeType(ContentService.MimeType.TEXT);
}



function saveFileToDrive(base64Data, fileName) {
  if (!base64Data) return "";
  
  // Hapus header metadata (misal: "data:image/png;base64,")
  let data = base64Data.split(',')[1] || base64Data;
  let blob = Utilities.newBlob(Utilities.base64Decode(data), 'application/octet-stream', fileName);
  
  // WAJIB gunakan ID Folder ini:
  let driveFolder = DriveApp.getFolderById("1QH5UtqHcjmVvYvdmSuqd2QaeDDBna1gZ");
  let file = driveFolder.createFile(blob);
  
  // Set izin agar publik bisa melihat via link
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  return file.getUrl();
}

function handleUpdateDaftarKendaraan(sheet, data) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return ContentService.createTextOutput("Empty Sheet").setMimeType(ContentService.MimeType.TEXT);

  let headerRow = 1;
  let headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 29)).getValues()[0];
  let checkRows = sheet.getRange(1, 1, Math.min(lastRow, 5), Math.max(sheet.getLastColumn(), 29)).getValues();
  for (let r = 0; r < checkRows.length; r++) {
    let rowStr = checkRows[r].join(" ").toLowerCase();
    if (rowStr.includes("polisi") || rowStr.includes("nomor polisi") || rowStr.includes("bpkb") || rowStr.includes("stnk")) {
      headers = checkRows[r];
      headerRow = r + 1;
      break;
    }
  }
  
  let noPolisiColIdx = 0;
  for (let c = 0; c < headers.length; c++) {
    let hStr = String(headers[c]).trim().toLowerCase();
    if (hStr === 'polisi' || hStr === 'nomor polisi' || hStr === 'nopol' || hStr === 'plat') {
      noPolisiColIdx = c + 1;
      break;
    }
  }
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
  if (rowIndex === -1) {
    return ContentService.createTextOutput("Error: Kendaraan tidak ditemukan di database dengan Plat: " + searchId).setMimeType(ContentService.MimeType.TEXT);
  }

  if (rowIndex !== -1) {
    // Pastikan header untuk file ada di Spreadsheet
    const requiredHeaders = ['Foto Kendaraan', 'Scan STNK', 'Scan BPKB'];
    requiredHeaders.forEach(h => {
      if (!headers.includes(h)) {
        headers.push(h);
        sheet.getRange(headerRow, headers.length).setValue(h);
      }
    });

    // Proses upload jika ada file Base64
    if (data.fotoKendaraanBase64) {
      let url = saveFileToDrive(data.fotoKendaraanBase64, data.fotoKendaraanName || "Foto_Kendaraan.png");
      data['Foto Kendaraan'] = url;
    }
    if (data.stnkBase64) {
      let url = saveFileToDrive(data.stnkBase64, data.stnkName || "Scan_STNK.pdf");
      data['Scan STNK'] = url;
    }
    if (data.bpkbBase64) {
      let url = saveFileToDrive(data.bpkbBase64, data.bpkbName || "Scan_BPKB.pdf");
      data['Scan BPKB'] = url;
    }

    // Update kolom yang cocok dengan header
    for (let c = 0; c < headers.length; c++) {
      let key = headers[c] ? String(headers[c]).trim() : '';
      if (key && data[key] !== undefined && key !== 'id' && key !== 'action' && !key.includes('Base64') && !key.includes('Name')) {
        sheet.getRange(rowIndex, c + 1).setValue(data[key]);
      }
    }

    SpreadsheetApp.flush();
    return ContentService.createTextOutput("Success Update Daftar Kendaraan").setMimeType(ContentService.MimeType.TEXT);
  }
  return ContentService.createTextOutput("Nomor Polisi Not Found").setMimeType(ContentService.MimeType.TEXT);
}
