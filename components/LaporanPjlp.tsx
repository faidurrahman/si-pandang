import React, { useState, useRef } from 'react';

interface Petugas {
  id: string;
  nama: string;
  keterangan: string;
  fotos: string[]; // array of base64 images
}

export const LaporanPjlp: React.FC = () => {
  const [judul, setJudul] = useState('SATGAS PENYAPU TAMAN');
  const [instansi, setInstansi] = useState('KECAMATAN UJUNG PANDANG');
  const [periode, setPeriode] = useState('BULAN JUNI 2026');

  const [petugasList, setPetugasList] = useState<Petugas[]>([]);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleAddPetugas = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setPetugasList([...petugasList, { id: newId, nama: '', keterangan: '', fotos: [] }]);
  };

  const handleRemovePetugas = (id: string) => {
    setPetugasList(petugasList.filter(p => p.id !== id));
  };

  const handlePetugasChange = (id: string, field: keyof Petugas, value: any) => {
    setPetugasList(petugasList.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFotos: string[] = [];
    let processed = 0;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newFotos.push(event.target.result as string);
        }
        processed++;
        if (processed === files.length) {
          setPetugasList(prev => prev.map(p => p.id === id ? { ...p, fotos: [...p.fotos, ...newFotos] } : p));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFoto = (petugasId: string, fotoIndex: number) => {
    setPetugasList(prev => prev.map(p => {
      if (p.id === petugasId) {
        const newFotos = [...p.fotos];
        newFotos.splice(fotoIndex, 1);
        return { ...p, fotos: newFotos };
      }
      return p;
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      {/* Editor Section (Hidden on Print) */}
      <div className="print:hidden max-w-4xl mx-auto space-y-6">
        {/* Action Header */}
        <div className="flex justify-end">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download PDF
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Laporan PJLP / Satgas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Judul Laporan</label>
              <input type="text" value={judul} onChange={e => setJudul(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Instansi</label>
              <input type="text" value={instansi} onChange={e => setInstansi(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Periode</label>
              <input type="text" value={periode} onChange={e => setPeriode(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Daftar Petugas</h3>
            <button
              onClick={handleAddPetugas}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Tambah Petugas
            </button>
          </div>

          {petugasList.map((petugas, index) => (
            <div key={petugas.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative">
              <button 
                onClick={() => handleRemovePetugas(petugas.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
              
              <h4 className="font-bold text-slate-700 mb-4">Petugas #{index + 1}</h4>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Nama Petugas</label>
                <input type="text" value={petugas.nama} onChange={e => handlePetugasChange(petugas.id, 'nama', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500" placeholder="Contoh: Budi Santoso" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Foto Dokumentasi Kegiatan</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-3">
                  {petugas.fotos.map((foto, fIndex) => (
                    <div key={fIndex} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={foto} alt={`Dokumentasi ${fIndex + 1}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => handleRemoveFoto(petugas.id, fIndex)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                  <div 
                    onClick={() => fileInputRefs.current[petugas.id]?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span className="text-xs font-medium">Tambah Foto</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={el => fileInputRefs.current[petugas.id] = el}
                  onChange={(e) => handleImageUpload(petugas.id, e)}
                />
              </div>
            </div>
          ))}
          
          {petugasList.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500">Belum ada petugas yang ditambahkan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Print Section (Only visible on Print) */}
      <div className="hidden print:block w-full bg-white text-black font-sans">
        <style>{`
          @media print {
            @page { 
              size: 215mm 330mm; /* Ukuran Kertas F4/Legal */
              margin: 10mm 15mm; /* Atas/Bawah 10mm, Kiri/Kanan 15mm */
            }
            body { background: white; margin: 0; -webkit-print-color-adjust: exact; color-adjust: exact; }
            .page-break-container { 
              page-break-after: always; 
              page-break-inside: avoid;
              width: 100%;
              position: relative;
            }
            .page-break-container:last-child { page-break-after: auto; }
            .no-print { display: none !important; }
          }
        `}</style>
        
        {petugasList.map((petugas) => {
          // Chunk fotos into groups of 18 (3 cols x 6 rows)
          const MAX_PHOTOS = 18;
          const photoChunks = petugas.fotos.length > 0 
            ? petugas.fotos.reduce((acc, curr, i) => {
                if (i % MAX_PHOTOS === 0) acc.push([]);
                acc[acc.length - 1].push(curr);
                return acc;
              }, [] as string[][])
            : [[]]; // At least one empty chunk to render the page

          return photoChunks.map((chunk, chunkIndex) => (
            <div key={`${petugas.id}-page-${chunkIndex}`} className="page-break-container">
              {/* Header Global */}
              <div className="text-center font-sans font-bold leading-tight text-black uppercase mb-2">
                <h1 className="text-xl tracking-wider">{judul}</h1>
                <h2 className="text-lg mt-1">{instansi}</h2>
                <h3 className="text-base mt-1">{periode}</h3>
              </div>

              {/* Nama Petugas */}
              <div className="text-left font-bold text-lg uppercase text-black mb-1">
                {petugas.nama} {petugas.keterangan && `- ${petugas.keterangan}`}
              </div>

              {/* Grid Foto */}
              <div className="grid grid-cols-3 gap-2">
                {chunk.map((foto, index) => (
                  <div key={index} className="w-full aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={foto} 
                      alt={`Dokumentasi ${index}`} 
                      className="w-full h-full object-cover object-center" 
                    />
                  </div>
                ))}
                {chunk.length === 0 && (
                  <div className="w-full aspect-square border border-slate-300 border-dashed flex items-center justify-center text-slate-400 col-span-3">
                    Tidak ada foto dokumentasi
                  </div>
                )}
              </div>
            </div>
          ));
        })}
      </div>
    </div>
  );
};
