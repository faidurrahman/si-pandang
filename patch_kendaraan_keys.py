import os

# Update DaftarKendaraan.tsx
with open('components/DaftarKendaraan.tsx', 'r') as f:
    content = f.read()

# Replace keys
content = content.replace("item.Polisi || item['Plat Nomor']", "item['Polisi']")
content = content.replace("item.Merk || '-'", "item['Merk/Tipe'] || '-'")
content = content.replace("item.Jenis || item.Asal_Usul || item['Asal Usul']", "item['Asal Usul']")
content = content.replace("item.Tahun || item['Tahun Pembuatan']", "item['Tahun Pembuatan']")
content = content.replace("item['Penanggung Jawab'] || item['Pemegang Kendaraan']", "item['Driver']")
content = content.replace("item.Simbakda || item['Terdata SIMBAKDA'] || item['Keterangan']", "item['Terdata SIMBAKDA']")
content = content.replace("item['Status Pajak'] || item.Status", "item['Status Pajak']")
content = content.replace("item['Jatuh Tempo'] || item['Tanggal Pajak']", "item['Tanggal Pajak']")
content = content.replace("item['Masa Plat'] || item['Jatuh Tempo Plat']", "item['Masa Plat']")
content = content.replace("item.STNK", "item['STNK']")
content = content.replace("item.BPKB", "item['BPKB']")
content = content.replace("item['Status Plat']", "item['Status Plat']")

with open('components/DaftarKendaraan.tsx', 'w') as f:
    f.write(content)

