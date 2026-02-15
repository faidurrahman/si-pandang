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
import { EditReportModal } from './components/EditReportModal';
import { LoginModal } from './components/LoginModal';

// URL Deployment GAS Terbaru
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwsk7hBNKqetXhO6oAzLcGz4ZgP7hE0nag_hIQleDbjFcBT4ynnHSm4cRa8CJiLxjAN/exec";
const SHEET_ID = "1PfITx5bKWrTM9m63L8fomxNf5LicNaDJ5tdpHP-C7GA";
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const cleanStr = (str: any) => {
    if (str === null || str === undefined) return '';
    return str.toString()
      .replace(/^'/, '')
      .replace(/^"|"$/g, '')
      .replace(/""/g, '"')
      .replace(/\r/g, '')
      .trim();
  };

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

  const fetchSubmissions = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoadingReports(true);
    try {
      const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${new Date().getTime()}`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      const csvText = await response.text();
      const allRows = parseCSVData(csvText);
      
      const data: Submission[] = allRows.slice(1).map((columns, index) => {
        const subId = cleanStr(columns[7]) || `ID-${index}`;
        return {
          tanggal: cleanStr(columns[0]) || 'N/A',
          nama: cleanStr(columns[1]) || 'N/A',
          nip: cleanStr(columns[2]) || 'N/A',
          layanan: cleanStr(columns[3]) || 'N/A',
          filename: cleanStr(columns[4]) || 'Berkas.pdf',
          status: (cleanStr(columns[5]) as SubmissionStatus) || 'Dalam Proses',
          fileUrl: cleanStr(columns[6]) || '#',
          id: subId,
          pengumuman: cleanStr(columns[8]) || ''
        };
      }).reverse();
      setSubmissions(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoadingReports(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (activeTab === 'monitoring' && isLoggedIn) {
      fetchSubmissions();
    }
  }, [activeTab, fetchSubmissions, isLoggedIn]);

  const handleUpdateData = async (updatedData: any) => {
    setIsSubmitting(true);
    const submissionId = updatedData.id;

    setSubmissions(prev => prev.map(sub => sub.id === submissionId ? { 
      ...sub, 
      nama: updatedData.nama, 
      nip: updatedData.nip, 
      layanan: updatedData.layanan, 
      status: updatedData.status,
      pengumuman: updatedData.pengumuman || ""
    } : sub));

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
          status: updatedData.status,
          pengumuman: updatedData.pengumuman || ""
        }),
      });
      setEditingReport(null);
      setTimeout(() => fetchSubmissions(), 1500);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    const newId = `SIP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          ...data,
          id: newId,
          status: 'Dalam Proses',
          timestamp: formattedDate
        }),
      });
      setIsSubmitting(false);
      setShowForm(false);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 5000);
      if (isLoggedIn) fetchSubmissions();
    } catch (error) {
      setIsSubmitting(false);
      setSubmitStatus('error');
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setActiveTab('monitoring');
    }
  };

  const filteredServices = useMemo(() => {
    return SERVICES.filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Navbar Toggle */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-[140]">
        <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:opacity-70 transition-opacity">
          <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="10" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab} 
        onNavigate={setActiveTab} 
        isLoggedIn={isLoggedIn} 
        onLoginClick={() => setShowLoginModal(true)} 
        onLogout={() => setIsLoggedIn(false)} 
      />

      {/* Hero Section - Matched to Screenshot & Responsive */}
      <section className="hero-bg relative min-h-[75vh] md:min-h-[85vh] flex flex-col items-center justify-center pt-20 pb-20 md:pt-12 md:pb-24 overflow-hidden px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          
          {/* Central Building Icon - Responsive Size */}
          <div className="hero-icon-container w-20 h-20 md:w-32 md:h-32 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center mb-6 md:mb-10 shadow-2xl transition-transform hover:scale-105 duration-500">
            <svg className="w-10 h-10 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>

          {/* Golden Badge - Responsive Size */}
          <div className="badge-portal px-5 py-2 md:px-8 md:py-3 rounded-full border border-white/10 mb-6 md:mb-10 backdrop-blur-md">
            <span className="text-amber-500 text-[8px] md:text-xs font-black uppercase tracking-[0.2em]">PORTAL RESMI KEPEGAWAIAN</span>
          </div>

          {/* Heading Text - Responsive Font Sizes */}
          <div className="mb-4 md:mb-6 space-y-1">
            <h2 className="text-white text-base md:text-3xl font-black tracking-widest uppercase opacity-95">SELAMAT DATANG DI</h2>
            <h1 className="text-amber-500 text-4xl md:text-8xl font-black tracking-tight uppercase leading-tight md:leading-none">SI-PANDANG</h1>
          </div>

          {/* Subheading/Description - Responsive Sizes */}
          <p className="text-white/80 text-[10px] sm:text-xs md:text-lg max-w-[280px] sm:max-w-xl mx-auto mb-8 md:mb-12 font-medium leading-relaxed">
            Portal Layanan Kepegawaian ASN Terintegrasi Kecamatan Ujung Pandang. Solusi Cepat untuk Administrasi Digital Anda.
          </p>

          {/* Main Action Button - Responsive Size */}
          <button 
            onClick={() => { setActiveTab('layanan'); setTimeout(() => document.getElementById('layanan-menu')?.scrollIntoView({ behavior: 'smooth' }), 50); }} 
            className="btn-mulai text-[#0a1e3b] px-10 py-4 md:px-16 md:py-5 rounded-xl md:rounded-2xl font-black text-xs md:text-base uppercase shadow-2xl tracking-widest"
          >
            MULAI LAYANAN
          </button>
        </div>

        {/* Bottom Wave Effect */}
        <div className="wave-bottom overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-32">
            <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="layanan-menu" className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 -mt-6 md:-mt-4 w-full flex-grow">
        {activeTab === 'layanan' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 md:mb-12 text-center">
                <h2 className="text-xl md:text-3xl font-bold text-[#0a1e3b]">Layanan Kepegawaian</h2>
                <div className="mt-6 md:mt-8 relative max-w-2xl mx-auto">
                    <input 
                      type="text" 
                      placeholder="Cari layanan..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none shadow-sm text-sm" 
                    />
                    <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-300">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                </div>
            </div>
            
            <InfoBoard />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredServices.map(service => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onClick={(s) => setSelectedService(s)} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#0a1e3b]">Monitoring Layanan</h2>
                  <p className="text-slate-400 text-[10px] md:text-xs font-medium mt-1">Pantau status pengajuan berkas kepegawaian Anda.</p>
                </div>
                <button 
                  onClick={fetchSubmissions}
                  className="px-4 py-2.5 md:px-6 md:py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-[10px] md:text-xs flex items-center hover:bg-slate-50 transition-colors w-max"
                >
                  <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 mr-2 ${isLoadingReports ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Segarkan Data
                </button>
             </div>

             <ReportsTable 
               submissions={submissions} 
               onViewDetail={setSelectedReport} 
               onEdit={setEditingReport}
             />
          </div>
        )}
      </main>

      {/* Kontak Section - Responsive Padding */}
      <section className="bg-white py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-xl mx-auto bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-slate-50 relative overflow-hidden group">
           <div className="flex items-center space-x-3 mb-8 md:mb-10 ml-1">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h2 className="text-xl md:text-2xl font-black text-[#0a1e3b] tracking-tight">Kontak Admin</h2>
           </div>
           
           <div className="space-y-3 md:space-y-4">
              <div 
                onClick={() => window.open('https://maps.app.goo.gl/SX1s5Pf62GeDYKaG9', '_blank')}
                className="bg-slate-50/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all duration-300"
              >
                 <div className="flex items-center space-x-4 md:space-x-5">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-50 text-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                       <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                    </div>
                    <div className="overflow-hidden">
                       <p className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">ALAMAT</p>
                       <p className="text-[#0a1e3b] font-bold text-xs md:text-sm truncate">Jl. Samiun No. 15, Kota Makassar</p>
                    </div>
                 </div>
              </div>

              <div 
                onClick={() => window.open('https://wa.me/6285242728901', '_blank')}
                className="bg-slate-50/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all duration-300"
              >
                 <div className="flex items-center space-x-4 md:space-x-5">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-50 text-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                       <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.912-.001-3.793-.46-5.467-1.331l-6.53 1.714zm5.868-3.363l.42.249c1.662.984 3.566 1.503 5.507 1.504 5.814 0 10.546-4.731 10.549-10.548 0-2.817-1.097-5.465-3.091-7.458s-4.64-3.091-7.46-3.091c-5.815 0-10.547 4.732-10.55 10.548-.001 1.902.501 3.754 1.455 5.356l.271.456-1.011 3.694 3.8-.996z" />
                       </svg>
                    </div>
                    <div>
                       <p className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">WHATSAPP</p>
                       <p className="text-[#0a1e3b] font-bold text-xs md:text-sm">085242728901</p>
                    </div>
                 </div>
              </div>

              <div 
                onClick={() => window.location.href = 'mailto:data.kecujungpandang@gmail.com'}
                className="bg-slate-50/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all duration-300"
              >
                 <div className="flex items-center space-x-4 md:space-x-5">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-pink-50 text-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0">
                       <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                       </svg>
                    </div>
                    <div className="overflow-hidden">
                       <p className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5">EMAIL</p>
                       <p className="text-[#0a1e3b] font-bold text-xs md:text-sm truncate">data.kecujungpandang@gmail.com</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer - Responsive Padding */}
      <footer className="bg-[#050b18] py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1/2 bg-blue-500/5 blur-[120px] rounded-full"></div>
        
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
           {/* Building Icon Box */}
           <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#818cf8] to-[#4f46e5] rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-8 md:mb-10 transition-transform hover:scale-110">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
           </div>
           
           <h3 className="text-white font-black text-2xl md:text-3xl tracking-tight mb-3 uppercase">SI-PANDANG</h3>
           <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] mb-12 md:mb-16">KECAMATAN UJUNG PANDANG, KOTA MAKASSAR</p>
           
           <div className="w-full h-[1px] bg-white/5 mb-8 md:mb-12 max-w-2xl mx-auto"></div>
           
           <p className="text-slate-600 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">
             © 2026 SI-PANDANG. ALL RIGHTS RESERVED.
           </p>
        </div>
      </footer>

      {/* Modals */}
      <ServiceModal 
        service={selectedService} 
        onClose={() => setSelectedService(null)} 
        onApply={(s) => { setSelectedService(null); setShowForm(true); }}
      />

      {showForm && (
        <ApplicationForm 
          initialService={selectedService} 
          onClose={() => setShowForm(false)} 
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {selectedReport && (
        <ReportDetailModal 
          submission={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}

      {editingReport && (
        <EditReportModal 
          submission={editingReport} 
          onClose={() => setEditingReport(null)}
          onUpdate={handleUpdateData}
          isSubmitting={isSubmitting}
        />
      )}

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onLogin={handleLogin} 
        />
      )}

      {/* Status Toast */}
      {submitStatus === 'success' && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold flex items-center animate-in slide-in-from-bottom-10 text-xs md:text-base">
          <svg className="w-5 h-5 md:w-6 md:h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          Pengajuan Berhasil Terkirim!
        </div>
      )}
    </div>
  );
};

export default App;