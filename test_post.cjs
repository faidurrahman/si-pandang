(async () => {
  const url = "https://script.google.com/macros/s/AKfycbxiSwMP-Yev_GrE0b1STevFVHoUSrsA8G-Ba6fUdLIXrEKmY_Oo0TRKhJYJDHdEjlxn/exec";
  const payload = {
    action: "updateDaftarKendaraan",
    No: "1",
    Polisi: "DD 123 AA",
    "Foto Kendaraan": ""
  };
  
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (e) {
    console.log("Error:", e);
  }
})();
