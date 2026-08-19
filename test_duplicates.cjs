const fetch = require('node-fetch');

async function test() {
  const url = "https://script.google.com/macros/s/AKfycbzE1go6iu-zCDbaH01l9Jx1pj4xcgoksr6A22NHc95SmQelY67Ck8_N66f-i7buSRjI/exec";
  const res = await fetch(url + '?action=getDaftarKendaraan');
  const data = await res.json();
  const items = data.data.filter(d => String(d.Polisi).includes('3457'));
  console.log("Found:", items.length);
  if (items.length > 1) {
    console.log(items);
  }
}
test();
