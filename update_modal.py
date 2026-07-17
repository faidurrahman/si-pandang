import re

with open('components/ModalDetailKendaraan.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r"const driver = data\['Driver'\] \|\| data\['Penanggung Jawab'\] \|\| data\['Pemegang Kendaraan'\] \|\| '-';",
    "const driver = data['Status Pajak'] || data['Driver'] || '-';",
    content
)

content = re.sub(
    r"const totalPajak = data\['Total Pajak Kendaraan'\] \|\| data\['Total PKB'\] \|\| '-';",
    "const totalPajak = data['Tanggal Pajak'] || data['Total Pajak Kendaraan'] || '-';",
    content
)

content = re.sub(
    r"const jatuhTempo = data\['Jatuh Tempo'\] \|\| data\['Tanggal Pajak'\] \|\| '-';",
    "const jatuhTempoRaw = data['STNK'];\n  const jatuhTempo = jatuhTempoRaw && jatuhTempoRaw !== '-' ? new Date(jatuhTempoRaw).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-';",
    content
)

content = re.sub(
    r"const statusPajakRaw = data\['Status Pajak'\] \|\| data\['Status'\] \|\| 'Tidak Diketahui';",
    "const statusPajakRaw = data['Total Pajak Kendaraan'] || 'Tidak Diketahui';",
    content
)

content = re.sub(
    r"const statusKendaraan = data\['Simbakda'\] \|\| data\['Terdata SIMBAKDA'\] \|\| data\['Keterangan'\] \|\| '-';",
    "const statusKendaraan = data['Terdata SIMBAKDA'] || '-';",
    content
)

content = re.sub(
    r"const isBpkbAda = String\(data\['BPKB'\] \|\| ''\)\.toLowerCase\(\) === 'ada' \|\| data\['BPKB'\] === true \|\| String\(data\['BPKB'\] \|\| ''\)\.toLowerCase\(\) === 'ya';",
    "const isBpkbAda = !!data['BPKB'];",
    content
)

content = re.sub(
    r"const isStnkAda = String\(data\['STNK'\] \|\| ''\)\.toLowerCase\(\) === 'ada' \|\| data\['STNK'\] === true \|\| String\(data\['STNK'\] \|\| ''\)\.toLowerCase\(\) === 'ya';",
    "const isStnkAda = !!data['STNK'];",
    content
)

with open('components/ModalDetailKendaraan.tsx', 'w') as f:
    f.write(content)

