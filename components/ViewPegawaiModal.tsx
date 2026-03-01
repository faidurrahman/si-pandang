import React from 'react';
import { PegawaiKGB } from '../types';

interface ViewPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  pegawai: PegawaiKGB | null;
}

export const ViewPegawaiModal: React.FC<ViewPegawaiModalProps> = ({ isOpen, onClose, pegawai }) => {
  if (!isOpen || !pegawai) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Detail Pegawai</h2>
            <p className="text-slate-500 text-xs mt-1">Informasi lengkap dan berkas kepegawaian</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Group 1: Identitas */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-100 pb-2">Identitas Pegawai</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Nama Lengkap</label>
                  <div className="text-base font-semibold text-slate-800">{pegawai.nama}</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">NIP</label>
                  <div className="text-base font-mono font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded inline-block border border-slate-200">
                    {pegawai.nip}
                  </div>
                </div>
              </div>
            </div>

            {/* Group 2: Jabatan & Pangkat */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-100 pb-2">Jabatan & Pangkat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Jabatan</label>
                  <div className="text-sm font-medium text-slate-800">{pegawai.jabatan}</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Pangkat / Gol. Ruang</label>
                  <div className="text-sm font-medium text-slate-800">{pegawai.pangkat}</div>
                </div>
              </div>
            </div>

            {/* Group 3: Data KGB */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-100 pb-2">Data KGB</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">TMT KGB Terakhir</label>
                  <div className="text-sm font-medium text-slate-800">
                    {pegawai.tmtKgb ? new Date(pegawai.tmtKgb).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Gaji Pokok Lama</label>
                  <div className="text-sm font-medium text-slate-800">
                    Rp {parseInt(pegawai.gajiPokok || '0').toLocaleString('id-ID')}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Jadwal KGB Berikutnya</label>
                  <div className="text-sm font-bold text-blue-600">
                    {pegawai.jadwalBerikutnya}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                    ${pegawai.status === 'Aman' ? 'bg-emerald-100 text-emerald-700' : 
                      pegawai.status === 'Mendekati' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'}`}>
                    {pegawai.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Group 4: Berkas */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-100 pb-2">Berkas Kepegawaian</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SK Pangkat */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">SK Pangkat Terakhir</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Dokumen PDF/Gambar</p>
                      </div>
                    </div>
                    {pegawai.skUrl ? (
                      <a 
                        href={pegawai.skUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Lihat Dokumen"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic px-2 py-1">Tidak ada file</span>
                    )}
                  </div>
                </div>

                {/* KGB Terakhir */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-blue-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">SK KGB Terakhir</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Dokumen PDF/Gambar</p>
                      </div>
                    </div>
                    {pegawai.kgbUrl ? (
                      <a 
                        href={pegawai.kgbUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Lihat Dokumen"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic px-2 py-1">Tidak ada file</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-900 transition-colors text-sm shadow-lg shadow-slate-900/20"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
