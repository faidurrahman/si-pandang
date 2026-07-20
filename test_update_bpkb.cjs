const url = "https://script.google.com/macros/s/AKfycbz6Z5tqztugppZY2VBbW4k4BNprjY6lvp0ODjODvSo7rJS8l8XCR9QV2NPZUlXQW3mD/exec";

async function testUpdate() {
  const payload = {
    action: 'updateDaftarKendaraan',
    'Polisi': 'DD 8540 SK',
    'Status BPKB': 'Ada'
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload)
  });
  
  const text = await response.text();
  console.log("Response:", text);
}

testUpdate();
