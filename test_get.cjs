const url = "https://script.google.com/macros/s/AKfycbxEMP1lFpAS1THMwt0wwEZGgEzDpeobfrXKMxEnJGn8PnpvNBiU4pMfsYWMTU27zlGx/exec";

async function testGet() {
  const response = await fetch(url + "?action=getDaftarKendaraan");
  const text = await response.text();
  console.log("Response:", text.substring(0, 200));
}

testGet();
