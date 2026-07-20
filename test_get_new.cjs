const url = "https://script.google.com/macros/s/AKfycbxZCaag5olI5dpX9XxCkt6C_St2vEk1jEhq3KAh8P8YkdISsu4n4kPlZv1vc3haYKgS/exec";

async function testGet() {
  const response = await fetch(url + "?action=getDaftarKendaraan");
  const text = await response.text();
  console.log("Response:", text.substring(0, 500));
}

testGet();
