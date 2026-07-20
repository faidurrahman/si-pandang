import sys

with open("GoogleAppsScript.gs", "r") as f:
    content = f.read()

old_upload = """    // Proses upload jika ada file Base64
    if (data.fotoKendaraanBase64) {
      data['Foto'] = saveFileToDrive(data.fotoKendaraanBase64, data.fotoKendaraanName || "Foto_Kendaraan.png");
    }
    if (data.stnkBase64) {
      data['Scan STNK'] = saveFileToDrive(data.stnkBase64, data.stnkName || "Scan_STNK.pdf");
    }
    if (data.bpkbBase64) {
      data['Scan BPKB'] = saveFileToDrive(data.bpkbBase64, data.bpkbName || "Scan_BPKB.pdf");
    }"""

new_upload = """    // Proses upload jika ada file Base64
    if (data.fotoKendaraanBase64) {
      let url = saveFileToDrive(data.fotoKendaraanBase64, data.fotoKendaraanName || "Foto_Kendaraan.png");
      data['Foto'] = url;
      data['Foto Kendaraan'] = url;
      data['fotoUrl'] = url;
    }
    if (data.stnkBase64) {
      let url = saveFileToDrive(data.stnkBase64, data.stnkName || "Scan_STNK.pdf");
      data['Scan STNK'] = url;
      data['File STNK'] = url;
      data['stnkUrl'] = url;
    }
    if (data.bpkbBase64) {
      let url = saveFileToDrive(data.bpkbBase64, data.bpkbName || "Scan_BPKB.pdf");
      data['Scan BPKB'] = url;
      data['File BPKB'] = url;
      data['bpkbUrl'] = url;
    }"""

content = content.replace(old_upload, new_upload)

with open("GoogleAppsScript.gs", "w") as f:
    f.write(content)
