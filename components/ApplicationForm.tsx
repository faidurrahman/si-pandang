
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
    files: [] as File[]
  });
  const [fileProcessing, setFileProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFile = (file: File) => {
    setFormData(prev => ({ ...prev, files: [...prev.files, file] }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

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
    setError(null);
    if (formData.files.length === 0) {
      setError("Silakan unggah berkas terlebih dahulu.");
      return;
    }

    setFileProcessing(true);
    let submissionData;
    try {
      const processedFiles = await Promise.all(formData.files.map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          filename: file.name,
          mimetype: file.type || 'application/octet-stream',
          data: base64
        };
      }));

      const serviceTitle = SERVICES.find(s => s.id === formData.layanan)?.title || formData.layanan;
      
      submissionData = {
        nama: formData.nama,
        nip: formData.nip,
        layanan: serviceTitle,
        // Backward compatibility for single file
        filename: processedFiles[0].filename,
        mimetype: processedFiles[0].mimetype,
        file: processedFiles[0].data,
        // Multiple files support
        files: processedFiles.length > 1 ? processedFiles : undefined
      };
    } catch (error) {
      console.error("Error processing files:", error);
      setError("Gagal memproses berkas. Silakan coba lagi.");
      setFileProcessing(false);
      return;
    }

    setFileProcessing(false);
    if (submissionData) {
      await onSubmit(submissionData);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[2px]">
      <div className="bg-white rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 md:p-8 pb-3 md:pb-4 flex items-start justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-100 flex-shrink-0">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-[#0a192f] leading-tight">
                Formulir Pengajuan
              </h2>
              <p className="text-amber-500 text-[10px] md:text-[11px] font-bold mt-1 uppercase tracking-wide">
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

        <hr className="mx-6 md:mx-8 border-slate-100" />

        <form onSubmit={handleSubmit} className="p-6 md:p-8 pt-4 md:pt-6 space-y-3 md:space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center space-x-2 text-red-600 animate-in fade-in slide-in-from-top-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">{error}</span>
            </div>
          )}
          {/* Nama Lengkap */}
          <div>
            <label className="block text-[10px] md:text-[11px] font-bold text-[#0a192f] mb-1.5 md:mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              required
              disabled={isSubmitting}
              placeholder="Masukkan nama lengkap Anda"
              className="w-full px-4 md:px-5 py-2.5 md:py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-xs md:text-sm disabled:bg-slate-50"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
            />
          </div>

          {/* NIP */}
          <div>
            <label className="block text-[10px] md:text-[11px] font-bold text-[#0a192f] mb-1.5 md:mb-2">
              NIP <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              required
              disabled={isSubmitting}
              placeholder="Masukkan NIP Anda"
              className="w-full px-4 md:px-5 py-2.5 md:py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-xs md:text-sm disabled:bg-slate-50"
              value={formData.nip}
              onChange={(e) => setFormData({...formData, nip: e.target.value})}
            />
          </div>

          {/* Pilih Layanan */}
          <div>
            <label className="block text-[10px] md:text-[11px] font-bold text-[#0a192f] mb-1.5 md:mb-2">
              Pilih Layanan <span className="text-red-500">*</span>
            </label>
            <select 
              required
              disabled={isSubmitting}
              className="w-full px-4 md:px-5 py-2.5 md:py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-xs md:text-sm appearance-none disabled:bg-slate-50"
              value={formData.layanan}
              onChange={(e) => setFormData({...formData, layanan: e.target.value})}
            >
              {SERVICES.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          {/* Download Format Button if available */}
          {SERVICES.find(s => s.id === formData.layanan)?.downloadUrl && formData.layanan !== 'cuti' && (
            <div className="mb-4 p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div>
                <p className="text-[10px] md:text-[11px] font-bold text-blue-800">
                  Dokumen Persyaratan
                </p>
                <p className="text-[9px] md:text-[10px] text-blue-600 mt-0.5">
                  Unduh format dokumen yang diperlukan di sini.
                </p>
              </div>
              <a 
                href={SERVICES.find(s => s.id === formData.layanan)?.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-xs font-bold rounded-lg transition-colors flex items-center shadow-sm"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {SERVICES.find(s => s.id === formData.layanan)?.downloadLabel || 'Download Format'}
              </a>
            </div>
          )}

          {/* Upload Berkas */}
          <div>
            <label className="block text-[10px] md:text-[11px] font-bold text-[#0a192f] mb-1.5 md:mb-2">
              Upload Berkas <span className="text-red-500">*</span>
            </label>
            
            <div className="space-y-2">
              {/* List of uploaded files */}
              {formData.files.map((file, index) => (
                <div key={index} className="flex items-center p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-xl animate-in fade-in slide-in-from-left-2 duration-200">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mr-3 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#0a192f] truncate">{file.name}</p>
                    <p className="text-[8px] text-slate-400 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* New Empty Upload Box */}
              <div className="relative group">
                <input 
                  type="file" 
                  name="berkas[]"
                  disabled={isSubmitting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      addFile(file);
                      e.target.value = ''; // Reset to allow re-uploading same file if deleted
                    }
                  }}
                />
                <div className="w-full py-4 border-2 border-dashed border-amber-400/50 bg-amber-50/30 rounded-2xl flex flex-col items-center justify-center group-hover:bg-amber-50 transition-colors">
                  <div className="text-amber-500 mb-1.5">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-extrabold text-[#0a192f] mb-0.5 text-center px-4">
                    Klik untuk upload berkas
                  </p>
                  <p className="text-[8px] text-slate-400 font-medium">
                    PDF, DOC, XLS, atau Gambar (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-3 md:pt-4 border-t border-slate-100">
            <button 
              type="button"
              disabled={isSubmitting || fileProcessing}
              onClick={onClose}
              className="py-3 md:py-4 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl md:rounded-2xl font-bold text-xs transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || fileProcessing}
              className="py-3 md:py-4 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl md:rounded-2xl font-bold text-xs shadow-lg shadow-amber-100 flex items-center justify-center transition-all disabled:opacity-50"
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
