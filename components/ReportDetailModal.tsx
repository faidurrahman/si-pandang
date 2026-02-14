import React from 'react';
import { Submission } from '../types';

interface ReportDetailModalProps {
  submission: Submission | null;
  onClose: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ submission, onClose }) => {
  if (!submission) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[4px] animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] w-full max-w-[550px] overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-white/20">
        
        {/* Header Visual */}
        <div className="relative h-24 bg-gradient-to-r from-[#0a1e3b] to-[#1a3a6b] flex items-center px-8">
           <div className="absolute top-0 right-0 w-32 h-full opacity-10">
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-white">
                <path d="M0,0 L100,0 L100,100 Z" />
              </svg>
           </div>
           <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center text-white shadow-xl">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
           </div>
           <div className="ml-5">
             <h2 className="text-white font-black text-lg uppercase tracking-tight">Detail Usulan</h2>
             <p className="text-amber-400 text-[9px] font-bold uppercase tracking-widest opacity-80">ID Transaksi: {submission.id}</p>
           </div>
           <button 
             onClick={onClose}
             className="ml-auto p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>

        <div className="p-8 space-y-8">
          {/* User Section */}
          <div className="flex items-center space-x-5 p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-xl font-black text-[#0a192f]">{submission.nama.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-base font-black text-[#0a192f] leading-tight">{submission.nama}</h3>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.1em] mt-0.5">NIP. {submission.nip}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Jenis Layanan</p>
              <p className="text-xs font-bold text-[#0a192f]">{submission.layanan}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tanggal Masuk</p>
              <p className="text-xs font-bold text-[#0a192f]">{submission.tanggal}</p>
            </div>
          </div>

          {/* Berkas Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1 h-4 bg-amber-400 rounded-full"></div>
              <p className="text-[10px] font-black text-[#0a192f] uppercase tracking-[0.1em]">Berkas Lampiran</p>
            </div>
            
            <a 
              href={submission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-[#f0f7ff] rounded-2xl border border-blue-100 group hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-[11px] font-bold text-blue-900 group-hover:text-white transition-colors truncate max-w-[280px]">
                  {submission.filename}
                </p>
                <p className="text-[9px] font-medium text-blue-400 group-hover:text-blue-100 transition-colors uppercase">
                  Klik untuk membuka berkas
                </p>
              </div>
              <svg className="w-4 h-4 text-blue-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="p-8 pt-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
};