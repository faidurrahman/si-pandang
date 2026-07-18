import React, { useState, useEffect } from 'react';
import { ModalDetailKendaraan } from './ModalDetailKendaraan';


// URL Google Apps Script yang Anda buat
// Anda dapat menaruh URL ini di file .env.local Anda dengan nama VITE_APPS_SCRIPT_KENDARAAN_URL
import { APPS_SCRIPT_URL } from '../constants';
const API_URL = `${APPS_SCRIPT_URL}?action=getDaftarKendaraan`;

export const DaftarKendaraan: React.FC = () => {
  const [dataKendaraan, setDataKendaraan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSimbakda, setFilterSimbakda] = useState<'Semua' | 'Terdata SIMBAKDA' | 'Tidak Terdata'>('Semua');
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
  }, [dataKendaraan, searchTerm, filterSimbakda, sortConfig]);

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

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari Plat, Merk, atau Penanggung Jawab..."
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-5"><div className="h-8 bg-slate-200 rounded w-24"></div></td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-2">
                      <div className="h-4 bg-slate-200 rounded w-32"></div>
                      <div className="h-3 bg-slate-200 rounded w-20"></div>
                    </div>
                  </td>
                  <td className="py-4 px-5"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-2">
                      <div className="h-5 bg-slate-200 rounded w-28"></div>
                      <div className="h-5 bg-slate-200 rounded w-20"></div>
                    </div>
                  </td>
                  <td className="py-4 px-5"><div className="h-5 bg-slate-200 rounded w-20"></div></td>
                  <td className="py-4 px-5"><div className="flex gap-2"><div className="h-5 bg-slate-200 rounded w-10"></div><div className="h-5 bg-slate-200 rounded w-10"></div></div></td>
                  <td className="py-4 px-5"><div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div></td>
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
                const totalPajak = String(item['Total Pajak Kendaraan'] || '-');
                
                // Masa Plat
                const masaPlat = String(item['Masa Plat'] || '-');
                
                // Dokumen
                const bpkb = String(item['Status BPKB'] || item['BPKB'] || '');
                const stnk = String(item['Status STNK'] || item['STNK'] || '');
                const isBpkbAda = bpkb && bpkb.toLowerCase() !== 'tidak ada' && bpkb.toLowerCase() !== 'kosong' && bpkb !== '-';
                const isStnkAda = stnk && stnk.toLowerCase() !== 'tidak ada' && stnk.toLowerCase() !== 'kosong' && stnk !== '-';

                return (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="inline-block bg-red-800 text-white font-bold px-3 py-1 rounded-md border-b-2 border-slate-900 tracking-widest shadow-sm whitespace-nowrap">
                        {platNomor}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col max-w-[180px] lg:max-w-[250px] truncate">
                        <span className="text-sm font-bold text-slate-800 truncate">{merk}</span>
                        <span className="text-xs text-slate-500 font-medium truncate">{jenis} • {tahun}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 max-w-[180px] lg:max-w-[250px] truncate">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                          {penanggungJawab.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700 truncate">{penanggungJawab}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1 max-w-[180px] lg:max-w-[250px]">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border max-w-max truncate ${isPajakMerah ? 'bg-rose-50 text-rose-600 border-rose-200' : isPajakHijau ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                          {statusPajak}
                        </span>
                        <span className="text-xs text-slate-500 truncate">Jatuh Tempo: {jatuhTempo}</span>
                        <span className="text-sm font-bold text-slate-700 truncate">{totalPajak.startsWith('Rp') ? totalPajak : totalPajak !== '-' && totalPajak !== '' ? `Rp. ${totalPajak}` : '-'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{masaPlat}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex gap-1.5">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${isStnkAda ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-50 text-rose-500'}`}>
                          STNK: {stnk || 'Tidak Ada'}
                        </span>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${isBpkbAda ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-50 text-rose-500'}`}>
                          BPKB: {bpkb || 'Tidak Ada'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-2">
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
                <td colSpan={7} className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Tidak ada data kendaraan yang ditemukan.</p>
                  
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalDetailKendaraan 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        data={selectedKendaraan} 
      />

      <ModalDetailKendaraan 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        data={selectedKendaraan} 
      />
    </div>
  );
};
