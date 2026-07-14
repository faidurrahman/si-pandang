import React, { useState, useEffect } from 'react';
import { DataPegawai } from '../types';

interface EditDataPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DataPegawai>) => void;
  isSubmitting: boolean;
  pegawai: DataPegawai | null;
}

export const EditDataPegawaiModal: React.FC<EditDataPegawaiModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting, pegawai }) => {
  const [formData, setFormData] = useState<Partial<DataPegawai>>({});

  useEffect(() => {
    if (pegawai) {
      setFormData(pegawai);
    }
  }, [pegawai]);

  if (!isOpen || !pegawai) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-amber-500 text-white">
          <h2 className="text-xl font-bold">Edit Data Pegawai</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <form id="editForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Informasi Dasar</h3>
              
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nama Lengkap</label>
                <input type="text" name="nama" value={formData.nama || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm uppercase" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">NIP (Tidak dapat diubah)</label>
                <input type="text" value={formData.nip || ''} disabled className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-gray-100 text-sm" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tempat, Tanggal Lahir</label>
                <input type="text" name="tempatTanggalLahir" value={formData.tempatTanggalLahir || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm uppercase" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">No KTP</label>
                  <input type="text" name="noKtp" value={formData.noKtp || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">No NPWP</label>
                  <input type="text" name="noNpwp" value={formData.noNpwp || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Kepegawaian</h3>
              
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Jabatan & Eselon</label>
                <div className="flex gap-2">
                  <input type="text" name="namaJabatan" value={formData.namaJabatan || ''} onChange={handleChange} className="w-2/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Nama Jabatan" />
                  <input type="text" name="eselon" value={formData.eselon || ''} onChange={handleChange} className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Eselon" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">TMT Jabatan</label>
                <input type="date" name="tmtJabatan" value={formData.tmtJabatan || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Pangkat / Golongan</label>
                <div className="flex gap-2">
                  <input type="text" name="golonganPangkat" value={formData.golonganPangkat || ''} onChange={handleChange} className="w-2/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Pangkat" />
                  <input type="text" name="golongan" value={formData.golongan || ''} onChange={handleChange} className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Golongan" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">TMT Golongan</label>
                <input type="date" name="tmtGolongan" value={formData.tmtGolongan || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Kontak & Alamat</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">No. Telp / HP</label>
                  <input type="text" name="telp" value={formData.telp || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Alamat Rumah</label>
                <input type="text" name="alamatRumah" value={formData.alamatRumah || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Kelurahan</label>
                  <input type="text" name="kelurahan" value={formData.kelurahan || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Kecamatan</label>
                  <input type="text" name="kecamatan" value={formData.kecamatan || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-300 transition-colors"
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            type="submit"
            form="editForm"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-colors flex items-center"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
};
