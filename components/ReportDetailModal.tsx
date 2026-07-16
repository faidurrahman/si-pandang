import React from 'react';
import { Submission } from '../types';

interface ReportDetailModalProps {
  submission: Submission | null;
  onClose: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ submission, onClose }) => {
  if (!submission) return null;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return isoString;
    }
  };

  const files = submission.additionalFiles && submission.additionalFiles.length > 0 
    ? submission.additionalFiles 
    : [{ filename: submission.filename, url: submission.fileUrl }];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Close (Sticky) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header - Fixed */}
        <div className="relative h-24 bg-gradient-to-r from-[#0a1e3b] to-[#1a3a6b] flex items-center px-6 flex-shrink-0">
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
             <h2 className="text-white font-bold text-lg uppercase tracking-tight">Detail Usulan</h2>
             <p className="text-amber-400 text-xs font-semibold opacity-90 mt-0.5">ID Transaksi: {submission.id}</p>
           </div>
        </div>

        {/* Body - Scrollable */}
        <div className="overflow-y-auto p-6 custom-scrollbar flex-1">
          <div className="space-y-6">
            {/* User Section */}
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-lg font-bold text-slate-700">{submission.nama.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">{submission.nama}</h3>
                <p className="text-xs text-slate-500 mt-0.5">NIP. {submission.nip}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Jenis Layanan</p>
                <p className="text-sm font-bold text-slate-800">{submission.layanan}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tanggal Masuk</p>
                <p className="text-sm font-bold text-slate-800">{formatDate(submission.tanggal)}</p>
              </div>
            </div>

            {/* Berkas Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-1 h-4 bg-amber-400 rounded-full"></div>
                <h3 className="text-sm font-bold text-slate-800">Berkas Lampiran</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {files.map((file, idx) => (
                  <a 
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-colors group cursor-pointer"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500 group-hover:text-blue-600 transition-colors flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-700 transition-colors">
                        {file.filename}
                      </p>
                      <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mt-0.5">
                        Buka Berkas ↗
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t border-slate-100 flex-shrink-0 bg-white">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
};
