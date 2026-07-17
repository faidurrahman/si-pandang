import re

with open('App.tsx', 'r') as f:
    content = f.read()

import_statement = "import { DaftarKendaraan } from './components/DaftarKendaraan';\n"
content = "import { DaftarKendaraan } from './components/DaftarKendaraan';\n" + content

content = content.replace("useState<'layanan' | 'monitoring' | 'pantau-kgb' | 'rekap-bmd' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir'>('layanan');", "useState<'layanan' | 'monitoring' | 'pantau-kgb' | 'rekap-bmd' | 'daftar-kendaraan' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir'>('layanan');")

content = content.replace("['data-pegawai', 'daftar-hadir', 'rekap-bmd']", "['data-pegawai', 'daftar-hadir', 'rekap-bmd', 'daftar-kendaraan']")

dashboard_bmd = """        ) : activeTab === 'rekap-bmd' ? (
          <DashboardRekapBmd />
"""

daftar_kendaraan = """        ) : activeTab === 'daftar-kendaraan' ? (
          <DaftarKendaraan />
"""

content = content.replace(dashboard_bmd, dashboard_bmd + daftar_kendaraan)

with open('App.tsx', 'w') as f:
    f.write(content)
