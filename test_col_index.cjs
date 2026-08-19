const fetch = require('node-fetch');

async function test() {
  const url = "https://script.google.com/macros/s/AKfycbzE1go6iu-zCDbaH01l9Jx1pj4xcgoksr6A22NHc95SmQelY67Ck8_N66f-i7buSRjI/exec";
  const payload = {
    action: 'getDaftarKendaraan'
  };
  // Wait, I can't easily see the empty headers from the API response because it filters them out.
  // But let's check the updateDaftarKendaraan logic!
}
test();
