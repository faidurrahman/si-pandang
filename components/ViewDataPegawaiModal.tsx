import React from 'react';
import { DataPegawai } from '../types';

interface ViewDataPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  pegawai: DataPegawai | null;
}

export const ViewDataPegawaiModal: React.FC<ViewDataPegawaiModalProps> = ({ isOpen, onClose, pegawai }) => {
  if (!isOpen || !pegawai) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-[#0a1e3b] text-white">
          <h2 className="text-xl font-bold">Detail Data Pegawai</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Group 1: Profil */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-100 pb-2">Data Pribadi</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nama Lengkap</label>
                  <p className="text-sm font-bold text-slate-800 uppercase">{pegawai.nama || '-'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">NIP</label>
                  <p className="text-sm font-bold text-slate-800">{pegawai.nip || '-'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tempat, Tanggal Lahir</label>
                  <p className="text-sm font-bold text-slate-800 uppercase">{pegawai.tempatTanggalLahir || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Jenis Kelamin</label>
                    <p className="text-sm font-bold text-slate-800">{pegawai.jenisKelamin || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Agama</label>
                    <p className="text-sm font-bold text-slate-800">{pegawai.agama || '-'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Status Perkawinan</label>
                  <p className="text-sm font-bold text-slate-800">{pegawai.statusPerkawinan || '-'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Kontak</label>
                  <p className="text-sm font-bold text-slate-800">{pegawai.telp || '-'} / {pegawai.email || '-'}</p>
                </div>
              </div>
            </div>

            {/* Group 2: Kepegawaian */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-4 border-b border-amber-100 pb-2">Data Kepegawaian</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Jabatan (Eselon)</label>
                  <p className="text-sm font-bold text-slate-800">{pegawai.namaJabatan || '-'} {pegawai.eselon ? `(${pegawai.eselon})` : ''}</p>
                  <p className="text-xs text-slate-500 mt-1">TMT: {pegawai.tmtJabatan || '-'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Pangkat / Golongan</label>
                  <p className="text-sm font-bold text-slate-800">{pegawai.golonganPangkat || '-'} ({pegawai.golongan || '-'})</p>
                  <p className="text-xs text-slate-500 mt-1">TMT: {pegawai.tmtGolongan || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Status Pegawai</label>
                    <p className="text-sm font-bold text-slate-800">{pegawai.statusPegawai || '-'}</p>
                    <p className="text-xs text-slate-500 mt-1">TMT: {pegawai.tmtPegawai || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Masa Kerja</label>
                    <p className="text-sm font-bold text-slate-800">{pegawai.masaKerjaTahun} Tahun {pegawai.masaKerjaBulan} Bulan</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Unit Kerja</label>
                  <p className="text-sm font-bold text-slate-800 uppercase">{pegawai.unitKerja || '-'}</p>
                </div>
              </div>
            </div>
            
            {/* Group 3: Lainnya */}
            <div className="col-span-1 md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">Informasi Lainnya</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Pendidikan Awal - Akhir</label>
                      <p className="text-sm font-bold text-slate-800">{pegawai.pendidikanAwal || '-'} - {pegawai.pendidikanAkhir || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Alamat Rumah</label>
                      <p className="text-sm font-bold text-slate-800">{pegawai.alamatRumah || '-'}</p>
                      <p className="text-xs text-slate-500 mt-1">Kel. {pegawai.kelurahan || '-'}, Kec. {pegawai.kecamatan || '-'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">No Askes / No NPWP</label>
                      <p className="text-sm font-bold text-slate-800">{pegawai.noAskes || '-'} / {pegawai.noNpwp || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">No KTP</label>
                      <p className="text-sm font-bold text-slate-800">{pegawai.noKtp || '-'}</p>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-300 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
