import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { SERVICES } from './constants';
import { Service, Submission, SubmissionStatus } from './types';
import { ServiceCard } from './components/ServiceCard';
import { ServiceModal } from './components/ServiceModal';
import { ApplicationForm } from './components/ApplicationForm';
import { InfoBoard } from './components/InfoBoard';
import { ReportsTable } from './components/ReportsTable';
import { ReportDetailModal } from './components/ReportDetailModal';
import { Sidebar } from './components/Sidebar';
import { ChatBot } from './components/ChatBot';
import { EditReportModal } from './components/EditReportModal';

// Link Deployment GAS Terbaru yang diberikan pengguna
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwf_zj9Qo8oHMqBzMHBn-3PE-_I7WmXZfX1qoOt5ZviFLEU-A40WhWAunZ9W0MK5dBh/exec";
const SHEET_ID = "1PfITx5bKWrTM9m63L8fomxNf5LicNaDJ5tdpHP-C7GA";

// URL Monitoring menggunakan gviz API
const GOOGLE_SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Pengajuan`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layanan' | 'monitoring'>('layanan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Submission | null>(null);
  const [editingReport, setEditingReport] = useState<Submission | null>(null);

  const cleanStr = (str: any) => {
    if (str === null || str === undefined) return '';
    return str.toString()
      .replace(/^'/, '')
      .replace(/^"|"$/g, '')
      .replace(/\r/g, '')
      .trim();
  };

  /**
   * Generator ID Unik Frontend
   * Menghasilkan format: SIP-ABC123
   */
  const generateId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `SIP-${result}`;
  };

  const parseCSVRow = (row: string) => {
    const result = [];
    let startValueIndex = 0;
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
      if (row[i] === '"') inQuotes = !inQuotes;
      if (row[i] === ',' && !inQuotes) {
        result.push(cleanStr(row.substring(startValueIndex, i)));
        startValueIndex = i + 1;
      }
    }
    result.push(cleanStr(row.substring(startValueIndex)));
    return result;
  };

  const fetchSubmissions = useCallback(async () => {
    setIsLoadingReports(true);
    try {
      const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${new Date().getTime()}`);
      if (!response.ok) throw new Error('Gagal mengambil data monitoring');
      
      const csvText = await response.text();
      const rows = csvText.split(/\n/).filter(row => row.trim() !== '');
      
      // Index 7 mengacu pada Kolom H (ID Pengajuan)
      const data: Submission[] = rows.slice(1).map((row, index) => {
        const columns = parseCSVRow(row);
        const subId = columns[7] || `LEGACY-${index}`;
        return {
          tanggal: columns[0] || 'N/A',
          nama: columns[1] || 'N/A',
          nip: columns[2] || 'N/A',
          layanan: columns[3] || 'N/A',
          filename: columns[4] || 'Berkas.pdf',
          status: (columns[5] as SubmissionStatus) || 'Dalam Proses',
          fileUrl: columns[6] || '#',
          id: subId
        };
      }).reverse();

      setSubmissions(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'monitoring') {
      fetchSubmissions();
    }
  }, [activeTab, fetchSubmissions]);

  const handleUpdateData = async (updatedData: any) => {
    setIsSubmitting(true);
    const submissionId = updatedData.id;

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: 'updateData',
          id: submissionId,
          nama: updatedData.nama,
          nip: updatedData.nip,
          layanan: updatedData.layanan,
          status: updatedData.status
        }),
      });
      
      setSubmissions(prev => prev.map(sub => sub.id === submissionId ? { 
        ...sub, 
        nama: updatedData.nama, 
        nip: updatedData.nip, 
        layanan: updatedData.layanan, 
        status: updatedData.status 
      } : sub));
      
      setEditingReport(null);
      setTimeout(() => fetchSubmissions(), 3000);
    } catch (error) {
      alert("Gagal memperbarui data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: 'updateStatus',
          id: id,
          status: newStatus
        }),
      });
      
      setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub));
      setTimeout(() => fetchSubmissions(), 3000);
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    // Pembuatan ID Otomatis dari Frontend sebelum dikirim ke Google Sheets
    const newSubmissionId = generateId();

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          ...data,
          id: newSubmissionId,
          status: 'Dalam Proses',
          timestamp: formattedDate
        }),
      });

      setIsSubmitting(false);
      setShowForm(false);
      setSubmitStatus('success');
      
      setTimeout(() => {
        fetchSubmissions();
        setActiveTab('monitoring');
      }, 4000);
      
      setTimeout(() => setSubmitStatus('idle'), 7000);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitStatus('error');
    }
  };

  const filteredServices = useMemo(() => {
    return SERVICES.filter(s => {
      return s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             s.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <div className="absolute top-8 right-8 z-[140]">
        <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:opacity-70 transition-opacity">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="10" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} activeTab={activeTab} onNavigate={setActiveTab} />

      <section className="hero-bg relative min-h-[75vh] flex flex-col items-center justify-center pt-12 pb-24 overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center px-6 relative z-10">
          <div className="hero-icon-container w-24 h-24 md:w-28 md:h-28 rounded-[2rem] flex items-center justify-center mb-8 relative">
             <div className="relative">
                <svg className="w-12 h-12 md:w-14 md:h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
             </div>
          </div>
          <div className="badge-portal px-6 py-2 rounded-full border border-white/10 mb-8">
            <span className="text-amber-500 text-xs font-bold tracking-wide uppercase">Portal Resmi Kepegawaian</span>
          </div>
          <div className="mb-8">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-1 tracking-tight">SELAMAT DATANG DI</h2>
            <h1 className="text-amber-500 text-5xl md:text-7xl font-black tracking-tighter uppercase">SI-PANDANG</h1>
          </div>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Portal Layanan Kepegawaian ASN Terintegrasi Kecamatan Ujung Pandang. Solusi Cepat untuk Administrasi Digital Anda.
          </p>
          <button onClick={() => { setActiveTab('layanan'); setTimeout(() => document.getElementById('layanan-menu')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="btn-mulai text-white px-12 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center space-x-2">
            <span>Mulai Layanan</span>
          </button>
        </div>
        <div className="wave-bottom overflow-hidden">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24 md:h-32"><path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" className="shape-fill"></path></svg>
        </div>
      </section>

      <main id="layanan-menu" className="relative z-20 max-w-7xl mx-auto px-6 py-12 -mt-4 w-full">
        {activeTab === 'layanan' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#0a1e3b] tracking-tight">Layanan Kepegawaian</h2>
                <div className="w-20 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
                <div className="mt-12 relative max-w-2xl mx-auto">
                    <input type="text" placeholder="Cari layanan administrasi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all text-base font-medium outline-none shadow-sm" />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>
            <InfoBoard />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12 mb-20">
              {filteredServices.map(service => <ServiceCard key={service.id} service={service} onClick={(s) => { setSelectedService(s); setShowForm(false); }} />)}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
               <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0a1e3b] tracking-tight">Monitoring Laporan</h2>
                  <p className="text-slate-400 text-sm font-medium mt-1">Pantau status usulan administrasi digital Anda</p>
               </div>
               <div className="flex items-center space-x-2">
                  <button onClick={fetchSubmissions} disabled={isLoadingReports} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors">
                    <svg className={`w-4 h-4 ${isLoadingReports ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Refresh</span>
                  </button>
               </div>
            </div>
            {isLoadingReports ? (
              <div className="py-20 flex flex-col items-center"><div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div></div>
            ) : (
              <ReportsTable submissions={submissions} onStatusChange={handleStatusChange} onViewDetail={(sub) => setSelectedReport(sub)} onEdit={(sub) => setEditingReport(sub)} />
            )}
          </div>
        )}
      </main>

      <footer className="bg-[#020b1c] text-white pt-24 pb-12 px-8 flex flex-col items-center">
        <h3 className="text-2xl font-black tracking-tight uppercase mb-2">SI-PANDANG</h3>
        <p className="text-white/60 text-[9px] font-bold uppercase tracking-[0.2em]">&copy; 2026 SI-PANDANG. ALL RIGHTS RESERVED.</p>
      </footer>

      {!showForm && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} onApply={(s) => { setSelectedService(s); setShowForm(true); }} />}
      {showForm && <ApplicationForm initialService={selectedService} onClose={() => setShowForm(false)} onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />}
      {selectedReport && <ReportDetailModal submission={selectedReport} onClose={() => setSelectedReport(null)} />}
      {editingReport && <EditReportModal submission={editingReport} onClose={() => setEditingReport(null)} onUpdate={handleUpdateData} isSubmitting={isSubmitting} />}
      <ChatBot />
    </div>
  );
};

export default App;