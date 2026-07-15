import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { APPS_SCRIPT_URL } from '../constants';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';

export const DaftarHadirAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'master' | 'rekap'>('master');
  
  // Master Kegiatan State
  const [kegiatans, setKegiatans] = useState<any[]>([]);
  const [isLoadingKegiatan, setIsLoadingKegiatan] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [hariTanggal, setHariTanggal] = useState('');
  const [waktu, setWaktu] = useState('');
  const [tempat, setTempat] = useState('');

  // Rekap State
  const [kehadirans, setKehadirans] = useState<any[]>([]);
  const [isLoadingRekap, setIsLoadingRekap] = useState(false);
  const [selectedRekapKegiatan, setSelectedRekapKegiatan] = useState<any>(null);
  const [filterDate, setFilterDate] = useState('');

  // QR Modal
  const [qrModalData, setQrModalData] = useState<{id: string, nama: string} | null>(null);

  const getDriveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('data:image')) {
      return url;
    }
    const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const driveUrl = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
      return `/api/image-proxy?url=${encodeURIComponent(driveUrl)}`;
    }
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  const formatTanggal = (dateString: string) => {
    if (!dateString) return '';
    if (typeof dateString === 'string' && dateString.includes('T') && dateString.endsWith('Z')) {
      try {
        const d = new Date(dateString);
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) {
        return dateString.split('T')[0];
      }
    }
    return dateString;
  };

  useEffect(() => {
    fetchKegiatans();
    fetchKehadirans();
  }, []);

  const fetchKegiatans = async () => {
    setIsLoadingKegiatan(true);
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getDataKegiatan&t=${Date.now()}`);
      const resultText = await response.text();
      let result: any = {};
      try { result = JSON.parse(resultText); } catch (e) { result = { status: resultText.includes("Success") ? "Success" : "Error" }; }
      if (result.data && result.data.length > 1) {
        setKegiatans(result.data.slice(1).map((r: any) => ({
          id: r[0],
          nama: r[1],
          hariTanggal: formatTanggal(r[2]),
          waktu: r[3],
          tempat: r[4]
        })));
      } else {
        setKegiatans([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingKegiatan(false);
    }
  };

  const fetchKehadirans = async () => {
    setIsLoadingRekap(true);
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getDaftarHadir&t=${Date.now()}`);
      const resultText = await response.text();
      let result: any = {};
      try { result = JSON.parse(resultText); } catch (e) { result = { status: resultText.includes("Success") ? "Success" : "Error" }; }
      if (result.data && result.data.length > 1) {
        setKehadirans(result.data.slice(1).map((r: any) => ({
          timestamp: r[0],
          id_kegiatan: r[1],
          nama_lengkap: r[2],
          instansi: r[3],
          gender: r[4],
          no_hp: String(r[5]).replace(/'/g, ''),
          email: r[6],
          ttd: r[7]
        })));
      } else {
        setKehadirans([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRekap(false);
    }
  };

  const handleAddKegiatan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: 'addDataKegiatan',
          nama_kegiatan: namaKegiatan,
          hari_tanggal: hariTanggal,
          waktu: waktu,
          tempat: tempat
        })
      });
      // Assume success since no-cors gives opaque response
      setShowAddForm(false);
      setNamaKegiatan('');
      setHariTanggal('');
      setWaktu('');
      setTempat('');
      
      // We don't get the generated ID back easily with no-cors, so we just refetch
      fetchKegiatans();
      
      alert("Kegiatan berhasil ditambahkan! Silakan refresh atau lihat di daftar.");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredKehadirans = kehadirans.filter(k => {
    if (selectedRekapKegiatan && k.id_kegiatan !== selectedRekapKegiatan.id) return false;
    return true;
  });

  const getKegiatanName = (id: string) => {
    const k = kegiatans.find(k => k.id === id);
    return k ? k.nama : id;
  };

  const getBase64ImageFromUrl = (url: string): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!url) return resolve(null);
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        try {
          resolve(canvas.toDataURL('image/png'));
        } catch (e) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  const handleDownloadPDF = async () => {
    if (!selectedRekapKegiatan) return;
    
    // Add loading state visually if needed, but for now just process
    Swal.fire({
      title: 'Memproses PDF',
      text: 'Mohon tunggu sebentar...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Load kop logos dynamically using getBase64ImageFromUrl
    const leftLogoUrl = `/api/image-proxy?url=${encodeURIComponent('https://drive.google.com/uc?export=view&id=1dxwhUWW20e4w8BdOcrwaojHbz0GxGOwQ')}`;
    const rightLogoUrl = `/api/image-proxy?url=${encodeURIComponent('https://drive.google.com/uc?export=view&id=1BU0DPMBjVe379MQ7Rczjn3_s4DAEa5L9')}`;
    
    const [leftLogoBase64, rightLogoBase64] = await Promise.all([
      getBase64ImageFromUrl(leftLogoUrl),
      getBase64ImageFromUrl(rightLogoUrl)
    ]);
    
    // Draw logos
    const logoY = 12;
    const logoWidth = 16;
    const logoHeight = 20;
    
    if (leftLogoBase64) {
      doc.addImage(leftLogoBase64, 'PNG', 14, logoY, logoWidth, logoHeight);
    }
    if (rightLogoBase64) {
      doc.addImage(rightLogoBase64, 'PNG', pageWidth - 14 - logoWidth, logoY, logoWidth, logoHeight);
    }
    
    // Draw centered title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    const titleLines = doc.splitTextToSize(selectedRekapKegiatan.nama.toUpperCase(), 130); // Leave room for logos
    let y = 16;
    
    titleLines.forEach((line: string) => {
      doc.text(line, pageWidth / 2, y, { align: 'center' });
      y += 6;
    });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(selectedRekapKegiatan.hariTanggal, pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.text(selectedRekapKegiatan.tempat, pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.text(selectedRekapKegiatan.waktu, pageWidth / 2, y, { align: 'center' });
    y += 15;
    
    const tableData = filteredKehadirans.map((k, index) => [
      index + 1,
      k.nama_lengkap,
      k.instansi,
      k.gender,
      k.no_hp,
      k.email,
      ''
    ]);

    // Preload images
    const base64Images: Record<number, string | null> = {};
    for (let i = 0; i < filteredKehadirans.length; i++) {
      const ttdUrl = filteredKehadirans[i].ttd;
      if (ttdUrl) {
        base64Images[i] = await getBase64ImageFromUrl(getDriveImageUrl(ttdUrl));
      }
    }

    autoTable(doc, {
      startY: 42,
      margin: { top: 42, right: 10, bottom: 15, left: 10 },
      head: [['No', 'Nama', 'Instansi', 'Gender', 'No. HP', 'Email', 'TTD']],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 8, 
        cellPadding: 2,
        valign: 'middle',
        minCellHeight: 14,
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        textColor: [0, 0, 0]
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { cellWidth: 40 },
        2: { cellWidth: 35 },
        3: { halign: 'center', cellWidth: 15 },
        4: { cellWidth: 25 },
        5: { cellWidth: 40 },
        6: { halign: 'center', cellWidth: 25 }
      },
      didDrawCell: function(data) {
        if (data.column.index === 6 && data.cell.section === 'body') {
          const rowIndex = data.row.index;
          const imgBase64 = base64Images[rowIndex];
          if (imgBase64) {
            try {
              doc.addImage(
                imgBase64,
                'PNG',
                data.cell.x + 2,
                data.cell.y + 1,
                20,
                10
              );
            } catch(e) {}
          }
        }
      }
    });

    Swal.close();
    doc.save(`Daftar_Hadir_${selectedRekapKegiatan.nama.replace(/\s+/g, '_')}.pdf`);
  };

  const getAppUrl = () => {
    const url = new URL(window.location.href);
    return `${url.origin}${url.pathname}`;
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Kehadiran</h1>
          
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('master')}
              className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'master' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Master Kegiatan
            </button>
            <button
              onClick={() => setActiveTab('rekap')}
              className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'rekap' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rekap Kehadiran
            </button>
          </div>
        </div>

        {activeTab === 'master' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Daftar Kegiatan</h2>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
              >
                {showAddForm ? 'Batal' : '+ Tambah Kegiatan'}
              </button>
            </div>

            {showAddForm && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleAddKegiatan} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kegiatan</label>
                    <input type="text" required value={namaKegiatan} onChange={e => setNamaKegiatan(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Rapat Koordinasi..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hari & Tanggal</label>
                      <input type="text" required value={hariTanggal} onChange={e => setHariTanggal(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Senin, 1 Januari 2025" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                      <input type="text" required value={waktu} onChange={e => setWaktu(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="09.00 - Selesai" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tempat</label>
                    <input type="text" required value={tempat} onChange={e => setTempat(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ruang Rapat Utama" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Kegiatan'}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 border-b">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Nama Kegiatan</th>
                    <th className="px-6 py-4 font-semibold">Waktu</th>
                    <th className="px-6 py-4 font-semibold">Tempat</th>
                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoadingKegiatan ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Memuat data...</td></tr>
                  ) : kegiatans.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Belum ada kegiatan.</td></tr>
                  ) : kegiatans.map(k => (
                    <tr key={k.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{k.nama}</td>
                      <td className="px-6 py-4 text-gray-600">{k.hariTanggal}<br/>{k.waktu}</td>
                      <td className="px-6 py-4 text-gray-600">{k.tempat}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setQrModalData({ id: k.id, nama: k.nama })}
                          className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors inline-flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                          QR Code
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rekap' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex-1 w-full max-w-md">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Kegiatan</label>
                <select 
                  value={selectedRekapKegiatan?.id || ''}
                  onChange={(e) => {
                    const selected = kegiatans.find(k => k.id === e.target.value);
                    setSelectedRekapKegiatan(selected || null);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-gray-900"
                >
                  <option value="">-- Pilih Kegiatan --</option>
                  {kegiatans.map(k => (
                    <option key={k.id} value={k.id}>{k.nama} ({k.hariTanggal})</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button 
                  onClick={fetchKehadirans}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors border border-gray-300 flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  Refresh Data
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Save PDF
                </button>
              </div>
            </div>

            {selectedRekapKegiatan ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 overflow-x-auto">
                <div className="mb-6 text-center text-black">
                  <h3 className="text-xl font-bold uppercase mb-2">{selectedRekapKegiatan.nama}</h3>
                  <p>{selectedRekapKegiatan.hariTanggal}</p>
                  <p>{selectedRekapKegiatan.tempat}</p>
                  <p>{selectedRekapKegiatan.waktu}</p>
                </div>
                
                <table className="w-full text-sm border-collapse border border-black bg-white">
                  <thead>
                    <tr>
                      <th className="border border-black px-4 py-2 text-center font-bold text-black w-12">No</th>
                      <th className="border border-black px-4 py-2 text-center font-bold text-black">Nama</th>
                      <th className="border border-black px-4 py-2 text-center font-bold text-black">Instansi</th>
                      <th className="border border-black px-4 py-2 text-center font-bold text-black">Gender</th>
                      <th className="border border-black px-4 py-2 text-center font-bold text-black">No. HP</th>
                      <th className="border border-black px-4 py-2 text-center font-bold text-black">Email</th>
                      <th className="border border-black px-4 py-2 text-center font-bold text-black">TTD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingRekap ? (
                      <tr><td colSpan={7} className="border border-black px-4 py-8 text-center text-gray-500">Memuat data...</td></tr>
                    ) : filteredKehadirans.length === 0 ? (
                      <tr><td colSpan={7} className="border border-black px-4 py-8 text-center text-gray-500">Tidak ada data kehadiran untuk kegiatan ini.</td></tr>
                    ) : filteredKehadirans.map((k, idx) => (
                      <tr key={idx}>
                        <td className="border border-black px-4 py-2 text-black text-center">{idx + 1}</td>
                        <td className="border border-black px-4 py-2 text-black text-left">{k.nama_lengkap}</td>
                        <td className="border border-black px-4 py-2 text-black text-left">{k.instansi}</td>
                        <td className="border border-black px-4 py-2 text-black text-center">{k.gender}</td>
                        <td className="border border-black px-4 py-2 text-black text-left">{k.no_hp}</td>
                        <td className="border border-black px-4 py-2 text-black text-left">{k.email}</td>
                        <td className="border border-black px-4 py-2 text-black text-center">
                          {k.ttd ? (
                            <img src={getDriveImageUrl(k.ttd)} alt="ttd" className="h-12 object-contain mx-auto" referrerPolicy="no-referrer" />
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                <p className="text-lg font-medium text-gray-900">Pilih Kegiatan</p>
                <p className="mt-1">Silakan pilih kegiatan pada dropdown di atas untuk melihat data rekap kehadiran.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center relative">
            <button 
              onClick={() => setQrModalData(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-2">QR Code Kehadiran</h3>
            <p className="text-gray-600 mb-6">{qrModalData.nama}</p>
            
            <div className="bg-white p-4 inline-block rounded-xl border border-gray-100 shadow-sm mb-6">
              <QRCode 
                value={`${getAppUrl()}?kegiatan_id=${qrModalData.id}`} 
                size={200}
              />
            </div>
            
            <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg break-all border border-gray-200">
              {`${getAppUrl()}?kegiatan_id=${qrModalData.id}`}
            </p>
            <div className="mt-6 flex justify-center">
                <a 
                    href={`${getAppUrl()}?kegiatan_id=${qrModalData.id}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                >
                    Buka Link di Tab Baru
                </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
