import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const LpjKegiatan: React.FC = () => {
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [tahunAnggaran, setTahunAnggaran] = useState(new Date().getFullYear().toString());
  const [photos, setPhotos] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const coverRef = useRef<HTMLDivElement>(null);

  const [previewScale, setPreviewScale] = useState(1);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const parentWidth = previewContainerRef.current.clientWidth;
        // 816px paper width + 48px padding (24px each side)
        const targetWidth = 864; 
        if (parentWidth > 0 && parentWidth < targetWidth) {
          setPreviewScale(parentWidth / targetWidth);
        } else {
          setPreviewScale(1);
        }
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const currentScale = isGenerating ? 1 : previewScale;
  
  const chunkArray = <T,>(arr: T[], size: number): T[][] => {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  const photoPages = chunkArray(photos, 6);

  const pagesCount = 1 + photoPages.length;
  const unscaledHeight = (pagesCount * 1344) + ((pagesCount - 1) * 32);
  const scaledHeight = unscaledHeight * currentScale;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPhotos = filesArray.map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrint = async () => {
    setIsGenerating(true);

    // Tunggu DOM update agar scale kembali ke 1 untuk html2canvas
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const pdf = new jsPDF('p', 'mm', 'legal');
      const legalWidth = 215.9;
      const legalHeight = 355.6;

      // 1. Capture Cover Page
      if (coverRef.current) {
        const coverCanvas = await html2canvas(coverRef.current, { scale: 2, useCORS: true });
        const coverImgData = coverCanvas.toDataURL('image/png');
        pdf.addImage(coverImgData, 'PNG', 0, 0, legalWidth, legalHeight);
      }

      // 2. Capture Dokumentasi Page (if photos exist)
      if (photos.length > 0) {
        const pages = document.querySelectorAll('.pdf-page-doc');
        for (let i = 0; i < pages.length; i++) {
          pdf.addPage();
          const pageCanvas = await html2canvas(pages[i] as HTMLElement, { scale: 2, useCORS: true });
          const pageImgData = pageCanvas.toDataURL('image/png');
          
          const imgProps = pdf.getImageProperties(pageImgData);
          const pdfHeight = (imgProps.height * legalWidth) / imgProps.width;
          
          pdf.addImage(pageImgData, 'PNG', 0, 0, legalWidth, pdfHeight);
        }
      }

      pdf.save(`LPJ_${judul || 'Kegiatan'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal menghasilkan PDF. Pastikan gambar yang diunggah valid.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Form Input Section (Hidden during print) */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 print:hidden">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Form LPJ Kegiatan
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Kegiatan</label>
              <textarea
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Rapat Koordinasi..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hari dan Tanggal</label>
              <input
                type="text"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                placeholder="Senin, 1 Januari 2025"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tahun Anggaran</label>
              <input
                type="text"
                value={tahunAnggaran}
                onChange={(e) => setTahunAnggaran(e.target.value)}
                placeholder="Contoh: 2025"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Upload Foto Dokumentasi</label>
              <div 
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg className="w-8 h-8 mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Klik untuk upload foto</span>
                <span className="text-xs text-slate-400 mt-1">(Bisa pilih banyak)</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Thumbnail Preview in Form */}
            {photos.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2">{photos.length} foto terpilih:</p>
                <div className="flex gap-2 flex-wrap">
                  {photos.map((src, idx) => (
                    <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                      <img src={src} alt="thumb" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-[10px] rounded-bl-md hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={handlePrint}
              disabled={!judul || !tanggal || isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-500/20"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyiapkan Dokumen...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak / Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Document Preview Section */}
      <div ref={previewContainerRef} className="w-full lg:w-2/3 bg-gray-200 py-8 flex flex-col items-center overflow-y-auto overflow-x-hidden">
        
        {/* Scaled Wrapper to fix layout height */}
        <div className="w-full flex justify-center transition-all duration-300" style={{ height: `${scaledHeight}px` }}>
          
          <div className="flex flex-col items-center gap-8 origin-top transition-transform duration-300"
               style={{ transform: `scale(${currentScale})`, width: '816px' }}>
            
            {/* Page 1: Cover */}
            <div ref={coverRef} className="bg-white shadow-lg box-border overflow-hidden w-[816px] h-[1344px] p-10 flex flex-col items-center text-center relative shrink-0"
                 style={{ backgroundColor: 'white' }}>
          <div className="pt-8 w-full">
            <h1 className="text-2xl font-black text-black uppercase leading-relaxed">
              LAPORAN PERTANGGUNG JAWABAN
            </h1>
            {judul && (
              <h2 className="text-xl font-bold text-black uppercase mt-2 whitespace-pre-wrap">
                {judul}
              </h2>
            )}
            {tanggal && (
              <h3 className="text-lg font-bold text-black uppercase mt-4">
                {tanggal}
              </h3>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center items-center w-full">
            {/* Logo Placeholder */}
            <img 
              src="https://lh3.googleusercontent.com/d/1dxwhUWW20e4w8BdOcrwaojHbz0GxGOwQ" 
              alt="Logo Makassar" 
              className="w-96 h-auto mx-auto mt-8 object-contain"
              crossOrigin="anonymous"
            />
          </div>

          <div className="mt-auto text-center pb-8 w-full">
            <p className="text-xl font-bold text-black uppercase">TAHUN ANGGARAN {tahunAnggaran}</p>
            <p className="text-xl font-bold text-black uppercase mt-1">KECAMATAN UJUNG PANDANG</p>
          </div>
        </div>

        {/* Page 2 and beyond: Dokumentasi Lapangan */}
        {photoPages.length > 0 && photoPages.map((pagePhotos, pageIndex) => (
          <div key={pageIndex} className="pdf-page-doc bg-white shadow-lg box-border overflow-hidden w-[816px] h-[1344px] p-10 flex flex-col shrink-0"
               style={{ backgroundColor: 'white' }}>
            <h2 className="text-xl font-bold text-black uppercase text-center underline whitespace-pre-wrap">
              DOKUMENTASI {pageIndex === 0 ? judul : ''}
            </h2>
            <div className="flex-1 min-h-0 mt-6 w-full">
              <div className="grid grid-cols-2 grid-rows-3 gap-6 h-full">
                {pagePhotos.map((src, index) => (
                  <div key={index} className="relative w-full h-full overflow-hidden rounded-md shadow-sm border border-slate-200 bg-slate-50">
                    <img src={src} alt={`Dokumentasi ${pageIndex * 6 + index + 1}`} className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

          </div>
        </div>
      </div>
      
      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: legal;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: white !important;
          }
          /* Hide everything except the print area */
          #root > div {
            display: none;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
