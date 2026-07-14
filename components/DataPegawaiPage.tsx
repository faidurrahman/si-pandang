import React, { useState, useEffect, useMemo } from 'react';
import { APPS_SCRIPT_URL } from '../constants';
import { DataPegawai } from '../types';
import { ViewDataPegawaiModal } from './ViewDataPegawaiModal';
import { EditDataPegawaiModal } from './EditDataPegawaiModal';

export const DataPegawaiPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10);
  const [data, setData] = useState<DataPegawai[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPegawai, setSelectedPegawai] = useState<DataPegawai | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeDateToISO = (val: any) => {
    if (!val) return '';
    try {
      let d = new Date(val);
      if (isNaN(d.getTime())) {
        if (typeof val === 'string') {
          const parts = val.split('-');
          if (parts.length === 3) {
             d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }
      }
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const calculateMasaKerjaFromNip = (nip: string) => {
    if (!nip || nip.length < 18) return null;
    const yearStr = nip.substring(8, 12);
    const monthStr = nip.substring(12, 14);
    
    const startYear = parseInt(yearStr, 10);
    const startMonth = parseInt(monthStr, 10);
    
    if (isNaN(startYear) || isNaN(startMonth) || startMonth < 1 || startMonth > 12) {
      return null;
    }
    
    const now = new Date();
    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth() + 1; // 1-12
    
    let diffYear = currentYear - startYear;
    let diffMonth = currentMonth - startMonth;
    
    if (diffMonth < 0) {
      diffYear -= 1;
      diffMonth += 12;
    }
    
    if (diffYear < 0) {
      diffYear = 0;
      diffMonth = 0;
    }
    
    return { tahun: diffYear, bulan: diffMonth };
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getDaftarPegawai&t=${new Date().getTime()}`);
      if (!response.ok) throw new Error("Gagal mengambil data dari server.");
      const result = await response.json();
      if (result.data && result.data.length > 1) {
        const rows = result.data.slice(1);
        const mapped: DataPegawai[] = rows.map((row: any[], index: number) => {
          const nipStr = String(row[3]).replace(/'/g, '').trim() || '';
          
          let masaTahun = Number(row[13]) || 0;
          let masaBulan = Number(row[14]) || 0;
          
          const masaNip = calculateMasaKerjaFromNip(nipStr);
          if (masaNip) {
            masaTahun = masaNip.tahun;
            masaBulan = masaNip.bulan;
          }
          
          return {
            id: nipStr || String(index),
            nama: row[1] || '',
            tempatTanggalLahir: row[2] || '',
            nip: nipStr,
            unitKerja: row[4] || '',
            golongan: row[5] || '',
            golonganPangkat: row[6] || '',
            tmtGolongan: safeDateToISO(row[7]),
            eselon: row[8] || '',
            namaJabatan: row[9] || '',
            tmtJabatan: safeDateToISO(row[10]),
            statusPegawai: row[11] || '',
            tmtPegawai: safeDateToISO(row[12]),
            masaKerjaTahun: masaTahun,
            masaKerjaBulan: masaBulan,
            jenisKelamin: row[15] || '',
            agama: row[16] || '',
            statusPerkawinan: row[17] || '',
            pendidikanAwal: row[18] || '',
            pendidikanAkhir: row[19] || '',
            noAskes: String(row[20]).replace(/'/g, '').trim() || '',
            noNpwp: String(row[21]).replace(/'/g, '').trim() || '',
            noKtp: String(row[22]).replace(/'/g, '').trim() || '',
            alamatRumah: row[23] || '',
            kelurahan: row[24] || '',
            kecamatan: row[25] || '',
            telp: String(row[26]).replace(/'/g, '').trim() || '',
            email: row[27] || ''
          };
        }).filter(p => p.nip); // Hanya masukkan jika ada NIP
        setData(mapped);
      } else {
        setData([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (formData: Partial<DataPegawai>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: 'updateDaftarPegawai',
          ...formData
        })
      });
      const resultText = await response.text();
      if (!resultText.includes("Success Update Daftar Pegawai")) {
        throw new Error(resultText || "Gagal mengupdate data.");
      }
      setIsEditModalOpen(false);
      setSelectedPegawai(null);
      await fetchData();
    } catch (error: any) {
      console.error("Update error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        return item.nama.toLowerCase().includes(lowerSearch) || 
               item.nip.toLowerCase().includes(lowerSearch) ||
               item.namaJabatan.toLowerCase().includes(lowerSearch);
      }
      return true;
    });
  }, [data, searchTerm]);

  const displayedData = filteredData.slice(0, entries);

  const formatDateStr = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const splitTempatTanggal = (val: string) => {
    if (!val) return { tempat: '', tanggal: '' };
    const parts = val.split(',');
    if (parts.length > 1) {
      return { tempat: parts[0].trim(), tanggal: parts.slice(1).join(',').trim() };
    }
    return { tempat: val, tanggal: '' };
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-normal text-gray-800">DAFTAR PEGAWAI</h1>
          <h2 className="text-2xl font-normal text-gray-800">SATUAN KERJA KECAMATAN UJUNG PANDANG</h2>
        </div>

        <div className="bg-white shadow-sm border border-gray-200">
          <div className="p-4 flex justify-between items-center border-b border-gray-200">
            <button onClick={fetchData} className="text-gray-600 hover:text-blue-600 flex items-center transition-colors text-sm">
              <svg className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm flex items-center transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download Data Pegawai
            </button>
          </div>

          <div className="p-4 flex justify-between items-center bg-gray-50 border-b border-gray-200 text-sm">
            <div className="flex items-center text-gray-600">
              <span>Show</span>
              <select 
                value={entries} 
                onChange={(e) => setEntries(Number(e.target.value))}
                className="mx-2 border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={1000}>All</option>
              </select>
              <span>entries</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="mr-2">Search:</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Nama / NIP..."
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-500">Memuat data pegawai...</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center text-red-500">
                {error}
              </div>
            ) : (
              <table className="w-full text-sm text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 border-b border-gray-200 text-[11px] uppercase">
                    <th className="p-3 border-r border-gray-200 font-bold" rowSpan={2}>NAMA/TEMPAT TGL LAHIR</th>
                    <th className="p-3 border-r border-gray-200 font-bold text-center" rowSpan={2}>NIP</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center border-b" colSpan={2}>PANGKAT</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center border-b" colSpan={2}>JABATAN</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center border-b" colSpan={2}>PEGAWAI</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center border-b" colSpan={2}>MASA KERJA</th>
                    <th className="p-3 font-bold text-center" rowSpan={2}>PILIHAN</th>
                  </tr>
                  <tr className="bg-gray-100 text-gray-600 border-b border-gray-200 text-[11px] uppercase">
                    <th className="p-2 border-r border-gray-200 font-bold text-center">GOL</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center">TMT GOL</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center">Nama</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center">TMT</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center">STATUS</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center">TMT</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center">THN</th>
                    <th className="p-2 border-r border-gray-200 font-bold text-center">BLN</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-10 text-center text-gray-500">Tidak ada data ditemukan.</td>
                    </tr>
                  ) : displayedData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 text-gray-700 text-xs">
                      <td className="p-3 border-r border-gray-200 leading-tight">
                        <div className="text-blue-600 font-medium uppercase mb-1">{item.nama}</div>
                        <div className="uppercase">{splitTempatTanggal(item.tempatTanggalLahir).tempat},{splitTempatTanggal(item.tempatTanggalLahir).tanggal}</div>
                      </td>
                      <td className="p-3 border-r border-gray-200 text-center whitespace-nowrap">{item.nip}</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.golonganPangkat} {item.golongan}</td>
                      <td className="p-3 border-r border-gray-200 text-center whitespace-nowrap">{formatDateStr(item.tmtGolongan)}</td>
                      <td className="p-3 border-r border-gray-200">{item.namaJabatan}</td>
                      <td className="p-3 border-r border-gray-200 text-center whitespace-nowrap">{formatDateStr(item.tmtJabatan)}</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.statusPegawai}</td>
                      <td className="p-3 border-r border-gray-200 text-center whitespace-nowrap">{formatDateStr(item.tmtPegawai)}</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.masaKerjaTahun}</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.masaKerjaBulan}</td>
                      <td className="p-3 text-center align-middle">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <button 
                            onClick={() => { setSelectedPegawai(item); setIsViewModalOpen(true); }}
                            className="text-blue-500 hover:text-blue-700 flex items-center text-xs w-full justify-center"
                          >
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            View
                          </button>
                          <button 
                            onClick={() => { setSelectedPegawai(item); setIsEditModalOpen(true); }}
                            className="text-orange-500 hover:text-orange-700 flex items-center text-xs w-full justify-center"
                          >
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between">
            <span>Showing {displayedData.length} entries (Total: {filteredData.length})</span>
          </div>
        </div>

      </div>

      <ViewDataPegawaiModal 
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setSelectedPegawai(null); }}
        pegawai={selectedPegawai}
      />

      <EditDataPegawaiModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedPegawai(null); }}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        pegawai={selectedPegawai}
      />
    </div>
  );
};
