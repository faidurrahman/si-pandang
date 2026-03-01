import React, { useState } from 'react';

interface AddPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

export const AddPegawaiModal: React.FC<AddPegawaiModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
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
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const handleSubmit = async () => {
    setError(null);
    if (!formData.nama || !formData.nip || !formData.pangkat || !formData.jabatan || !formData.tmtKgb || !formData.gajiPokok) {
      setError("Mohon lengkapi semua data teks.");
      return;
    }

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

      await onSubmit({
        nama: formData.nama,
        nip: formData.nip,
        pangkat: formData.pangkat,
        jabatan: formData.jabatan,
        tmtKgb: formData.tmtKgb,
        gajiPokok: formData.gajiPokok,
        files: processedFiles
      });
      
      // Reset form on success
      setFormData({
        nama: '', nip: '', pangkat: '', jabatan: '', tmtKgb: '', gajiPokok: '', fileSk: null, fileKgb: null
      });
    } catch (e) {
      console.error(e);
      setError("Terjadi kesalahan saat memproses data.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-xl font-bold text-slate-800">Tambah Pegawai Baru</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 pt-2 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap & Gelar</label>
            <input 
              type="text" 
              placeholder="Contoh: Budi Santoso, S.IP"
              value={formData.nama}
              onChange={(e) => setFormData({...formData, nama: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">NIP</label>
            <input 
              type="text" 
              placeholder="18 digit NIP"
              value={formData.nip}
              onChange={(e) => setFormData({...formData, nip: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Pangkat / Gol. Ruang</label>
              <input 
                type="text" 
                placeholder="Contoh: Penata Muda / III/a"
                value={formData.pangkat}
                onChange={(e) => setFormData({...formData, pangkat: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Jabatan</label>
              <input 
                type="text" 
                placeholder="Contoh: Staf Pelaksana"
                value={formData.jabatan}
                onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">TMT KGB Terakhir</label>
              <input 
                type="date" 
                value={formData.tmtKgb}
                onChange={(e) => setFormData({...formData, tmtKgb: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm text-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gaji Pokok Lama (Rp)</label>
              <input 
                type="text" 
                placeholder="Contoh: 3000000"
                value={formData.gajiPokok}
                onChange={(e) => setFormData({...formData, gajiPokok: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">SK Pangkat Terakhir</label>
              <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFormData({...formData, fileSk: e.target.files?.[0] || null})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">KGB Terakhir</label>
              <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFormData({...formData, fileKgb: e.target.files?.[0] || null})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg bg-[#5a4bfa] hover:bg-indigo-700 text-white font-medium transition-colors text-sm shadow-sm disabled:opacity-50 flex items-center"
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
              "Simpan Data"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
