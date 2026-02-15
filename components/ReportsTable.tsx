import React from 'react';
import { Submission, SubmissionStatus } from '../types';

interface ReportsTableProps {
  submissions: Array<Submission>;
  onViewDetail: (submission: Submission) => void;
  onEdit: (submission: Submission) => void;
}

export const ReportsTable: React.FC<ReportsTableProps> = ({ submissions, onViewDetail, onEdit }) => {
  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'Selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Dalam Proses': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Ditolak': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Direvisi': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-3xl border border-slate-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pegawai</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Layanan</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Tanggal</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {submissions.map((sub) => (
            <tr key={sub.id} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-6 py-5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0a192f]">{sub.nama}</span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">NIP. {sub.nip}</span>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold border border-blue-100">
                  {sub.layanan}
                </span>
              </td>
              <td className="px-6 py-5 text-center text-[11px] font-medium text-slate-500">
                {sub.tanggal}
              </td>
              <td className="px-6 py-5 text-center">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border inline-block min-w-[120px] ${getStatusColor(sub.status)}`}>
                  {sub.status === 'Selesai' ? 'Selesai/Setuju' : sub.status}
                </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center justify-center space-x-2">
                  <button 
                    onClick={() => onEdit(sub)} 
                    className="w-9 h-9 bg-amber-500 text-white rounded-xl flex items-center justify-center hover:bg-amber-600 transition-all shadow-sm active:scale-90" 
                    title="Edit Data & Update Status"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onViewDetail(sub)} 
                    className="w-9 h-9 bg-[#0a192f] text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-sm active:scale-90" 
                    title="Lihat Detail & Berkas"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {submissions.length === 0 && (
            <tr><td colSpan={5} className="px-6 py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Data laporan tidak ditemukan</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};