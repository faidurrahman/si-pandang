import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { AddPegawaiModal } from './AddPegawaiModal';
import { EditPegawaiModal } from './EditPegawaiModal';
import { ViewPegawaiModal } from './ViewPegawaiModal';
import { APPS_SCRIPT_URL } from '../constants';
import { PegawaiKGB } from '../types';

export const PantauKGB: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pegawaiList, setPegawaiList] = useState<PegawaiKGB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedPegawai, setSelectedPegawai] = useState<PegawaiKGB | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Aman' | 'Mendekati' | 'Lewat Jadwal'>('All');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Data
  const fetchPegawai = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      console.log("Fetching KGB data from:", `${APPS_SCRIPT_URL}?action=getKGB`);
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getKGB&t=${new Date().getTime()}`, {
        method: "GET",
      });
      
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const text = await response.text();
      console.log("Response text (first 100 chars):", text.substring(0, 100));
      
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", text);
        throw new Error("Format data tidak valid. Pastikan Apps Script telah di-deploy ulang.");
      }
      
      if (json.data && json.data.length > 0) { // Check if we have data
        const isArrOfArr = Array.isArray(json.data[0]);
        const rows = isArrOfArr ? json.data.slice(1) : json.data;
        const mappedData: PegawaiKGB[] = rows.map((row: any) => {
          const isArr = Array.isArray(row);
          const tmtStr = isArr ? (row[6] ? String(row[6]) : '') : (row['tmtKgb'] || row['TMT Terakhir'] || row['TMT'] || '');
          const { status, jadwal } = calculateStatus(tmtStr);
          
          return {
            id: String(isArr ? row[0] : (row['id'] || row['No'] || '')),
            timestamp: String(isArr ? row[1] : (row['timestamp'] || row['Timestamp'] || '')),
            nama: String(isArr ? row[2] : (row['nama'] || row['Nama'] || '')),
            nip: String(isArr ? row[3] : (row['nip'] || row['NIP'] || '')).replace(/^'/, ''),
            pangkat: String(isArr ? row[4] : (row['pangkat'] || row['Pangkat/Jabatan'] || row['Pangkat'] || '')),
            jabatan: String(isArr ? row[5] : (row['jabatan'] || row['Jabatan'] || '')),
            tmtKgb: tmtStr,
            gajiPokok: String(isArr ? row[7] : (row['gaji'] || row['Gaji Pokok Terakhir'] || row['Gaji'] || '')),
            skUrl: String(isArr ? row[8] : (row['skUrl'] || row['Upload SK Terakhir'] || row['SK'] || '')),
            kgbUrl: String(isArr ? row[9] : (row['kgbUrl'] || row['Upload KGB Terakhir'] || row['KGB'] || '')),
            jadwalBerikutnya: jadwal,
            status: status as 'Aman' | 'Mendekati' | 'Lewat Jadwal'
          };
        });
        setPegawaiList(mappedData);
      } else {
        setPegawaiList([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch KGB data detail:", error);
      setFetchError(error.message || "Gagal mengambil data dari server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  // Helper: Calculate Status
  const calculateStatus = (tmtDateStr: string) => {
    if (!tmtDateStr) return { status: 'Aman', jadwal: '-' };
    
    // Handle date format if necessary, assuming YYYY-MM-DD or standard JS date string
    const tmt = new Date(tmtDateStr);
    if (isNaN(tmt.getTime())) return { status: 'Aman', jadwal: '-' };

    const nextKGB = new Date(tmt);
    nextKGB.setFullYear(nextKGB.getFullYear() + 2); // + 2 tahun
    
    const today = new Date();
    // Reset hours to compare dates only
    today.setHours(0, 0, 0, 0);
    const nextKGBCompare = new Date(nextKGB);
    nextKGBCompare.setHours(0, 0, 0, 0);

    const diffTime = nextKGBCompare.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let status = 'Aman';
    
    if (diffDays < 0) {
      status = 'Lewat Jadwal';
    } else if (diffDays <= 90) { // 3 bulan approx
      status = 'Mendekati';
    }
    
    return { 
      status, 
      jadwal: nextKGB.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  };

  // Statistics
  const stats = useMemo(() => {
    return {
      total: pegawaiList.length,
      aman: pegawaiList.filter(p => p.status === 'Aman').length,
      mendekati: pegawaiList.filter(p => p.status === 'Mendekati').length,
      lewat: pegawaiList.filter(p => p.status === 'Lewat Jadwal').length
    };
  }, [pegawaiList]);

  // Filtered List
  const filteredPegawai = useMemo(() => {
    return pegawaiList.filter(p => {
      const matchesSearch = p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.nip.includes(searchTerm);
      const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [pegawaiList, searchTerm, filterStatus]);

  // Pagination Logic
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, filterStatus]);

  const totalPages = Math.ceil(filteredPegawai.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPegawai.slice(start, start + itemsPerPage);
  }, [filteredPegawai, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handlers
  const handleAddPegawai = async (data: any) => {
    setIsSubmitting(true);
    const newId = `KGB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const now = new Date();
    const formattedDate = now.toISOString();

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: 'addPegawai',
          id: newId,
          timestamp: formattedDate,
          ...data
        })
      });
      
      const resultText = await response.text();
      console.log("Add Pegawai Response:", resultText);
      
      if (!resultText.includes("Success Insert KGB")) {
        throw new Error(resultText || "Gagal menyimpan ke sheet KGB. Pastikan Apps Script sudah di-deploy ulang.");
      }
      
      setIsSubmitting(false);
      setIsAddModalOpen(false);
      
      // Success Alert
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data pegawai berhasil disimpan.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0a1e3b',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl px-6 py-2.5 font-bold'
        }
      }).then(() => {
        // Refresh data immediately after closing alert
        fetchPegawai();
      });

    } catch (error: any) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      
      // Extract the error message, limiting length if it's an HTML error page
      let errorMessage = error.message || 'Terjadi kesalahan saat menyimpan data.';
      if (errorMessage.length > 200) {
        errorMessage = errorMessage.substring(0, 200) + '...';
      }

      Swal.fire({
        title: 'Gagal!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data pegawai ini?')) return;
    
    // Optimistic update
    setPegawaiList(prev => prev.filter(p => p.id !== id));

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: 'deletePegawai',
          id: id
        })
      });
      
      const resultText = await response.text();
      if (!resultText.includes("Success Delete KGB")) {
        throw new Error(resultText || "Gagal menghapus data di sheet KGB.");
      }
      
      // Refresh to sync
      setTimeout(fetchPegawai, 2000);
    } catch (error: any) {
      console.error("Delete error:", error);
      fetchPegawai(); // Revert on error
      
      let errorMessage = error.message || 'Terjadi kesalahan saat menghapus data.';
      if (errorMessage.length > 200) {
        errorMessage = errorMessage.substring(0, 200) + '...';
      }

      Swal.fire({
        title: 'Gagal!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleUpdate = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: 'updatePegawai',
          ...data
        })
      });
      
      const resultText = await response.text();
      if (!resultText.includes("Success Update KGB")) {
        throw new Error(resultText || "Gagal mengupdate data di sheet KGB.");
      }
      
      setIsSubmitting(false);
      setIsEditModalOpen(false);
      setSelectedPegawai(null);
      setTimeout(fetchPegawai, 2000);
    } catch (error: any) {
      console.error("Update error:", error);
      setIsSubmitting(false);
      
      let errorMessage = error.message || 'Terjadi kesalahan saat mengupdate data.';
      if (errorMessage.length > 200) {
        errorMessage = errorMessage.substring(0, 200) + '...';
      }

      Swal.fire({
        title: 'Gagal!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0a1e3b]">Sistem Pantau KGB ASN</h2>
          <p className="text-slate-400 text-[10px] md:text-xs font-medium mt-1">Kecamatan Ujung Pandang</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchPegawai}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            title="Refresh Data"
          >
            <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative z-10 pb-20">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total Pegawai */}
          <div 
            onClick={() => setFilterStatus('All')}
            className={`bg-white rounded-xl shadow-sm border p-6 flex items-center space-x-4 cursor-pointer transition-all duration-200 hover:shadow-md ${filterStatus === 'All' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-100 hover:border-blue-200'}`}
          >
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Pegawai</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
            </div>
          </div>

          {/* Aman */}
          <div 
            onClick={() => setFilterStatus('Aman')}
            className={`bg-white rounded-xl shadow-sm border p-6 flex items-center space-x-4 cursor-pointer transition-all duration-200 hover:shadow-md ${filterStatus === 'Aman' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-100 hover:border-emerald-200'}`}
          >
            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Aman (&gt; 3 Bulan)</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.aman}</h3>
            </div>
          </div>

          {/* Mendekati */}
          <div 
            onClick={() => setFilterStatus('Mendekati')}
            className={`bg-white rounded-xl shadow-sm border p-6 flex items-center space-x-4 relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${filterStatus === 'Mendekati' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-100 hover:border-amber-200'}`}
          >
            {stats.mendekati > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full animate-ping m-2"></div>}
            <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Mendekati (&le; 3 Bulan)</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.mendekati}</h3>
            </div>
          </div>

          {/* Lewat Jadwal */}
          <div 
            onClick={() => setFilterStatus('Lewat Jadwal')}
            className={`bg-white rounded-xl shadow-sm border p-6 flex items-center space-x-4 relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${filterStatus === 'Lewat Jadwal' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-100 hover:border-red-200'}`}
          >
             {stats.lewat > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping m-2"></div>}
            <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Lewat Jadwal</p>
              <h3 className="text-2xl font-bold text-slate-800">{stats.lewat}</h3>
            </div>
          </div>
        </div>

        {/* Notifikasi Banner (Jika ada yang mendekati atau lewat) */}
        {(stats.mendekati > 0 || stats.lewat > 0) && (
          <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm animate-in slide-in-from-top-2">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wide">Perhatian Diperlukan</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    Terdapat <strong>{stats.mendekati} pegawai</strong> mendekati jadwal KGB dan <strong>{stats.lewat} pegawai</strong> telah melewati jadwal.
                    Mohon segera proses berkas terkait.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800">Daftar Pegawai & Jadwal KGB</h2>
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                <span>Show</span>
                <select 
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-transparent font-bold outline-none border-b border-slate-300 focus:border-blue-500 px-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
              <input 
                type="text" 
                placeholder="Cari Nama / NIP..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-full md:w-64"
              />
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#5a4bfa] hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center w-full md:w-auto"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Pegawai
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">NAMA & NIP</th>
                  <th className="px-6 py-4">PANGKAT/JABATAN</th>
                  <th className="px-6 py-4">TMT TERAKHIR</th>
                  <th className="px-6 py-4">JADWAL BERIKUTNYA</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center space-x-2 text-slate-400">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                      <p className="mt-2 text-xs font-medium">Memuat data...</p>
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-red-500 font-medium bg-red-50 p-4 rounded-xl inline-block border border-red-100">
                        Error: {fetchError}
                      </div>
                    </td>
                  </tr>
                ) : filteredPegawai.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      {searchTerm ? 'Tidak ditemukan data yang cocok.' : 'Belum ada data pegawai. Silakan tambah data baru.'}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((pegawai) => (
                    <tr key={pegawai.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{pegawai.nama}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{pegawai.nip}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700">{pegawai.pangkat}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{pegawai.jabatan}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {pegawai.tmtKgb ? new Date(pegawai.tmtKgb).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        {pegawai.jadwalBerikutnya}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                          ${pegawai.status === 'Aman' ? 'bg-emerald-100 text-emerald-700' : 
                            pegawai.status === 'Mendekati' ? 'bg-amber-100 text-amber-700' : 
                            'bg-red-100 text-red-700'}`}>
                          {pegawai.status === 'Aman' && <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                          {pegawai.status === 'Mendekati' && <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          {pegawai.status === 'Lewat Jadwal' && <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                          {pegawai.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => { setSelectedPegawai(pegawai); setIsViewModalOpen(true); }}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Lihat Detail"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => { setSelectedPegawai(pegawai); setIsEditModalOpen(true); }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(pegawai.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {filteredPegawai.length > 0 && (
            <div className="p-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-medium">
                Menampilkan <span className="font-bold text-slate-700">{((currentPage - 1) * itemsPerPage) + 1}</span> sampai <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredPegawai.length)}</span> dari <span className="font-bold text-slate-700">{filteredPegawai.length}</span> data
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {(() => {
                    const pages = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      if (currentPage <= 4) {
                        for (let i = 1; i <= 5; i++) pages.push(i);
                        pages.push('...');
                        pages.push(totalPages);
                      } else if (currentPage >= totalPages - 3) {
                        pages.push(1);
                        pages.push('...');
                        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                      } else {
                        pages.push(1);
                        pages.push('...');
                        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                        pages.push('...');
                        pages.push(totalPages);
                      }
                    }
                    return pages.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => typeof p === 'number' ? handlePageChange(p) : null}
                        disabled={p === '...'}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all
                          ${p === currentPage 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105' 
                            : p === '...' 
                              ? 'text-slate-400 cursor-default' 
                              : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm'
                          }`}
                      >
                        {p}
                      </button>
                    ));
                  })()}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddPegawaiModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddPegawai}
        isSubmitting={isSubmitting}
      />

      <EditPegawaiModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedPegawai(null); }}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        pegawai={selectedPegawai}
      />

      <ViewPegawaiModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setSelectedPegawai(null); }}
        pegawai={selectedPegawai}
      />
    </div>
  );
};
