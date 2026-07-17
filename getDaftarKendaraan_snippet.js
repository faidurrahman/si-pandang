    if (e.parameter && e.parameter.action === 'getDaftarKendaraan') {
      // Buka sheet DaftarKendaraan
      var sheetKendaraan = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DaftarKendaraan");
      
      if (!sheetKendaraan) {
        return ContentService.createTextOutput(JSON.stringify({ data: [], error: "Sheet DaftarKendaraan tidak ditemukan!" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      var lastRow = sheetKendaraan.getLastRow();
      var lastColumn = sheetKendaraan.getLastColumn();
      
      // Asumsi data dimulai dari baris ke-3
      if (lastRow < 3) {
        return ContentService.createTextOutput(JSON.stringify({ data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Ambil data
      var dataValues = sheetKendaraan.getRange(3, 1, lastRow - 2, Math.max(lastColumn, 24)).getValues();
      var dataArray = [];
      
      for (var i = 0; i < dataValues.length; i++) {
        var row = dataValues[i];
        
        // Kolom M berada di index 12 (A=0, B=1, ... M=12)
        var polisi = row[12] ? String(row[12]).trim() : "";
        var merk = row[5] ? String(row[5]).trim() : "";
        
        // Skip baris jika Polisi dan Merk kosong
        if (!polisi && !merk) {
          continue; 
        }
        
        var tglPajak = row[16];
        if (tglPajak instanceof Date) {
          tglPajak = Utilities.formatDate(tglPajak, Session.getScriptTimeZone(), "dd MMM yyyy");
        }
        
        var rowObject = {
          "No": row[0] || "",
          "Terdata SIMBAKDA": row[1] || "",
          "Kode Barang": row[2] || "",
          "Nama Barang": row[3] || "",
          "No Register": row[4] || "",
          "Merk/Tipe": merk,
          "Ukuran/CC": row[6] || "",
          "Bahan": row[7] || "",
          "Tahun Pembuatan": row[8] || "",
          "Pabrik": row[9] || "",
          "Rangka": row[10] || "",
          "Mesin": row[11] || "",
          "Polisi": polisi, // <-- Mengambil plat nomor dari Kolom M (Index 12)
          "Status BPKB": row[13] || "",
          "Asal Usul": row[14] || "",
          "Total Pajak Kendaraan": row[15] || "",
          "Jatuh Tempo": tglPajak || "",
          "Status Pajak": row[17] || "",
          "Masa Plat": row[18] || "",
          "Status Plat": row[19] || "",
          "Status STNK": row[20] || row[21] || "", 
          "Driver": row[20] || row[21] || row[22] || row[23] || ""
        };
        dataArray.push(rowObject);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ data: dataArray }))
        .setMimeType(ContentService.MimeType.JSON);
    }
