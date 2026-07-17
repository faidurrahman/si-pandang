import re

with open('components/DaftarKendaraan.tsx', 'r') as f:
    content = f.read()

# 1. Update State
state_old = "const [filter, setFilter] = useState<'Semua' | 'Terdata SIMBAKDA' | 'Tidak Terdata'>('Semua');"
state_new = """const [filterSimbakda, setFilterSimbakda] = useState<'Semua' | 'Terdata SIMBAKDA' | 'Tidak Terdata'>('Semua');
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });"""

content = content.replace(state_old, state_new)

# 2. Update filteredData logic and add handleSort, getSortIcon
filtered_old = r"const filteredData = dataKendaraan\.filter\(item => \{.*?(?=\s+return \(\s*<div className=\"w-full)"
filtered_new = """const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
    ) : (
      <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
    );
  };

  const filteredData = React.useMemo(() => {
    let result = dataKendaraan.filter(item => {
      const platNomor = item['Polisi'] || '';
      const merk = item['Merk/Tipe'] || '';
      const penanggungJawab = item['Driver'] || '';
      
      const simbakdaStatus = String(item['Terdata SIMBAKDA'] || '').toLowerCase();
      const isSimbakda = simbakdaStatus.includes('ya') || simbakdaStatus.includes('terdata') || simbakdaStatus === 'true';
      
      const matchesSearch = String(platNomor).toLowerCase().includes(searchTerm.toLowerCase()) || 
                            String(merk).toLowerCase().includes(searchTerm.toLowerCase()) ||
                            String(penanggungJawab).toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterSimbakda === 'Terdata SIMBAKDA') return matchesSearch && isSimbakda;
      if (filterSimbakda === 'Tidak Terdata') return matchesSearch && !isSimbakda;
      return matchesSearch;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = String(a[sortConfig.key!] || '').toLowerCase();
        let valB = String(b[sortConfig.key!] || '').toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [dataKendaraan, searchTerm, filterSimbakda, sortConfig]);"""

content = re.sub(filtered_old, filtered_new, content, flags=re.DOTALL)

# 3. Update the select filter in UI
select_old = """<select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}"""
select_new = """<select
          value={filterSimbakda}
          onChange={(e) => setFilterSimbakda(e.target.value as any)}"""

content = content.replace(select_old, select_new)

# 4. Update the Table Headers
th_old = """<tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Plat Nomor</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Detail Kendaraan</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Penanggung Jawab</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Info Pajak</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Masa Plat</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Dokumen</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs text-center">Aksi</th>
            </tr>"""

th_new = """<tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors select-none" onClick={() => handleSort('Polisi')}>
                <div className="flex items-center">Plat Nomor {getSortIcon('Polisi')}</div>
              </th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors select-none" onClick={() => handleSort('Merk/Tipe')}>
                <div className="flex items-center">Detail Kendaraan {getSortIcon('Merk/Tipe')}</div>
              </th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors select-none" onClick={() => handleSort('Driver')}>
                <div className="flex items-center">Penanggung Jawab {getSortIcon('Driver')}</div>
              </th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors select-none" onClick={() => handleSort('Status Pajak')}>
                <div className="flex items-center">Info Pajak {getSortIcon('Status Pajak')}</div>
              </th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:bg-slate-100 transition-colors select-none" onClick={() => handleSort('Masa Plat')}>
                <div className="flex items-center">Masa Plat {getSortIcon('Masa Plat')}</div>
              </th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Dokumen</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs text-center">Aksi</th>
            </tr>"""

content = content.replace(th_old, th_new)

with open('components/DaftarKendaraan.tsx', 'w') as f:
    f.write(content)

print("Patching complete!")
