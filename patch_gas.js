    if (e.parameter && e.parameter.action === 'getDaftarKendaraan') {
      var sheetName = "DaftarKendaraan"; 
      var sheetKendaraan = ss.getSheetByName(sheetName);
      
      if (!sheetKendaraan) {
        return ContentService.createTextOutput(JSON.stringify({ data: [], error: "Sheet " + sheetName + " tidak ditemukan!" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      var lastRow = sheetKendaraan.getLastRow();
      var lastColumn = sheetKendaraan.getLastColumn();
      
      // Data dimulai dari baris ke-3
      if (lastRow < 3) {
        return ContentService.createTextOutput(JSON.stringify({ data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      var numRows = lastRow - 2;
      var dataValues = sheetKendaraan.getRange(3, 1, numRows, Math.max(lastColumn, 24)).getValues();
      var dataArray = [];
      
      for (var i = 0; i < dataValues.length; i++) {
        var row = dataValues[i];
        
        // Cek apakah baris kosong (cek Polisi di index 12 dan Merk di index 5)
        if (!row[12] && !row[5]) {
          continue; 
        }
        
        var tglPajak = row[16];
        if (tglPajak instanceof Date) {
          tglPajak = Utilities.formatDate(tglPajak, Session.getScriptTimeZone(), "dd MMM yyyy");
        }
        
        var rowObject = {
          "No": row[0] || "",
          "Simbakda": row[1] || "",
          "Kode Barang": row[2] || "",
          "Nama Barang": row[3] || "",
          "No Register": row[4] || "",
          "Merk": row[5] || "",
          "Ukuran/CC": row[6] || "",
          "Bahan": row[7] || "",
          "Tahun": row[8] || "",
          "Pabrik": row[9] || "",
          "Rangka": row[10] || "",
          "Mesin": row[11] || "",
          "Polisi": row[12] || "",
          "BPKB": row[13] || "",
          "Asal Usul": row[14] || "",
          "Keterangan": row[15] || "",
          "Tanggal Pajak": tglPajak || "",
          "Status Pajak": row[17] || "",
          "Masa Plat": row[18] || "",
          "Status Plat": row[19] || "",
          "STNK": row[20] || row[21] || "Ada", // Fallback
          "Penanggung Jawab": row[20] || row[21] || row[22] || row[23] || ""
        };
        dataArray.push(rowObject);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ data: dataArray }))
        .setMimeType(ContentService.MimeType.JSON);
    }
