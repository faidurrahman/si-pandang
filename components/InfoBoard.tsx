import React, { useState, useEffect } from 'react';

interface Announcement {
  id: string;
  text: string;
}

export const InfoBoard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ID Spreadsheet yang digunakan
  const SHEET_ID = "1PfITx5bKWrTM9m63L8fomxNf5LicNaDJ5tdpHP-C7GA";
  const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Pengajuan`;

  /**
   * Pembersih teks sel CSV
   */
  const cleanStr = (str: string) => {
    if (!str) return '';
    return str.toString()
      .replace(/^"|"$/g, '') // Hapus kutip pembungkus
      .replace(/""/g, '"') // Kembalikan double quote ter-escape
      .replace(/\r/g, '')
      .trim();
  };

  /**
   * Parser CSV cerdas pendukung Multiline
   */
  const parseCSVData = (text: string) => {
    const result: string[][] = [];
    let row: string[] = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else { field += c; }
      } else {
        if (c === '"') { inQuotes = true; }
        else if (c === ',') { row.push(field); field = ''; }
        else if (c === '\n' || c === '\r') {
          row.push(field);
          if (row.length > 1 || row[0] !== '') result.push(row);
          row = []; field = '';
          if (c === '\r' && text[i + 1] === '\n') i++;
        } else { field += c; }
      }
    }
    if (row.length > 0 || field !== '') {
      row.push(field);
      result.push(row);
    }
    return result;
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`${GOOGLE_SHEET_URL}&t=${new Date().getTime()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const csvText = await response.text();
      const allRows = parseCSVData(csvText);
      
      // Ambil kolom I (indeks 8)
      const data = allRows.slice(1).map((columns, index) => {
        const pengumumanText = columns.length > 8 ? cleanStr(columns[8]) : ''; 
        return {
          id: String(index),
          text: pengumumanText,
        };
      }).filter(item => item.text && item.text.trim().length > 0);

      // Urutkan pengumuman terbaru di atas
      setAnnouncements(data.reverse());
    } catch (err) {
      console.error("Gagal mengambil data pengumuman:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="mb-12 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.02)] transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-6 bg-amber-400 rounded-full"></div>
          <h3 className="text-lg font-black text-[#0a192f] tracking-tight">Papan Pengumuman</h3>
        </div>
        
        <button 
          onClick={fetchAnnouncements}
          disabled={loading}
          className="p-2 text-slate-300 hover:text-amber-500 transition-colors disabled:opacity-30"
          title="Segarkan data"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="min-h-[120px] flex flex-col items-center justify-center">
        {loading ? (
          <div className="w-full space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Gagal memuat data dari server</p>
            <button onClick={fetchAnnouncements} className="mt-2 text-[10px] font-black text-amber-500 underline uppercase">Coba Lagi</button>
          </div>
        ) : announcements.length > 0 ? (
          <div className="w-full space-y-3">
            {announcements.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#fcfdfe] p-5 rounded-2xl border border-slate-50 flex items-start space-x-4 shadow-sm hover:border-amber-400/30 transition-all group animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-slate-600 text-[13px] font-medium leading-relaxed whitespace-pre-wrap">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-10">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
              Belum ada informasi terbaru
            </p>
          </div>
        )}
      </div>
    </div>
  );
};