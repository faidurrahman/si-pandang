import re

with open('components/DaftarKendaraan.tsx', 'r') as f:
    content = f.read()

# Update mapping lines
content = re.sub(
    r"const penanggungJawab = String\(item\['Driver'\] \|\| '-'\);",
    "const penanggungJawab = String(item['Status Pajak'] || item['Driver'] || '-');",
    content
)

content = re.sub(
    r"const statusPajakAsli = String\(item\['Status Pajak'\] \|\| 'Tidak Diketahui'\);",
    "const statusPajakAsli = String(item['Total Pajak Kendaraan'] || 'Tidak Diketahui');",
    content
)

content = re.sub(
    r"const tglPajak = item\['Tanggal Pajak'\] \|\| '-';",
    "const tglPajakRaw = item['STNK'];\n                const tglPajak = tglPajakRaw ? new Date(tglPajakRaw).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-';",
    content
)

content = re.sub(
    r"const stnkAda = String\(item\['STNK'\] \|\| ''\)\.toLowerCase\(\) === 'ada' \|\| item\['STNK'\] === true \|\| String\(item\['STNK'\] \|\| ''\)\.toLowerCase\(\) === 'ya';",
    "const stnkAda = !!item['STNK'];",
    content
)

content = re.sub(
    r"const bpkbAda = String\(item\['BPKB'\] \|\| ''\)\.toLowerCase\(\) === 'ada' \|\| item\['BPKB'\] === true \|\| String\(item\['BPKB'\] \|\| ''\)\.toLowerCase\(\) === 'ya';",
    "const bpkbAda = !!item['BPKB'];",
    content
)

with open('components/DaftarKendaraan.tsx', 'w') as f:
    f.write(content)

