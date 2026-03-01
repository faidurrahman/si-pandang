import React, { useState, useEffect } from 'react';
import { PegawaiKGB } from '../types';

interface EditPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  pegawai: PegawaiKGB | null;
}

export const EditPegawaiModal: React.FC<EditPegawaiModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting, pegawai }) => {
  const [formData, setFormData] = useState({
    nama: '',
    nip: '',
    pangkat: '',
    jabatan: '',
    tmtKgb: '',
    gajiPokok: '',
    fileSk: null as File | null,
    fileKgb: null as File | null
  });

  useEffect(() => {
    if (pegawai) {
      setFormData({
        nama: pegawai.nama,
        nip: pegawai.nip,
        pangkat: pegawai.pangkat,
        jabatan: pegawai.jabatan,
        tmtKgb: pegawai.tmtKgb,
        gajiPokok: pegawai.gajiPokok,
        fileSk: null,
        fileKgb: null
      });
    }
  }, [pegawai]);

  if (!isOpen || !pegawai) return null;

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let processedFiles = [];
      if (formData.fileSk) {
        processedFiles.push({
          type: 'sk',
          filename: formData.fileSk.name,
          mimetype: formData.fileSk.type || 'application/octet-stream',
          data: await fileToBase64(formData.fileSk)
        });
      }
      if (formData.fileKgb) {
        processedFiles.push({
          type: 'kgb',
          filename: formData.fileKgb.name,
          mimetype: formData.fileKgb.type || 'application/octet-stream',
          data: await fileToBase64(formData.fileKgb)
        });
      }

      onSubmit({ 
        ...formData, 
        id: pegawai.id,
        files: processedFiles.length > 0 ? processedFiles : undefined
      });
    } catch (error) {
      console.error("Error processing files:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
      <div 
        className="absolute inset-0 bg-[#0a1e3b]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-[24px] md:rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#0a1e3b] tracking-tight">Edit Data Pegawai</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">Perbarui informasi pegawai</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0a1e3b] uppercase tracking-wider">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  placeholder="Contoh: Dr. H. Fulan, S.Sos., M.Si"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0a1e3b] uppercase tracking-wider">NIP</label>
                <input
                  type="text"
                  required
                  value={formData.nip}
                  onChange={(e) => setFormData({...formData, nip: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  placeholder="19xxxxxxxxxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0a1e3b] uppercase tracking-wider">Pangkat / Gol. Ruang</label>
                <input
                  type="text"
                  required
                  value={formData.pangkat}
                  onChange={(e) => setFormData({...formData, pangkat: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  placeholder="Contoh: Penata Muda / III.a"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0a1e3b] uppercase tracking-wider">Jabatan</label>
                <input
                  type="text"
                  required
                  value={formData.jabatan}
                  onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  placeholder="Contoh: Analis Kepegawaian"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0a1e3b] uppercase tracking-wider">TMT KGB Terakhir</label>
                <input
                  type="date"
                  required
                  value={formData.tmtKgb}
                  onChange={(e) => setFormData({...formData, tmtKgb: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0a1e3b] uppercase tracking-wider">Gaji Pokok Lama (Rp)</label>
                <input
                  type="text"
                  required
                  value={formData.gajiPokok}
                  onChange={(e) => setFormData({...formData, gajiPokok: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  placeholder="Contoh: 3.500.000"
                />
              </div>

              {/* File Uploads */}
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#0a1e3b] uppercase tracking-wider">SK Pangkat Terakhir</label>
                    {pegawai.skUrl && (
                      <a href={pegawai.skUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Lihat File Saat Ini
                      </a>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({...formData, fileSk: e.target.files?.[0] || null})}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  <p className="text-[10px] text-slate-400 italic">*Biarkan kosong jika tidak ingin mengubah file</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#0a1e3b] uppercase tracking-wider">SK KGB Terakhir</label>
                    {pegawai.kgbUrl && (
                      <a href={pegawai.kgbUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        Lihat File Saat Ini
                      </a>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData({...formData, fileKgb: e.target.files?.[0] || null})}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  <p className="text-[10px] text-slate-400 italic">*Biarkan kosong jika tidak ingin mengubah file</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-[#0a1e3b] text-white font-bold text-sm hover:bg-[#153059] transition-all shadow-lg shadow-blue-900/20 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
