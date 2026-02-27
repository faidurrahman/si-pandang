import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
import { PantauKGB } from './components/PantauKGB';


const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzEehw7MuRO_leCLt_B1JfNHkzaxC6VgGX9HtlBmz2uAPsgua4alCOt5-VodnKp_cuz/exec";
const SHEET_ID = "1PfITx5bKWrTM9m63L8fomxNf5LicNaDJ5tdpHP-C7GA";

const WA_NUMBER = "085242728901";
const WA_MESSAGE = encodeURIComponent("Halo Sub bagian Umum dan Kepegawaian, saya ingin bertanya tentang layanan SI-PANDANG.");
const WA_LINK = `https://wa.me/62${WA_NUMBER}?text=${WA_MESSAGE}`;
const MAPS_LINK = "https://maps.app.goo.gl/SX1s5Pf62GeDYKaG9";
const EMAIL_ADDRESS = "data.kecujungpandang@gmail.com";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layanan' | 'monitoring' | 'pantau-kgb'>('layanan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Submission | null>(null);
  const [editingReport, setEditingReport] = useState<Submission | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cleanStr = (str: any) => {
    if (str === null || str === undefined) return '';
    return str.toString()
      .replace(/^'/, '')
      .replace(/^"|"$/g, '')
      .replace(/""/g, '"')
      .replace(/\r/g, '')
      .trim();
  };

  const fetchSubmissions = useCallback(async () => {
    setIsLoadingReports(true);
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getData&t=${new Date().getTime()}`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      
      const text = await response.text();
      
      // Check if the response is the old plain text response
      if (text.startsWith('SI-PANDANG')) {
        console.warn("Apps Script belum diupdate. Menampilkan data kosong sementara.");
        setSubmissions([]);
        return;
      }

      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", text);
        throw new Error("Format data tidak valid. Pastikan Apps Script telah di-deploy ulang.");
      }
      
      if (json.error) throw new Error(json.error);
      
      const allRows = json.data;
      
      if (!allRows || allRows.length === 0) {
        setSubmissions([]);
        return;
      }

      const data: Submission[] = allRows.slice(1).map((columns: any[], index: number) => {
        const subId = cleanStr(columns[7]) || `ID-${index}`;
        const rawFilenames = cleanStr(columns[4]) || 'Berkas.pdf';
        const rawUrls = cleanStr(columns[6]) || '#';
        
        const filenames = rawFilenames.split('|');
        const urls = rawUrls.split('|');
        
        const additionalFiles = filenames.map((name: string, i: number) => ({
          filename: name,
          url: urls[i] || '#'
        }));

        return {
          tanggal: cleanStr(columns[0]) || 'N/A',
          nama: cleanStr(columns[1]) || 'N/A',
          nip: cleanStr(columns[2]) || 'N/A',
          layanan: cleanStr(columns[3]) || 'N/A',
          filename: filenames[0],
          status: (cleanStr(columns[5]) as SubmissionStatus) || 'Dalam Proses',
          fileUrl: urls[0],
          id: subId,
          pengumuman: cleanStr(columns[8]) || '',
          additionalFiles: additionalFiles
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
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 60000);
    return () => clearInterval(interval);
  }, [fetchSubmissions]);

  const unreadSubmissions = useMemo(() => {
    return submissions.filter(s => s.status === 'Dalam Proses' && !readNotifIds.has(s.id));
  }, [submissions, readNotifIds]);

  const pendingSubmissionsCount = unreadSubmissions.length;

  const markAsRead = (id: string) => {
    setReadNotifIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const markAllAsRead = () => {
    const allIds = submissions.map(s => s.id);
    setReadNotifIds(new Set([...readNotifIds, ...allIds]));
  };

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

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
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setIsSubmitting(false);
      setShowForm(false);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 5000);
      fetchSubmissions();
    } catch (error: any) {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
      
      if (error.name === 'AbortError') {
        // If it's a timeout, we assume it might have reached the server 
        // especially with no-cors where we don't get a real response anyway
        setShowForm(false);
        setSubmitStatus('success');
        setTimeout(() => setSubmitStatus('idle'), 5000);
        fetchSubmissions();
      } else {
        console.error("Submission error:", error);
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setActiveTab('monitoring');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('layanan');
    setIsNotifOpen(false);
  };

  const filteredServices = useMemo(() => {
    return SERVICES.filter(s => 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <header className="absolute top-0 left-0 w-full z-[140] px-4 py-4 md:px-12 md:py-10">
        <div className="header-container w-full flex justify-between items-center">
          <div className="header-logo flex items-center space-x-2 md:space-x-3 justify-start">
            <img 
              src="https://lh3.googleusercontent.com/d/1BU0DPMBjVe379MQ7Rczjn3_s4DAEa5L9" 
              alt="Logo SI-PANDANG" 
              className="h-10 md:h-16 w-auto drop-shadow-2xl object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="border-l border-white/20 pl-2 md:pl-3 flex flex-col justify-center text-left">
              <p className="text-white text-[8px] md:text-[11px] font-black uppercase tracking-widest leading-tight">Pemerintah Kota Makassar</p>
              <p className="text-amber-500 text-[7px] md:text-[9px] font-bold uppercase tracking-tighter">Kecamatan Ujung Pandang</p>
            </div>
          </div>
          
          <div className="nav-icons-wrapper flex items-center space-x-3 md:space-x-5 justify-end">
            {isLoggedIn && (
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="w-8 h-8 md:w-11 md:h-11 bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl flex items-center justify-center text-amber-500 hover:text-amber-400 transition-all border border-white/10 relative shadow-xl active:scale-90"
                >
                  <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {pendingSubmissionsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#0a1e3b] shadow-lg animate-bounce">
                      {pendingSubmissionsCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute top-12 md:top-14 right-0 w-72 sm:w-80 bg-white rounded-[24px] md:rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-4 md:p-6 border-b border-slate-50 bg-white flex justify-between items-center">
                      <h3 className="text-[10px] font-black text-[#0a1e3b] uppercase tracking-widest">Notifikasi</h3>
                      {pendingSubmissionsCount > 0 && (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[8px] font-black rounded-full uppercase tracking-widest">{pendingSubmissionsCount} BARU</span>
                      )}
                    </div>
                    <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto">
                      {submissions.slice(0, 10).map((sub) => (
                        <div 
                          key={sub.id} 
                          onClick={() => markAsRead(sub.id)}
                          className={`p-4 md:p-5 hover:bg-slate-50 border-b border-slate-50 transition-colors cursor-pointer group flex space-x-4 ${readNotifIds.has(sub.id) ? 'opacity-60' : 'opacity-100'}`}
                        >
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 font-black text-xs md:text-sm">
                            {sub.nama.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] md:text-[12px] font-bold text-[#0a1e3b] leading-snug">
                              {sub.nama} – {sub.layanan}
                            </p>
                            <p className="text-[9px] md:text-[10px] text-amber-600 font-bold uppercase mt-1 tracking-wider">
                              {sub.tanggal}
                            </p>
                          </div>
                        </div>
                      ))}
                      {submissions.length === 0 && (
                        <div className="p-10 md:p-12 text-center">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tidak ada notifikasi baru</p>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={markAllAsRead} 
                      className="w-full py-4 md:py-5 text-center text-[10px] font-black text-slate-400 hover:text-amber-600 hover:bg-slate-50 transition-all uppercase tracking-[0.2em]"
                    >
                      Tandai Semua Telah Dibaca
                    </button>
                  </div>
                )}
              </div>
            )}
            <button onClick={() => setIsSidebarOpen(true)} className="text-white hover:opacity-70 transition-opacity relative group p-1.5">
              <svg className="w-6 h-6 md:w-9 md:h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="10" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab} 
        onNavigate={(tab) => {
          setActiveTab(tab);
          setTimeout(() => document.getElementById('layanan-menu')?.scrollIntoView({ behavior: 'smooth' }), 50);
        }} 
        isLoggedIn={isLoggedIn} 
        onLoginClick={() => setShowLoginModal(true)} 
        onLogout={handleLogout} 
      />

      <section className="hero-bg relative min-h-[80vh] md:min-h-[85vh] flex flex-col items-center justify-center pt-24 pb-16 md:pt-40 md:pb-24 overflow-hidden px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="w-12 h-12 md:w-24 md:h-24 bg-amber-500 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-2xl shadow-amber-900/40 mb-6 md:mb-12 hover:scale-110 transition-transform duration-500 cursor-pointer">
             <svg className="w-6 h-6 md:w-12 md:h-12 text-[#0a1e3b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
          </div>
          <div className="mb-4 md:mb-10">
            <span className="text-amber-500/60 text-[10px] md:text-xs font-light uppercase tracking-[0.3em]">PORTAL RESMI KEPEGAWAIAN</span>
          </div>
          <div className="mb-6 md:mb-10">
            <h2 className="text-white text-[10px] md:text-3xl font-black tracking-[0.3em] uppercase opacity-80 mb-2">SELAMAT DATANG DI</h2>
            <h1 className="text-amber-500 text-5xl md:text-9xl font-black tracking-tight uppercase leading-none drop-shadow-2xl">SI-PANDANG</h1>
          </div>
          <p className="text-white/80 text-[11px] md:text-xl max-w-[280px] md:max-w-3xl mx-auto mb-10 md:mb-16 font-bold leading-relaxed px-4 uppercase tracking-wider">
            Sistem Informasi Pelayanan Administrasi Kepegawaian Kecamatan Ujung Pandang
          </p>
          <div className="flex flex-col items-center">
            <button 
              onClick={() => { setActiveTab('layanan'); setTimeout(() => document.getElementById('layanan-menu')?.scrollIntoView({ behavior: 'smooth' }), 50); }} 
              className="btn-mulai-layanan tracking-widest !px-8 !py-3 md:!px-12 md:!py-5 text-xs md:text-lg md:scale-110 hover:scale-105 transition-transform"
            >
              MULAI LAYANAN
            </button>
          </div>
        </div>
        <div className="wave-bottom overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-32">
            <path d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

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
                <ServiceCard key={service.id} service={service} onClick={(s) => setSelectedService(s)} />
              ))}
            </div>
          </div>
        ) : activeTab === 'monitoring' ? (
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
             <ReportsTable submissions={submissions} onViewDetail={setSelectedReport} onEdit={setEditingReport} />
          </div>
        ) : (
          <PantauKGB />
        )}
      </main>

      <section className="contact-section max-w-4xl mx-auto px-4 md:px-6 mb-20 md:mb-32">
        <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 p-6 md:p-14">
          <div className="flex items-center space-x-3 md:space-x-4 mb-6 md:mb-10">
            <div className="text-amber-500">
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-3xl font-black text-[#0a1e3b] tracking-tight">Kontak Admin</h2>
          </div>

          <div className="space-y-3 md:space-y-5 contact-container">
            <a href={MAPS_LINK} target="_blank" className="contact-item flex items-center p-4 md:p-6 bg-[#f5f9ff] rounded-[20px] md:rounded-[24px] group hover:bg-[#ebf4ff] transition-all">
              <div className="contact-icon w-10 h-10 md:w-14 md:h-14 bg-blue-100 flex items-center justify-center rounded-xl md:rounded-2xl text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="contact-text ml-4 md:ml-6 overflow-hidden">
                <h4 className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">ALAMAT</h4>
                <p className="text-[#0a1e3b] font-bold text-sm md:text-base truncate">Jl. Samiun No. 15, Kota Makassar</p>
              </div>
            </a>

            <a href={WA_LINK} target="_blank" className="contact-item flex items-center p-4 md:p-6 bg-[#f0fff4] rounded-[20px] md:rounded-[24px] group hover:bg-[#e6ffed] transition-all">
              <div className="contact-icon w-10 h-10 md:w-14 md:h-14 bg-emerald-100 flex items-center justify-center rounded-xl md:rounded-2xl text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.912-.001-3.793-.46-5.467-1.331l-6.53 1.714zm5.868-3.363l.42.249c1.662.984 3.566 1.503 5.507 1.504 5.814 0 10.546-4.731 10.549-10.548 0-2.817-1.097-5.465-3.091-7.458s-4.64-3.091-7.46-3.091c-5.815 0-10.547 4.732-10.55 10.548-.001 1.902.501 3.754 1.455 5.356l.271.456-1.011 3.694 3.8-.996z" />
                </svg>
              </div>
              <div className="contact-text ml-4 md:ml-6 overflow-hidden">
                <h4 className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">WHATSAPP</h4>
                <p className="text-[#0a1e3b] font-bold text-sm md:text-base truncate">{WA_NUMBER}</p>
              </div>
            </a>

            <a href={`mailto:${EMAIL_ADDRESS}`} className="contact-item flex items-center p-4 md:p-6 bg-[#fff5f8] rounded-[20px] md:rounded-[24px] group hover:bg-[#fff0f4] transition-all">
              <div className="contact-icon w-10 h-10 md:w-14 md:h-14 bg-pink-100 flex items-center justify-center rounded-xl md:rounded-2xl text-pink-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="contact-text ml-4 md:ml-6 overflow-hidden">
                <h4 className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">EMAIL</h4>
                <p className="text-[#0a1e3b] font-bold text-sm md:text-base truncate">{EMAIL_ADDRESS}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#050b18] pt-20 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        <div className="max-w-6xl mx-auto flex flex-col items-center relative z-10">
           <h3 className="text-white font-black text-3xl md:text-4xl tracking-tighter mb-4 uppercase text-center">SI-PANDANG</h3>
           <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
              <button onClick={() => { setActiveTab('layanan'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-slate-400 hover:text-amber-500 text-[10px] font-black uppercase tracking-widest transition-colors">Beranda</button>
              <button onClick={() => { setActiveTab('layanan'); document.getElementById('layanan-menu')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-slate-400 hover:text-amber-500 text-[10px] font-black uppercase tracking-widest transition-colors">Layanan</button>
              <a href={WA_LINK} target="_blank" className="text-slate-400 hover:text-amber-500 text-[10px] font-black uppercase tracking-widest transition-colors">Kontak</a>
           </div>
           <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent mb-8"></div>
           <div className="text-center mb-12">
             <p className="text-amber-500/80 text-[11px] font-black uppercase tracking-[0.4em] mb-2 leading-tight">KECAMATAN UJUNG PANDANG</p>
             <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">KOTA MAKASSAR, SULAWESI SELATAN</p>
           </div>
           <div className="pt-8 border-t border-white/5 w-full text-center">
             <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.3em] opacity-60">© 2025 SI-PANDANG. ALL RIGHTS RESERVED.</p>
           </div>
        </div>
      </footer>



      {!showForm && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} onApply={(s) => { setShowForm(true); }} />}
      {showForm && <ApplicationForm initialService={selectedService} onClose={() => { setShowForm(false); setSelectedService(null); }} onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />}
      {selectedReport && <ReportDetailModal submission={selectedReport} onClose={() => setSelectedReport(null)} />}
      {editingReport && <EditReportModal submission={editingReport} onClose={() => setEditingReport(null)} onUpdate={handleUpdateData} isSubmitting={isSubmitting} />}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}
      
      {submitStatus !== 'idle' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 ${submitStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            {submitStatus === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-xs font-bold uppercase tracking-widest">
              {submitStatus === 'success' ? 'Berhasil Terkirim' : 'Gagal Mengirim'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;