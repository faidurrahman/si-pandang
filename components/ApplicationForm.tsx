
import React, { useState } from 'react';
import { Service } from '../types';
import { SERVICES } from '../constants';

interface ApplicationFormProps {
  initialService: Service | null;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ initialService, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    nama: '',
    nip: '',
    layanan: initialService?.id || '',
    file: null as File | null
  });
  const [fileProcessing, setFileProcessing] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Result is "data:mimetype;base64,DATA"
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Silakan unggah berkas terlebih dahulu.");
      return;
    }

    setFileProcessing(true);
    try {
      const base64 = await fileToBase64(formData.file);
      const serviceTitle = SERVICES.find(s => s.id === formData.layanan)?.title || formData.layanan;
      
      const submissionData = {
        nama: formData.nama,
        nip: formData.nip,
        layanan: serviceTitle,
        filename: formData.file.name,
        mimetype: formData.file.type || 'application/octet-stream',
        file: base64
      };

      await onSubmit(submissionData);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Gagal memproses file. Silakan coba lagi.");
    } finally {
      setFileProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[2px]">
      <div className="bg-white rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-100 flex-shrink-0">
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0a192f] leading-tight">
                Formulir Pengajuan
              </h2>
              <p className="text-amber-500 text-[11px] font-bold mt-1 uppercase tracking-wide">
                {SERVICES.find(s => s.id === formData.layanan)?.title || 'Layanan Kepegawaian'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <hr className="mx-8 border-slate-100" />

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-[11px] font-bold text-[#0a192f] mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              required
              disabled={isSubmitting}
              placeholder="Masukkan nama lengkap Anda"
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-sm disabled:bg-slate-50"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
            />
          </div>

          {/* NIP */}
          <div>
            <label className="block text-[11px] font-bold text-[#0a192f] mb-2">
              NIP <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              required
              disabled={isSubmitting}
              placeholder="Masukkan NIP Anda"
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-sm disabled:bg-slate-50"
              value={formData.nip}
              onChange={(e) => setFormData({...formData, nip: e.target.value})}
            />
          </div>

          {/* Pilih Layanan */}
          <div>
            <label className="block text-[11px] font-bold text-[#0a192f] mb-2">
              Pilih Layanan <span className="text-red-500">*</span>
            </label>
            <select 
              required
              disabled={isSubmitting}
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-sm appearance-none disabled:bg-slate-50"
              value={formData.layanan}
              onChange={(e) => setFormData({...formData, layanan: e.target.value})}
            >
              {SERVICES.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          {/* Upload Berkas */}
          <div>
            <label className="block text-[11px] font-bold text-[#0a192f] mb-2">
              Upload Berkas <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input 
                type="file" 
                disabled={isSubmitting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
              />
              <div className={`w-full py-8 border-2 border-dashed ${formData.file ? 'border-emerald-400 bg-emerald-50/30' : 'border-amber-400/50 bg-amber-50/30'} rounded-2xl flex flex-col items-center justify-center group-hover:bg-amber-50 transition-colors`}>
                <div className={`${formData.file ? 'text-emerald-500' : 'text-amber-500'} mb-2`}>
                  {formData.file ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
                <p className="text-[11px] font-extrabold text-[#0a192f] mb-1 text-center px-4 truncate w-full">
                  {formData.file ? formData.file.name : 'Klik untuk upload berkas'}
                </p>
                <p className="text-[9px] text-slate-400 font-medium">
                  {formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOC, XLS, atau Gambar (Max 10MB)'}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button"
              disabled={isSubmitting || fileProcessing}
              onClick={onClose}
              className="py-4 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-xs transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || fileProcessing}
              className="py-4 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-amber-100 flex items-center justify-center transition-all disabled:opacity-50"
            >
              {(isSubmitting || fileProcessing) ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {fileProcessing ? 'Memproses...' : (isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
