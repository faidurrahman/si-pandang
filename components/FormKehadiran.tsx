import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Swal from 'sweetalert2';
import { APPS_SCRIPT_URL } from '../constants';

interface FormKehadiranProps {
  kegiatanId: string;
}

export const FormKehadiran: React.FC<FormKehadiranProps> = ({ kegiatanId }) => {
  const [nama, setNama] = useState('');
  const [instansi, setInstansi] = useState('');
  const [gender, setGender] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kegiatanDetails, setKegiatanDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data kegiatan
    const fetchKegiatan = async () => {
      try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getDataKegiatan`);
        const resultText = await response.text();
      let result: any = {};
      try { result = JSON.parse(resultText); } catch (e) { result = { status: resultText.includes("Success") ? "Success" : "Error" }; }
      if (result.data) {
          const rows = result.data.slice(1);
          const kegiatan = rows.find((row: any) => row[0] === kegiatanId);
          if (kegiatan) {
            setKegiatanDetails({
              id: kegiatan[0],
              nama: kegiatan[1],
              hariTanggal: kegiatan[2],
              waktu: kegiatan[3],
              tempat: kegiatan[4]
            });
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data kegiatan", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKegiatan();
  }, [kegiatanId]);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !instansi || !gender || !noHp) {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Mohon lengkapi semua field yang wajib.' });
      return;
    }
    
    if (sigCanvas.current?.isEmpty()) {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Mohon isi tanda tangan digital.' });
      return;
    }
    
    const ttdDataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    const base64Ttd = ttdDataUrl?.split(',')[1];
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: 'addDaftarHadir',
          id_kegiatan: kegiatanId,
          nama_lengkap: nama,
          instansi: instansi,
          gender: gender,
          no_hp: noHp,
          email: email,
          ttd_digital: base64Ttd
        })
      });
      
      const resultText = await response.text();
      let isSuccess = false;
      try {
        const result = JSON.parse(resultText);
        isSuccess = result.status === "Success" || result.status === "Success Insert" || !result.error;
      } catch (e) {
        isSuccess = resultText.includes("Success");
      }

      if (!isSuccess) {
        throw new Error(resultText || "Gagal menyimpan data ke server");
      }

      Swal.fire({
        icon: 'success',
        title: `Halo, ${nama}`,
        text: `Selamat datang di acara ${kegiatanDetails?.nama || 'Kegiatan'}`,
        confirmButtonColor: '#4F46E5',
        confirmButtonText: 'OK'
      });
      
      setNama('');
      setInstansi('');
      setGender('');
      setNoHp('');
      setEmail('');
      clearSignature();
    } catch (error: any) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal mengirim data. Silakan coba lagi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!kegiatanDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Kegiatan Tidak Ditemukan</h2>
          <p className="text-gray-500 text-sm">QR Code tidak valid atau kegiatan telah dihapus.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="relative z-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                  DAFTAR HADIR
                </h1>
                <h2 className="text-lg sm:text-xl font-medium text-blue-100 uppercase tracking-wide">
                  {kegiatanDetails.nama}
                </h2>
             </div>
          </div>
          
          {/* Info Kegiatan */}
          <div className="bg-blue-50 px-6 py-4 flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-blue-800 border-b border-blue-100">
             <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {kegiatanDetails.hariTanggal}
             </div>
             <div className="flex items-center hidden sm:flex">•</div>
             <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {kegiatanDetails.waktu}
             </div>
             <div className="flex items-center hidden sm:flex">•</div>
             <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {kegiatanDetails.tempat}
             </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instansi / Unit Kerja</label>
                  <input
                    type="text"
                    value={instansi}
                    onChange={(e) => setInstansi(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900"
                    placeholder="Masukkan instansi asal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900 appearance-none"
                  >
                    <option value="">-- Pilih Gender --</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">No. WhatsApp / HP</label>
                    <input
                      type="tel"
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email (opsional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900"
                      placeholder="email@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between items-end">
                    <span>Tanda Tangan Digital</span>
                    <button 
                      type="button" 
                      onClick={clearSignature}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Hapus TTD
                    </button>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden relative">
                    <SignatureCanvas 
                      ref={sigCanvas} 
                      penColor="black"
                      canvasProps={{ className: 'w-full h-48 cursor-crosshair' }} 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>Simpan Kehadiran</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
