const fs = require('fs');
let code = fs.readFileSync('GoogleAppsScript.gs', 'utf8');

// Insert GET Daftar Pegawai
code = code.replace(
  /if \(!sheetKgb\) \{/,
  `if (e.parameter.action === 'getDaftarPegawai') {
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
      if (!sheetKgb) {`
);

// Insert POST Daftar Pegawai handling
code = code.replace(
  /if \(data.action === 'addPegawai'\) \{/,
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
    
    if (data.action === 'addPegawai') {`
);

const fnUpdateDaftarPegawai = `

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
`;

code += fnUpdateDaftarPegawai;

fs.writeFileSync('GoogleAppsScript.gs', code);
