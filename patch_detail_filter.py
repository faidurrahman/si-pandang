import sys

with open("components/DaftarKendaraan.tsx", "r") as f:
    content = f.read()

# 1. ADD STATE
state_insert = """
  const [filterTenggatPlat, setFilterTenggatPlat] = useState('Semua');

  const [filterDetail, setFilterDetail] = useState<string[]>([]);
  const [isDetailDropdownOpen, setIsDetailDropdownOpen] = useState(false);
"""
content = content.replace("  const [filterTenggatPlat, setFilterTenggatPlat] = useState('Semua');", state_insert)

# 2. ADD uniqueDetails and handleToggleDetail
helpers_insert = """
  const handleColumnFilterChange = (key: keyof typeof columnFilters, value: string) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
  };

  const uniqueDetails = React.useMemo(() => {
    return Array.from(new Set(dataKendaraan.map(item => String(item['Merk/Tipe'] || '')).filter(Boolean))).sort();
  }, [dataKendaraan]);

  const handleToggleDetail = (val: string) => {
    setFilterDetail(prev => 
      prev.includes(val) ? prev.filter(item => item !== val) : [...prev, val]
    );
  };
"""
content = content.replace("  const handleColumnFilterChange = (key: keyof typeof columnFilters, value: string) => {\n    setColumnFilters(prev => ({ ...prev, [key]: value }));\n  };", helpers_insert)

# 3. FIX FILTER LOGIC
logic_old = "const matchDetail = detailStr.includes(columnFilters.detail.toLowerCase());"
logic_new = """let matchDetail = true;
      if (filterDetail.length > 0) {
        matchDetail = filterDetail.includes(String(item['Merk/Tipe'] || ''));
      }"""
content = content.replace(logic_old, logic_new)

# 4. REPLACE HEADER TH
th_old = """              <th className="px-4 py-3 align-top min-w-[200px]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:text-blue-600 transition-colors select-none flex items-center mb-2" onClick={() => handleSort('Merk/Tipe')}>
                  DETAIL KENDARAAN {getSortIcon('Merk/Tipe')}
                </div>
                <input 
                  type="text" 
                  placeholder="Filter..." 
                  value={columnFilters.detail}
                  onChange={(e) => handleColumnFilterChange('detail', e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </th>"""

th_new = """              <th className="px-4 py-3 align-top min-w-[200px] relative">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:text-blue-600 transition-colors select-none flex items-center mb-2" onClick={() => handleSort('Merk/Tipe')}>
                  DETAIL KENDARAAN {getSortIcon('Merk/Tipe')}
                </div>
                <button
                  onClick={() => setIsDetailDropdownOpen(!isDetailDropdownOpen)}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm text-left flex justify-between items-center"
                >
                  <span className="truncate">
                    {filterDetail.length === 0 ? 'Pilih Detail...' : `${filterDetail.length} terpilih`}
                  </span>
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isDetailDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-[250px] bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto left-4">
                    {uniqueDetails.map((detail, idx) => (
                      <label key={idx} className="flex items-center px-3 py-2 hover:bg-slate-50 cursor-pointer text-xs text-slate-700">
                        <input
                          type="checkbox"
                          className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          checked={filterDetail.includes(detail)}
                          onChange={() => handleToggleDetail(detail)}
                        />
                        <span className="truncate" title={detail}>{detail}</span>
                      </label>
                    ))}
                  </div>
                )}
              </th>"""
content = content.replace(th_old, th_new)

with open("components/DaftarKendaraan.tsx", "w") as f:
    f.write(content)

