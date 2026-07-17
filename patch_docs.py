import re

with open('components/DaftarKendaraan.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r"const bpkb = String\(item\['Status BPKB'\] \|\| ''\);",
    "const bpkb = String(item['Status BPKB'] || item['BPKB'] || '');",
    content
)

content = re.sub(
    r"const stnk = String\(item\['Status STNK'\] \|\| ''\);",
    "const stnk = String(item['Status STNK'] || item['STNK'] || '');",
    content
)

with open('components/DaftarKendaraan.tsx', 'w') as f:
    f.write(content)

