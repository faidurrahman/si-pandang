const url = "https://script.google.com/macros/s/AKfycbz6Z5tqztugppZY2VBbW4k4BNprjY6lvp0ODjODvSo7rJS8l8XCR9QV2NPZUlXQW3mD/exec";

async function testGet() {
  const response = await fetch(url + "?action=getDaftarKendaraan");
  const json = await response.json();
  if (json.data && json.data.length > 0) {
    console.log("Keys:", Object.keys(json.data[0]).join(", "));
  } else {
    console.log("No data or error:", json);
  }
}

testGet();
