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
      case 'Selesai': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap';
      case 'Dalam Proses': return 'bg-amber-50 text-amber-700 border border-amber-200/50 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap';
      case 'Ditolak': return 'bg-rose-50 text-rose-700 border border-rose-200/50 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap';
      case 'Direvisi': return 'bg-orange-50 text-orange-700 border border-orange-200/50 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap';
      default: return 'bg-slate-50 text-slate-700 border border-slate-200/50 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap';
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString; // fallback
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }).format(date);
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px] md:min-w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pegawai</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Layanan</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">{sub.nama}</span>
                    <span className="text-xs text-slate-500 mt-0.5">NIP. {sub.nip}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    {sub.layanan}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                    {formatDate(sub.tanggal)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={getStatusColor(sub.status)}>
                    {sub.status === 'Selesai' ? 'SELESAI/SETUJU' : sub.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-1">
                    <button 
                      onClick={() => onEdit(sub)} 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Edit Data & Update Status"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onViewDetail(sub)} 
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="Lihat Detail & Berkas"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-slate-400 uppercase tracking-widest">Data laporan tidak ditemukan</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
