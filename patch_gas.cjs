const fs = require('fs');

let content = fs.readFileSync('GoogleAppsScript.gs', 'utf-8');

// Insert doGet logic
const doGetInsertion = `
    // Cek parameter action untuk Daftar Hadir
    if (e.parameter && e.parameter.action === 'getDataKegiatan') {
      var sheetDataKegiatan = ss.getSheetByName('Data_Kegiatan');
      if (!sheetDataKegiatan) {
        return ContentService.createTextOutput(JSON.stringify({ data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const data = sheetDataKegiatan.getDataRange().getValues();
      return ContentService.createTextOutput(JSON.stringify({ data: data }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (e.parameter && e.parameter.action === 'getDaftarHadir') {
      var sheetDaftarHadir = ss.getSheetByName('Daftar_Hadir');
      if (!sheetDaftarHadir) {
        return ContentService.createTextOutput(JSON.stringify({ data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const data = sheetDaftarHadir.getDataRange().getValues();
      return ContentService.createTextOutput(JSON.stringify({ data: data }))
        .setMimeType(ContentService.MimeType.JSON);
    }
`;

content = content.replace('// Default: Ambil data Pengajuan', doGetInsertion + '\n    // Default: Ambil data Pengajuan');

// Insert doPost logic
const doPostInsertion = `
    // -------------------------------------------------------------
    // LOGIKA DAFTAR HADIR & KEGIATAN
    // -------------------------------------------------------------
    if (data.action === 'addDataKegiatan') {
      var sheetDataKegiatan = ss.getSheetByName('Data_Kegiatan');
      if (!sheetDataKegiatan) {
        sheetDataKegiatan = ss.insertSheet('Data_Kegiatan');
        sheetDataKegiatan.appendRow(['id_kegiatan', 'nama_kegiatan', 'hari_tanggal', 'waktu', 'tempat']);
      }
      
      var idKegiatan = data.id_kegiatan || Utilities.getUuid();
      
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
      var sheetDaftarHadir = ss.getSheetByName('Daftar_Hadir');
      if (!sheetDaftarHadir) {
        sheetDaftarHadir = ss.insertSheet('Daftar_Hadir');
        sheetDaftarHadir.appendRow(['timestamp', 'id_kegiatan', 'nama_lengkap', 'instansi', 'gender', 'no_hp', 'email', 'ttd_digital']);
      }
      
      // Menangani ttd digital (jika ingin di-save as image, logic serupa SK bisa dipakai, tapi base64 string juga bisa masuk ke cell langsung)
      // Disini kita simpan base64 stringnya saja.
      
      sheetDaftarHadir.appendRow([
        new Date().toISOString(),
        data.id_kegiatan || '',
        data.nama_lengkap || '',
        data.instansi || '',
        data.gender || '',
        "'" + (data.no_hp || ''),
        data.email || '',
        data.ttd_digital || '' // base64 string
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "Success" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
`;

content = content.replace('if (data.action === \'updateDaftarPegawai\') {', doPostInsertion + '\n    if (data.action === \'updateDaftarPegawai\') {');

fs.writeFileSync('GoogleAppsScript.gs', content);
console.log('patched');
