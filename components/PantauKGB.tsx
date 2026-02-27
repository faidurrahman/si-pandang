import React, { useState } from 'react';
import { AddPegawaiModal } from './AddPegawaiModal';

export const PantauKGB: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0a1e3b]">Sistem Pantau KGB ASN</h2>
          <p className="text-slate-400 text-[10px] md:text-xs font-medium mt-1">Kecamatan Ujung Pandang</p>
        </div>
      </div>

      <div className="relative z-10 pb-20">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total Pegawai */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Pegawai</p>
              <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
          </div>

          {/* Aman */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Aman (&gt; 3 Bulan)</p>
              <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
          </div>

          {/* Mendekati */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Mendekati (&le; 3 Bulan)</p>
              <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
          </div>

          {/* Lewat Jadwal */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Lewat Jadwal</p>
              <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-800">Daftar Pegawai & Jadwal KGB</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#5a4bfa] hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center w-max"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Pegawai
            </button>
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
              <tbody>
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Belum ada data pegawai. Silakan tambah data baru.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddPegawaiModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};
