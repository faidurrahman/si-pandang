import React, { useEffect } from 'react';

interface ModalDetailKendaraanProps {
  isOpen: boolean;
  onClose: () => void;
  data: any; 
}

export const ModalDetailKendaraan: React.FC<ModalDetailKendaraanProps> = ({ isOpen, onClose, data }) => {
  const formatImageUrl = (url: string) => {
    if (!url) return '';
    const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  const platNomor = data['Polisi'] || data['Plat Nomor'] || '-';
  const merkTipe = data['Merk'] || data['Merk/Tipe'] || '-';
  const driver = data['Status Pajak'] || data['Driver'] || '-';
  
  const totalPajak = data['Tanggal Pajak'] || data['Total Pajak Kendaraan'] || '-';
  const formatRupiah = (val: any) => {
    if (!val || val === '-') return '-';
    const strVal = String(val).replace(/[^0-9]/g, '');
    if (!strVal) return val;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(strVal));
  };
  const totalPajakFormatted = String(totalPajak).toLowerCase().includes('rp') ? totalPajak : (totalPajak !== '-' ? formatRupiah(totalPajak) : '-');

  const jatuhTempo = data['Jatuh Tempo Pajak Tahunan'] || data['Jatuh Tempo'] || data['Tanggal Pajak'] || '-';
  
  const statusPajakRaw = data['Status Pajak'] || data['Status'] || '-';
  const isPajakAman = String(statusPajakRaw).toLowerCase().includes('lunas') || String(statusPajakRaw).toLowerCase().includes('aman') || String(statusPajakRaw).toLowerCase().includes('aktif');

  const tahunGantiPlat = data['Jatuh Tempo Plat'] || data['Tahun Ganti Plat'] || data['Masa Plat'] || '-';
  const statusKendaraan = data['Status'] || data['Status Kendaraan'] || data['Keterangan'] || '-';
  
  const stnkRaw = data['Status STNK'] || data['STNK'] || '';
  const isStnkAda = String(stnkRaw).toLowerCase() === 'ada' || stnkRaw === true || String(stnkRaw).toLowerCase() === 'ya' || String(stnkRaw).toLowerCase() === 'ada asli';

  const bpkbRaw = data['Status BPKB'] || data['BPKB'] || '';
  const isBpkbAda = String(bpkbRaw).toLowerCase() === 'ada' || bpkbRaw === true || String(bpkbRaw).toLowerCase() === 'ya' || String(bpkbRaw).toLowerCase() === 'ada asli';

  // Fungsi pencari properti yang lebih robust
  const findProp = (obj, keywords) => {
    if (!obj) return '';
    for (let key in obj) {
      const k = key.toLowerCase();
      if (keywords.some(kw => k.includes(kw))) {
        if (typeof obj[key] === 'string' && (obj[key].startsWith('http') || obj[key].startsWith('data:'))) {
           return obj[key];
        }
      }
    }
    return '';
  };

  const fotoUrl = data['fotoUrl'] || data['Foto Kendaraan'] || data['Foto'] || findProp(data, ['foto', 'kendaraan']);
  const stnkUrl = data['stnkUrl'] || data['Scan STNK'] || findProp(data, ['stnk']);
  const bpkbUrl = data['bpkbUrl'] || data['Scan BPKB'] || findProp(data, ['bpkb']);

  const InfoItem = ({ label, value, customValue }: { label: string, value?: string, customValue?: React.ReactNode }) => (
    <div className="flex flex-col border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</span>
      {customValue ? customValue : <span className="text-sm font-bold text-slate-800">{value}</span>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Card Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Sticky Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all z-10 shadow-sm border border-slate-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
          
          {/* Header Modal (Identitas Utama) */}
          <div className="mb-8 text-center md:text-left">
            <div className="bg-red-800 text-white font-extrabold text-2xl md:text-3xl px-6 py-2 rounded-lg border-b-4 border-slate-900 inline-block mb-4 shadow-md tracking-wider uppercase">
              {platNomor}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">{merkTipe}</h2>
            <div className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center mt-3 border border-slate-200 shadow-sm">
              <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Driver / Penanggung Jawab: <span className="font-bold ml-1 text-slate-700">{driver}</span>
            </div>
          </div>

          {/* Grid Informasi Penting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            {/* Kolom Kiri (Informasi Pajak) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Informasi Pajak
              </h3>
              <InfoItem label="Total Pajak Kendaraan" value={totalPajakFormatted} />
              <InfoItem label="Jatuh Tempo Pajak Tahunan" value={jatuhTempo} />
              <InfoItem 
                label="Status Pajak" 
                customValue={
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border max-w-max ${isPajakAman ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {statusPajakRaw}
                  </span>
                }
              />
              <InfoItem label="Jatuh Tempo Plat" value={tahunGantiPlat} />
            </div>

            {/* Kolom Kanan (Informasi Dokumen & Status) */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status & Dokumen
              </h3>
              <InfoItem label="Status Kendaraan" value={statusKendaraan} />
              <InfoItem 
                label="Keberadaan BPKB" 
                customValue={
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border max-w-max ${isBpkbAda ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {isBpkbAda ? 'Ada' : 'Tidak Ada'}
                  </span>
                }
              />
              <InfoItem 
                label="Keberadaan STNK" 
                customValue={
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border max-w-max ${isStnkAda ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {isStnkAda ? 'Ada' : 'Tidak Ada'}
                  </span>
                }
              />
            </div>
          </div>

          {/* Section Arsip Digital (Gambar/Dokumen) */}
          <div className="mt-10">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Arsip Dokumen Fisik
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Kotak 1: Foto Kendaraan */}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Foto Kendaraan</span>
                <div className="aspect-video bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-200 overflow-hidden shadow-inner relative group">
                  {fotoUrl ? (
                    <a href={fotoUrl} target="_blank" rel="noreferrer" className="w-full h-full block">
                      <img src={formatImageUrl(fotoUrl)} alt="Foto Kendaraan" className="w-full h-full object-cover transition-opacity hover:opacity-90" />
                    </a>
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-medium">Tidak ada gambar</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Kotak 2: Scan STNK */}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Scan STNK</span>
                <div className="aspect-video bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-200 overflow-hidden shadow-inner relative group hover:bg-slate-100 transition-colors">
                  {stnkUrl ? (
                    <a href={stnkUrl} target="_blank" rel="noreferrer" className="w-full h-full flex flex-col items-center justify-center p-4">
                      <svg className="w-10 h-10 mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      <span className="text-sm font-semibold text-blue-600 text-center hover:underline">Lihat STNK</span>
                    </a>
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center pointer-events-none">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs font-medium">Tidak ada dokumen</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Kotak 3: Scan BPKB */}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Scan BPKB</span>
                <div className="aspect-video bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-200 overflow-hidden shadow-inner relative group hover:bg-slate-100 transition-colors">
                  {bpkbUrl ? (
                    <a href={bpkbUrl} target="_blank" rel="noreferrer" className="w-full h-full flex flex-col items-center justify-center p-4">
                      <svg className="w-10 h-10 mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      <span className="text-sm font-semibold text-blue-600 text-center hover:underline">Lihat BPKB</span>
                    </a>
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-xs font-medium">Tidak ada dokumen</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
