import React, { useState, useEffect } from 'react';
import { ModalDetailKendaraan } from './ModalDetailKendaraan';

import { APPS_SCRIPT_URL } from '../constants';

const API_URL = `${APPS_SCRIPT_URL}?action=getDaftarKendaraan`;

export const DaftarKendaraan: React.FC = () => {
  const [dataKendaraan, setDataKendaraan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSimbakda, setFilterSimbakda] = useState<'Semua' | 'Terdata SIMBAKDA' | 'Tidak Terdata'>('Semua');
  
  const [columnFilters, setColumnFilters] = useState({
    polisi: '',
    detail: '',
    driver: '',
    statusPajak: 'Semua',
    jatuhTempo: '',
    totalPajak: '',
    stnk: 'Semua',
    bpkb: 'Semua'
  });

  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedKendaraan, setSelectedKendaraan] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setDataKendaraan(data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <svg className="w-3.5 h-3.5 inline-block ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
    ) : (
      <svg className="w-3.5 h-3.5 inline-block ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
    );
  };

  const handleColumnFilterChange = (key: keyof typeof columnFilters, value: string) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = React.useMemo(() => {
    if (!dataKendaraan) return [];

    let result = dataKendaraan.filter(item => {
      // 1. FILTER SIMBAKDA (Ketat)
      let matchesSimbakda = true;
      const valKendaraan = item['Terdata SIMBAKDA'] ? String(item['Terdata SIMBAKDA']).toLowerCase().trim() : '';
      
      if (filterSimbakda === 'Terdata SIMBAKDA') {
        matchesSimbakda = valKendaraan === 'terdata';
      } else if (filterSimbakda === 'Tidak Terdata') {
        matchesSimbakda = valKendaraan === '' || valKendaraan === 'null' || valKendaraan === 'undefined' || valKendaraan !== 'terdata';
      }

      const platNomor = String(item['Polisi'] || '').toLowerCase();
      const merk = String(item['Merk/Tipe'] || '').toLowerCase();
      const jenis = String(item['Asal Usul'] || '').toLowerCase();
      const tahun = String(item['Tahun Pembuatan'] || '').toLowerCase();
      const detailStr = `${merk} ${jenis} ${tahun}`;
      const penanggungJawab = String(item['Driver'] || '').toLowerCase();
      const statusPajak = String(item['Status Pajak'] || 'Tidak ada data').toLowerCase();
      const jatuhTempo = String(item['Jatuh Tempo'] || '').toLowerCase();
      const totalPajak = String(item['Total Pajak Kendaraan'] || '').toLowerCase();
      const stnk = String(item['Status STNK'] || item['STNK'] || '').toLowerCase();
      const bpkb = String(item['Status BPKB'] || item['BPKB'] || '').toLowerCase();
      
      // 2. FILTER GLOBAL
      let matchesSearch = true;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        matchesSearch = platNomor.includes(searchLower) || 
                        merk.includes(searchLower) ||
                        penanggungJawab.includes(searchLower);
      }

      // 3. FILTER KOLOM
      const matchPolisi = platNomor.includes(columnFilters.polisi.toLowerCase());
      const matchDetail = detailStr.includes(columnFilters.detail.toLowerCase());
      const matchDriver = penanggungJawab.includes(columnFilters.driver.toLowerCase());
      const matchJatuhTempo = jatuhTempo.includes(columnFilters.jatuhTempo.toLowerCase());
      const matchTotalPajak = totalPajak.includes(columnFilters.totalPajak.toLowerCase());
      
      let matchStatusPajak = true;
      if (columnFilters.statusPajak === 'Lunas') {
        matchStatusPajak = statusPajak.includes('lunas') && !statusPajak.includes('belum');
      } else if (columnFilters.statusPajak === 'Belum Lunas') {
        matchStatusPajak = statusPajak.includes('belum lunas') || statusPajak.includes('tidak ada data');
      }

      let matchStnk = true;
      if (columnFilters.stnk === 'Ada') {
        matchStnk = stnk && stnk !== 'tidak ada' && stnk !== 'kosong' && stnk !== '-';
      } else if (columnFilters.stnk === 'Tidak Ada') {
        matchStnk = !stnk || stnk === 'tidak ada' || stnk === 'kosong' || stnk === '-';
      }

      let matchBpkb = true;
      if (columnFilters.bpkb === 'Ada') {
        matchBpkb = bpkb && bpkb !== 'tidak ada' && bpkb !== 'kosong' && bpkb !== '-';
      } else if (columnFilters.bpkb === 'Tidak Ada') {
        matchBpkb = !bpkb || bpkb === 'tidak ada' || bpkb === 'kosong' || bpkb === '-';
      }

      // SANGAT PENTING: Semua filter HARUS digabung dengan && (AND)
      return matchesSimbakda && matchesSearch && matchPolisi && matchDetail && 
             matchDriver && matchJatuhTempo && matchTotalPajak && 
             matchStatusPajak && matchStnk && matchBpkb;
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
  }, [dataKendaraan, searchTerm, filterSimbakda, sortConfig, columnFilters]);

  const totalPajakFiltered = React.useMemo(() => {
    return filteredData.reduce((sum, item) => {
      const raw = item['Total Pajak Kendaraan'];
      const num = Number(raw);
      if (!isNaN(num) && num > 0) {
        return sum + num;
      }
      return sum;
    }, 0);
  }, [filteredData]);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Aksi */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Daftar Kendaraan Dinas</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Rincian aset operasional kecamatan</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kendaraan
        </button>
      </div>

      {/* Filter & Search Global */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari Global (Plat, Merk, atau Penanggung Jawab)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium shadow-sm"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
          value={filterSimbakda}
          onChange={(e) => setFilterSimbakda(e.target.value as any)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium shadow-sm appearance-none cursor-pointer min-w-[200px]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
        >
          <option value="Semua">Semua Kendaraan</option>
          <option value="Terdata SIMBAKDA">Terdata SIMBAKDA</option>
          <option value="Tidak Terdata">Tidak Terdata</option>
        </select>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 align-top min-w-[50px] w-[50px]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs mb-2 mt-1 text-center">
                  No.
                </div>
              </th>
              <th className="px-4 py-3 align-top min-w-[150px]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:text-blue-600 transition-colors select-none flex items-center mb-2" onClick={() => handleSort('Polisi')}>
                  PLAT NOMOR {getSortIcon('Polisi')}
                </div>
                <input 
                  type="text" 
                  placeholder="Filter..." 
                  value={columnFilters.polisi}
                  onChange={(e) => handleColumnFilterChange('polisi', e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </th>
              <th className="px-4 py-3 align-top min-w-[200px]">
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
              </th>
              <th className="px-4 py-3 align-top min-w-[180px]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:text-blue-600 transition-colors select-none flex items-center mb-2" onClick={() => handleSort('Driver')}>
                  PENANGGUNG JAWAB {getSortIcon('Driver')}
                </div>
                <input 
                  type="text" 
                  placeholder="Filter..." 
                  value={columnFilters.driver}
                  onChange={(e) => handleColumnFilterChange('driver', e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </th>
              <th className="px-4 py-3 align-top min-w-[140px]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:text-blue-600 transition-colors select-none flex items-center mb-2" onClick={() => handleSort('Status Pajak')}>
                  STATUS PAJAK {getSortIcon('Status Pajak')}
                </div>
                <select 
                  value={columnFilters.statusPajak}
                  onChange={(e) => handleColumnFilterChange('statusPajak', e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                >
                  <option value="Semua">Semua</option>
                  <option value="Lunas">Lunas</option>
                  <option value="Belum Lunas">Belum Lunas</option>
                </select>
              </th>
              <th className="px-4 py-3 align-top min-w-[130px]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:text-blue-600 transition-colors select-none flex items-center mb-2" onClick={() => handleSort('Jatuh Tempo')}>
                  JATUH TEMPO {getSortIcon('Jatuh Tempo')}
                </div>
                <input 
                  type="text" 
                  placeholder="Filter..." 
                  value={columnFilters.jatuhTempo}
                  onChange={(e) => handleColumnFilterChange('jatuhTempo', e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </th>
              <th className="px-4 py-3 align-top min-w-[140px]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:text-blue-600 transition-colors select-none flex items-center mb-2" onClick={() => handleSort('Total Pajak Kendaraan')}>
                  TOTAL PAJAK {getSortIcon('Total Pajak Kendaraan')}
                </div>
                <input 
                  type="text" 
                  placeholder="Filter..." 
                  value={columnFilters.totalPajak}
                  onChange={(e) => handleColumnFilterChange('totalPajak', e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </th>
              <th className="px-4 py-3 align-top min-w-[110px]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:text-blue-600 transition-colors select-none flex items-center mb-2">
                  STNK
                </div>
                <select 
                  value={columnFilters.stnk}
                  onChange={(e) => handleColumnFilterChange('stnk', e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                >
                  <option value="Semua">Semua</option>
                  <option value="Ada">Ada</option>
                  <option value="Tidak Ada">Tidak Ada</option>
                </select>
              </th>
              <th className="px-4 py-3 align-top min-w-[110px]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs cursor-pointer hover:text-blue-600 transition-colors select-none flex items-center mb-2">
                  BPKB
                </div>
                <select 
                  value={columnFilters.bpkb}
                  onChange={(e) => handleColumnFilterChange('bpkb', e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded border border-slate-200 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                >
                  <option value="Semua">Semua</option>
                  <option value="Ada">Ada</option>
                  <option value="Tidak Ada">Tidak Ada</option>
                </select>
              </th>
              <th className="px-4 py-3 align-top text-center w-[100px]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-xs mb-2 mt-1">
                  Aksi
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4"><div className="h-6 bg-slate-200 rounded w-8 mx-auto"></div></td>
                  <td className="py-4 px-4"><div className="h-6 bg-slate-200 rounded w-24"></div></td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-2">
                      <div className="h-4 bg-slate-200 rounded w-32"></div>
                      <div className="h-3 bg-slate-200 rounded w-20"></div>
                    </div>
                  </td>
                  <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                  <td className="py-4 px-4"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                  <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                  <td className="py-4 px-4"><div className="h-6 bg-slate-200 rounded-full w-16"></div></td>
                  <td className="py-4 px-4"><div className="h-6 bg-slate-200 rounded-full w-16"></div></td>
                  <td className="py-4 px-4"><div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div></td>
                </tr>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                const platNomor = String(item['Polisi'] || '-');
                const merk = String(item['Merk/Tipe'] || '-');
                const jenis = String(item['Asal Usul'] || '-');
                const tahun = String(item['Tahun Pembuatan'] || '-');
                const penanggungJawab = String(item['Driver'] || '-');
                
                // Info Pajak
                const statusPajak = String(item['Status Pajak'] || 'Tidak ada data');
                const statusPajakLower = statusPajak.toLowerCase();
                const isPajakMerah = statusPajakLower.includes('belum lunas') || statusPajakLower.includes('tidak ada data');
                const isPajakHijau = statusPajakLower.includes('lunas') && !statusPajakLower.includes('belum');
                
                const jatuhTempo = String(item['Jatuh Tempo'] || '-');
                
                const formatTotalPajak = (() => {
                  const raw = item['Total Pajak Kendaraan'];
                  if (!raw || raw === '-' || String(raw).trim() === '') return '-';
                  const num = Number(raw);
                  if (!isNaN(num)) {
                    return `Rp. ${num.toLocaleString('id-ID')}`;
                  }
                  return String(raw);
                })();
                
                // Dokumen
                const bpkb = String(item['Status BPKB'] || item['BPKB'] || '');
                const stnk = String(item['Status STNK'] || item['STNK'] || '');
                const isBpkbAda = bpkb && bpkb.toLowerCase() !== 'tidak ada' && bpkb.toLowerCase() !== 'kosong' && bpkb !== '-';
                const isStnkAda = stnk && stnk.toLowerCase() !== 'tidak ada' && stnk.toLowerCase() !== 'kosong' && stnk !== '-';

                return (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-4 text-center font-medium text-slate-500">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      {platNomor}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col max-w-[200px] truncate">
                        <span className="text-sm font-semibold text-slate-800 truncate">{merk}</span>
                        <span className="text-xs text-slate-500 truncate mt-0.5">{jenis} • {tahun}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 max-w-[180px] truncate">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
                          {penanggungJawab.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-700 truncate">{penanggungJawab}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isPajakHijau ? 'bg-emerald-100 text-emerald-700' : isPajakMerah ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                        {statusPajak}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {jatuhTempo}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                      {formatTotalPajak}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${isStnkAda ? 'bg-blue-50 text-blue-700 border border-blue-200/50' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        {isStnkAda ? 'Ada' : 'Tidak Ada'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${isBpkbAda ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        {isBpkbAda ? 'Ada' : 'Tidak Ada'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Detail"
                          onClick={() => {
                            setSelectedKendaraan(item);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Tidak ada data kendaraan yang cocok.</p>                  
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Total */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 mt-4 px-5 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-sm">
        <span className="text-sm font-semibold text-slate-600">
          Total Data: <span className="text-slate-900">{filteredData.length} Kendaraan</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">Total Keseluruhan Pajak:</span>
          <span className="text-lg font-bold text-blue-700 bg-blue-100 px-4 py-1.5 rounded-full">
            Rp. {totalPajakFiltered.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <ModalDetailKendaraan 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        data={selectedKendaraan} 
      />
    </div>
  );
};
