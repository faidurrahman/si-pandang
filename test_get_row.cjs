const url = "https://script.google.com/macros/s/AKfycbz6Z5tqztugppZY2VBbW4k4BNprjY6lvp0ODjODvSo7rJS8l8XCR9QV2NPZUlXQW3mD/exec";

async function testGet() {
  const response = await fetch(url + "?action=getDaftarKendaraan");
  const json = await response.json();
  const row = json.data.find(d => d.Polisi === 'DD 8540 SK');
  console.log("Row:", row);
}

testGet();
