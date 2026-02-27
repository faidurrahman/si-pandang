import React from 'react';

interface AddPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPegawaiModal: React.FC<AddPegawaiModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap & Gelar</label>
            <input 
              type="text" 
              placeholder="Contoh: Budi Santoso, S.IP"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">NIP</label>
            <input 
              type="text" 
              placeholder="18 digit NIP"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Pangkat / Gol. Ruang</label>
              <input 
                type="text" 
                placeholder="Contoh: Penata Muda / III/a"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Jabatan</label>
              <input 
                type="text" 
                placeholder="Contoh: Staf Pelaksana"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">TMT KGB Terakhir</label>
              <input 
                type="date" 
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-sm text-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gaji Pokok Lama (Rp)</label>
              <input 
                type="text" 
                placeholder="Contoh: 3000000"
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
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">KGB Terakhir</label>
              <input 
                type="file" 
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#5a4bfa] focus:ring-2 focus:ring-[#5a4bfa]/20 outline-none transition-all text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm"
          >
            Batal
          </button>
          <button 
            className="px-5 py-2.5 rounded-lg bg-[#5a4bfa] hover:bg-indigo-700 text-white font-medium transition-colors text-sm shadow-sm"
          >
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
};
