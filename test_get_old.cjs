const url = "https://script.google.com/macros/s/AKfycbxMl_dvH114ejkbiDBZ97Hsz-2I2C9JNJRibX7oYn3a67toDSy9Z0AqlQNES9Wc3nrV/exec";

async function testGet() {
  const response = await fetch(url + "?action=getDaftarKendaraan");
  const json = await response.json();
  console.log("Response:", json.data.length);
}

testGet();
