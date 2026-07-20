const fs = require('fs');
const url = "https://script.google.com/macros/s/AKfycbxEMP1lFpAS1THMwt0wwEZGgEzDpeobfrXKMxEnJGn8PnpvNBiU4pMfsYWMTU27zlGx/exec";

// 1. Create a dummy base64 file (a 1x1 transparent PNG)
const dummyBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

async function testUpload() {
  const payload = {
    action: 'updateDaftarKendaraan',
    'Polisi': 'TEST_PLAT_NOMOR_ABC', // just to trigger the rowIndex logic
    fotoKendaraanBase64: dummyBase64,
    fotoKendaraanName: 'test_upload_script.png'
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  
  const text = await response.text();
  console.log("Response:", text);
}

testUpload();
