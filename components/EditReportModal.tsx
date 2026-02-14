import React, { useState } from 'react';
import { Submission, SubmissionStatus } from '../types';
import { SERVICES } from '../constants';

interface EditReportModalProps {
  submission: Submission | null;
  onClose: () => void;
  onUpdate: (updatedData: any) => Promise<void>;
  isSubmitting: boolean;
}

export const EditReportModal: React.FC<EditReportModalProps> = ({ submission, onClose, onUpdate, isSubmitting }) => {
  if (!submission) return null;

  const [formData, setFormData] = useState({
    nama: submission.nama,
    nip: submission.nip,
    layanan: submission.layanan,
    status: submission.status
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({
      ...formData,
      id: submission.id // Mengirimkan ID unik untuk identifikasi baris di Sheets
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[2px]">
      <div className="bg-white rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8 pb-4 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-100 flex-shrink-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0a192f] leading-tight">Edit Data Laporan</h2>
              <p className="text-amber-500 text-[11px] font-bold mt-1 uppercase tracking-wide">ID: {submission.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <hr className="mx-8 border-slate-100" />

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-[11px] font-bold text-[#0a192f] mb-2">Nama Lengkap</label>
            <input 
              type="text"
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm disabled:bg-slate-50"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0a192f] mb-2">NIP</label>
            <input 
              type="text"
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm disabled:bg-slate-50"
              value={formData.nip}
              onChange={(e) => setFormData({...formData, nip: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0a192f] mb-2">Jenis Layanan</label>
            <select 
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm appearance-none disabled:bg-slate-50"
              value={SERVICES.find(s => s.title === formData.layanan)?.id || formData.layanan}
              onChange={(e) => {
                const selected = SERVICES.find(s => s.id === e.target.value);
                setFormData({...formData, layanan: selected ? selected.title : e.target.value});
              }}
            >
              {SERVICES.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0a192f] mb-2">Status Laporan</label>
            <select 
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm appearance-none disabled:bg-slate-50"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as SubmissionStatus})}
            >
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Selesai">Selesai/Setuju</option>
              <option value="Direvisi">Direvisi</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="py-4 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-xs transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="py-4 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center transition-all disabled:opacity-50"
            >
              {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};