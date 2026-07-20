import React, { useState, useEffect } from 'react';

interface ModalEditKendaraanProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  data: any | null;
}

export const ModalEditKendaraan: React.FC<ModalEditKendaraanProps> = ({ isOpen, onClose, onSubmit, isSubmitting, data }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      setFormData({});
    }
  }, [data]);

  if (!isOpen || !data) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, base64Key: string, fileNameKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setFormData((prev: any) => ({
        ...prev,
        [base64Key]: base64String,
        [fileNameKey]: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm";
  const labelClass = "block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Kendaraan</h2>
              <p className="text-sm font-medium opacity-90">Perbarui data kendaraan dinas</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>No</label>
              <input type="text" name="No" value={formData['No'] || ''} onChange={handleChange} className={inputClass} readOnly />
            </div>
            <div>
              <label className={labelClass}>Terdata SIMBAKDA</label>
              <select name="Terdata SIMBAKDA" value={formData['Terdata SIMBAKDA'] || ''} onChange={handleChange} className={inputClass}>
                <option value="">Pilih...</option>
                <option value="terdata">Terdata</option>
                <option value="tidak terdata">Tidak Terdata</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Polisi (Plat Nomor)</label>
              <input type="text" name="Polisi" value={formData['Polisi'] || ''} onChange={handleChange} className={inputClass} required />
            </div>
            
            <div>
              <label className={labelClass}>Kode Barang</label>
              <input type="text" name="Kode Barang" value={formData['Kode Barang'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Nama Barang</label>
              <input type="text" name="Nama Barang" value={formData['Nama Barang'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>No Register</label>
              <input type="text" name="No Register" value={formData['No Register'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            
            <div>
              <label className={labelClass}>Merk/Tipe</label>
              <input type="text" name="Merk/Tipe" value={formData['Merk/Tipe'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Ukuran/CC</label>
              <input type="text" name="Ukuran/CC" value={formData['Ukuran/CC'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bahan</label>
              <input type="text" name="Bahan" value={formData['Bahan'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            
            <div>
              <label className={labelClass}>Tahun Pembuatan</label>
              <input type="text" name="Tahun Pembuatan" value={formData['Tahun Pembuatan'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pabrik</label>
              <input type="text" name="Pabrik" value={formData['Pabrik'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Rangka</label>
              <input type="text" name="Rangka" value={formData['Rangka'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            
            <div>
              <label className={labelClass}>Mesin</label>
              <input type="text" name="Mesin" value={formData['Mesin'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Asal Usul</label>
              <input type="text" name="Asal Usul" value={formData['Asal Usul'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Keterangan</label>
              <input type="text" name="Keterangan" value={formData['Keterangan'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            
            <div className="lg:col-span-3 border-t border-slate-200 mt-2 pt-6 pb-2">
              <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wide">Pajak & Penanggung Jawab</h3>
            </div>
            
            <div>
              <label className={labelClass}>Total Pajak Kendaraan</label>
              <input type="text" name="Total Pajak Kendaraan" value={formData['Total Pajak Kendaraan'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Jatuh Tempo</label>
              <input type="text" name="Jatuh Tempo" value={formData['Jatuh Tempo'] || ''} onChange={handleChange} className={inputClass} placeholder="Contoh: 20 Jan 2018" />
            </div>
            <div>
              <label className={labelClass}>Jatuh Tempo Plat</label>
              <input type="text" name="Jatuh Tempo Plat" value={formData['Jatuh Tempo Plat'] || ''} onChange={handleChange} className={inputClass} placeholder="Contoh: 2029" />
            </div>
            <div>
              <label className={labelClass}>Status Pajak</label>
              <input type="text" name="Status Pajak" value={formData['Status Pajak'] || ''} onChange={handleChange} className={inputClass} placeholder="Contoh: Lunas / Belum Lunas" />
            </div>
            
            <div>
              <label className={labelClass}>Driver / Penanggung Jawab</label>
              <input type="text" name="Driver" value={formData['Driver'] || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Status BPKB</label>
              <select name="Status BPKB" value={formData['Status BPKB'] || ''} onChange={handleChange} className={inputClass}>
                <option value="">Pilih...</option>
                <option value="Ada Asli">Ada Asli</option>
                <option value="Ada">Ada</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status STNK</label>
              <select name="Status STNK" value={formData['Status STNK'] || ''} onChange={handleChange} className={inputClass}>
                <option value="">Pilih...</option>
                <option value="Ada Asli">Ada Asli</option>
                <option value="Ada">Ada</option>
                <option value="Tidak Ada">Tidak Ada</option>
              </select>
            </div>
            
            <div className="lg:col-span-3 border-t border-slate-200 mt-2 pt-6 pb-2">
              <h3 className="font-bold text-slate-800 text-sm mb-4 uppercase tracking-wide">Arsip Dokumen Fisik (Upload File)</h3>
            </div>
            
            <div>
              <label className={labelClass}>Foto Kendaraan</label>
              {(formData['fotoUrl'] || formData['Foto Kendaraan'] || formData['Foto']) && !formData.fotoKendaraanBase64 && (
                <div className="mb-2 text-xs text-blue-600 truncate"><a href={formData['fotoUrl'] || formData['Foto Kendaraan'] || formData['Foto']} target="_blank" rel="noreferrer" className="hover:underline">Lihat Foto Saat Ini</a></div>
              )}
              <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 transition-colors group">
                <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'fotoKendaraanBase64', 'fotoKendaraanName')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="text-center pointer-events-none">
                  <svg className="mx-auto h-6 w-6 text-slate-400 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  <p className="mt-1 text-xs text-slate-500 font-medium">Klik atau drag file ke sini</p>
                </div>
              </div>
              {formData.fotoKendaraanName && <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {formData.fotoKendaraanName}</div>}
            </div>
            <div>
              <label className={labelClass}>Scan STNK</label>
              {(formData['stnkUrl'] || formData['Scan STNK']) && !formData.stnkBase64 && (
                <div className="mb-2 text-xs text-blue-600 truncate"><a href={formData['stnkUrl'] || formData['Scan STNK']} target="_blank" rel="noreferrer" className="hover:underline">Lihat STNK Saat Ini</a></div>
              )}
              <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 transition-colors group">
                <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'stnkBase64', 'stnkName')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="text-center pointer-events-none">
                  <svg className="mx-auto h-6 w-6 text-slate-400 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  <p className="mt-1 text-xs text-slate-500 font-medium">Klik atau drag file ke sini</p>
                </div>
              </div>
              {formData.stnkName && <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {formData.stnkName}</div>}
            </div>
            <div>
              <label className={labelClass}>Scan BPKB</label>
              {(formData['bpkbUrl'] || formData['Scan BPKB']) && !formData.bpkbBase64 && (
                <div className="mb-2 text-xs text-blue-600 truncate"><a href={formData['bpkbUrl'] || formData['Scan BPKB']} target="_blank" rel="noreferrer" className="hover:underline">Lihat BPKB Saat Ini</a></div>
              )}
              <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 transition-colors group">
                <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'bpkbBase64', 'bpkbName')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="text-center pointer-events-none">
                  <svg className="mx-auto h-6 w-6 text-slate-400 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                  <p className="mt-1 text-xs text-slate-500 font-medium">Klik atau drag file ke sini</p>
                </div>
              </div>
              {formData.bpkbName && <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {formData.bpkbName}</div>}
            </div>

          </div>
          
          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
  );
};
