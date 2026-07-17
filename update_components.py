import os

# --- 1. DAFTAR KENDARAAN ---
daftar_kendaraan_code = """import React, { useState, useEffect } from 'react';

// URL Google Apps Script yang Anda buat
// Anda dapat menaruh URL ini di file .env.local Anda dengan nama VITE_APPS_SCRIPT_KENDARAAN_URL
const API_URL = import.meta.env.VITE_APPS_SCRIPT_KENDARAAN_URL || '[PASTE_URL_APPS_SCRIPT_ANDA_DISINI]';

export const DaftarKendaraan: React.FC = () => {
  const [dataKendaraan, setDataKendaraan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'Semua' | 'Terdata SIMBAKDA' | 'Tidak Terdata'>('Semua');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (API_URL === '[PASTE_URL_APPS_SCRIPT_ANDA_DISINI]') {
          console.warn("Harap masukkan URL Google Apps Script Anda di komponen DaftarKendaraan.tsx atau via env VITE_APPS_SCRIPT_KENDARAAN_URL.");
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(API_URL);
        const data = await response.json();
        setDataKendaraan(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = dataKendaraan.filter(item => {
    const platNomor = item.Polisi || item['Plat Nomor'] || '';
    const merk = item.Merk || '';
    const penanggungJawab = item['Penanggung Jawab'] || item['Pemegang Kendaraan'] || '';
    
    // Cek apakah kendaraan ini ada di SIMBAKDA. Sesuaikan dengan nama kolom yang ada di Sheet Anda.
    const simbakdaStatus = String(item.Simbakda || item['Terdata SIMBAKDA'] || item['Keterangan'] || '').toLowerCase();
    const isSimbakda = simbakdaStatus.includes('ya') || simbakdaStatus.includes('terdata') || simbakdaStatus === 'true';

    const matchesSearch = platNomor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          merk.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          penanggungJawab.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'Terdata SIMBAKDA') return matchesSearch && isSimbakda;
    if (filter === 'Tidak Terdata') return matchesSearch && !isSimbakda;
    return matchesSearch;
  });

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Aksi */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Daftar Kendaraan Dinas</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Rincian aset operasional kecamatan</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kendaraan
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari Plat, Merk, atau Penanggung Jawab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium shadow-sm"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium shadow-sm appearance-none cursor-pointer min-w-[200px]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' fill=\\'none\\' viewBox=\\'0 0 20 20\\'%3e%3cpath stroke=\\'%236b7280\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' stroke-width=\\'1.5\\' d=\\'M6 8l4 4 4-4\\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
        >
          <option value="Semua">Semua Kendaraan</option>
          <option value="Terdata SIMBAKDA">Terdata SIMBAKDA</option>
          <option value="Tidak Terdata">Tidak Terdata</option>
        </select>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Plat Nomor</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Detail Kendaraan</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Penanggung Jawab</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Pajak & Plat</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Dokumen</th>
              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-5"><div className="h-8 bg-slate-200 rounded w-24"></div></td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-2">
                      <div className="h-4 bg-slate-200 rounded w-32"></div>
                      <div className="h-3 bg-slate-200 rounded w-20"></div>
                    </div>
                  </td>
                  <td className="py-4 px-5"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-2">
                      <div className="h-5 bg-slate-200 rounded w-28"></div>
                      <div className="h-5 bg-slate-200 rounded w-20"></div>
                    </div>
                  </td>
                  <td className="py-4 px-5"><div className="flex gap-2"><div className="h-5 bg-slate-200 rounded w-10"></div><div className="h-5 bg-slate-200 rounded w-10"></div></div></td>
                  <td className="py-4 px-5"><div className="h-6 bg-slate-200 rounded w-16 mx-auto"></div></td>
                </tr>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                const platNomor = item.Polisi || item['Plat Nomor'] || '-';
                const merk = item.Merk || '-';
                const jenis = item.Jenis || item.Asal_Usul || item['Asal Usul'] || '-';
                const tahun = item.Tahun || item['Tahun Pembuatan'] || '-';
                const penanggungJawab = item['Penanggung Jawab'] || item['Pemegang Kendaraan'] || '-';
                
                // Status Pajak dan Plat Logika Smart Badge
                const statusPajakAsli = String(item['Status Pajak'] || item.Status || 'Tidak Diketahui');
                const tglPajak = item['Jatuh Tempo'] || item['Tanggal Pajak'] || '-';
                const isPajakAman = statusPajakAsli.toLowerCase().includes('lunas') || statusPajakAsli.toLowerCase().includes('aman') || statusPajakAsli.toLowerCase().includes('aktif');
                
                const masaPlat = item['Masa Plat'] || item['Jatuh Tempo Plat'] || '-';
                const isPlatAman = item['Status Plat'] ? String(item['Status Plat']).toLowerCase().includes('aman') : isPajakAman; // Fallback kalau gak ada
                
                const stnkAda = String(item.STNK || '').toLowerCase() === 'ada' || item.STNK === true || String(item.STNK || '').toLowerCase() === 'ya';
                const bpkbAda = String(item.BPKB || '').toLowerCase() === 'ada' || item.BPKB === true || String(item.BPKB || '').toLowerCase() === 'ya';

                return (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="inline-block bg-red-800 text-white font-bold px-3 py-1 rounded-md border-b-2 border-slate-900 tracking-widest shadow-sm whitespace-nowrap">
                        {platNomor}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{merk}</span>
                        <span className="text-xs text-slate-500 font-medium">{jenis} • {tahun}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                          {penanggungJawab.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]">{penanggungJawab}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1.5">
                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border max-w-max ${isPajakAman ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          Pajak: {statusPajakAsli} ({tglPajak})
                        </div>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border max-w-max ${isPlatAman ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          Plat: {masaPlat}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex gap-1.5">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${stnkAda ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          STNK
                        </span>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${bpkbAda ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          BPKB
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Detail">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Tidak ada data kendaraan yang ditemukan.</p>
                  {API_URL === '[PASTE_URL_APPS_SCRIPT_ANDA_DISINI]' && (
                    <p className="text-xs text-rose-500 mt-2">Peringatan: URL API Google Apps Script belum diatur.</p>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
"""

with open('components/DaftarKendaraan.tsx', 'w') as f:
    f.write(daftar_kendaraan_code)

# --- 2. GOOGLE APPS SCRIPT ---
gas_code = """/**
 * Google Apps Script untuk Daftar Kendaraan SI-PANDANG
 * 
 * 1. Buka Google Sheets Anda.
 * 2. Klik Ekstensi > Apps Script.
 * 3. Hapus semua kode default (function myFunction) dan paste kode di bawah ini.
 * 4. Simpan, lalu klik "Terapkan" (Deploy) > "Penerapan Baru" (New Deployment).
 * 5. Pilih jenis: "Aplikasi Web" (Web App).
 * 6. Set Akses: "Siapa saja" (Anyone).
 * 7. Klik "Terapkan" dan berikan izin otorisasi jika diminta.
 * 8. Copy "URL Aplikasi Web" dan gunakan di aplikasi React Anda.
 */

function doGet(e) {
  var sheetName = "DaftarKendaraan"; // Nama tab sheet Anda
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet " + sheetName + " tidak ditemukan!" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  
  // Data dimulai dari baris ke-9, jadi jika lastRow kurang dari 9 berarti belum ada data
  if (lastRow < 9) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Header ada di baris ke-7
  var headers = sheet.getRange(7, 1, 1, lastColumn).getValues()[0];
  
  // Ambil semua data mulai dari baris ke-9
  var numRows = lastRow - 8;
  var dataValues = sheet.getRange(9, 1, numRows, lastColumn).getValues();
  
  var data = [];
  
  for (var i = 0; i < dataValues.length; i++) {
    var row = dataValues[i];
    var rowObject = {};
    
    // Cek apakah baris ini kosong (misal berdasarkan kolom pertama 'Polisi')
    if (row[0] === "" && row[1] === "") {
      continue; // Lewati baris kosong
    }
    
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      
      // Jika header tidak kosong, tambahkan ke object
      if (header !== "") {
        var cellValue = row[j];
        
        // Menangani format tanggal agar jadi string yang rapi di JSON
        if (cellValue instanceof Date) {
          // Format sesuai zona waktu script (default Asia/Jakarta jika diatur)
          cellValue = Utilities.formatDate(cellValue, Session.getScriptTimeZone(), "dd MMM yyyy");
        }
        
        rowObject[header] = cellValue;
      }
    }
    
    data.push(rowObject);
  }
  
  // ContentService Apps Script otomatis mengizinkan request cross-origin (CORS) ketika dipanggil via fetch dengan follow redirects
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
"""

with open('GoogleAppsScript.js', 'w') as f:
    f.write(gas_code)

