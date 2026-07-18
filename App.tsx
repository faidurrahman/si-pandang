import { DaftarKendaraan } from './components/DaftarKendaraan';
import { DashboardRekapBmd } from './components/DashboardRekapBmd';
import { PageTransition } from "./components/PageTransition";
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { SERVICES, APPS_SCRIPT_URL } from './constants';
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
import { InstallPWA } from './components/InstallPWA';
import { PwaDebugger } from './components/PwaDebugger';
import { PantauKGB } from './components/PantauKGB';
import { LpjKegiatan } from './components/LpjKegiatan';
import { DataPegawaiPage } from './components/DataPegawaiPage';
import { DaftarHadirAdmin } from './components/DaftarHadirAdmin';
import { FormKehadiran } from './components/FormKehadiran';

const SHEET_ID = "1PfITx5bKWrTM9m63L8fomxNf5LicNaDJ5tdpHP-C7GA";

const WA_NUMBER = "085242728901";
const WA_MESSAGE = encodeURIComponent("Halo Sub bagian Umum dan Kepegawaian, saya ingin bertanya tentang layanan SI-PANDANG.");
const WA_LINK = `https://wa.me/62${WA_NUMBER}?text=${WA_MESSAGE}`;
const MAPS_LINK = "https://maps.app.goo.gl/SX1s5Pf62GeDYKaG9";
const EMAIL_ADDRESS = "data.kecujungpandang@gmail.com";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layanan' | 'monitoring' | 'pantau-kgb' | 'rekap-bmd' | 'daftar-kendaraan' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir'>('layanan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Submission | null>(null);
  const [editingReport, setEditingReport] = useState<Submission | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGuidePopup, setShowGuidePopup] = useState(false);

  // Pagination & Monitoring State
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [monitoringSearchTerm, setMonitoringSearchTerm] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGuidePopup');
    if (!hasSeenGuide) {
      const timer = setTimeout(() => setShowGuidePopup(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseGuide = () => {
    localStorage.setItem('hasSeenGuidePopup', 'true');
    setShowGuidePopup(false);
  };

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
    setFetchError(null);
    try {
      console.log("Fetching monitoring data from:", `${APPS_SCRIPT_URL}?action=getData`);
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getData&t=${new Date().getTime()}`, {
        method: "GET",
      });
      
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const text = await response.text();
      console.log("Response text (first 100 chars):", text.substring(0, 100));
      
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
          isRead: cleanStr(columns[9]) === '1',
          additionalFiles: additionalFiles
        };
      }).reverse();
      setSubmissions(data);
    } catch (error: any) {
      console.error("Fetch error detail:", error);
      setFetchError(error.message || "Gagal mengambil data dari server");
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
    return submissions.filter(s => s.status === 'Dalam Proses' && !s.isRead);
  }, [submissions]);

  const pendingSubmissionsCount = unreadSubmissions.length;

  const markAsRead = async (id: string) => {
    // Optimistic update
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, isRead: true } : s));

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: 'markAsRead',
          id: id
        })
      });
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setSubmissions(prev => prev.map(s => ({ ...s, isRead: true })));

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: 'markAllAsRead'
        })
      });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
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

  // Monitoring Pagination Logic
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => 
      sub.nama.toLowerCase().includes(monitoringSearchTerm.toLowerCase()) ||
      sub.nip.toLowerCase().includes(monitoringSearchTerm.toLowerCase()) ||
      sub.layanan.toLowerCase().includes(monitoringSearchTerm.toLowerCase())
    );
  }, [submissions, monitoringSearchTerm]);

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  
  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSubmissions, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [monitoringSearchTerm, itemsPerPage]);

  // Check URL for kegiatan_id to show Form Kehadiran directly
  const queryParams = new URLSearchParams(window.location.search);
  const kegiatanIdFromUrl = queryParams.get('kegiatan_id');

  if (kegiatanIdFromUrl) {
    return <FormKehadiran kegiatanId={kegiatanIdFromUrl} />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-slate-900/80 backdrop-blur-md border-b border-white/10 print:hidden">
        {/* Left Side: Logo & Text */}
        <div className="flex items-center gap-2">
          <img 
            src="https://lh3.googleusercontent.com/d/1BU0DPMBjVe379MQ7Rczjn3_s4DAEa5L9" 
            alt="Logo SI-PANDANG" 
            className="h-8 md:h-10 w-auto object-contain drop-shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-white text-[10px] sm:text-sm md:text-base font-semibold tracking-wide leading-tight whitespace-nowrap">
              PEMERINTAH KOTA MAKASSAR
            </h1>
            <p className="text-[#F59E0B] text-[8px] sm:text-xs md:text-sm font-normal tracking-wider mt-0.5 whitespace-nowrap">
              KECAMATAN UJUNG PANDANG
            </p>
          </div>
        </div>

        {/* Right Side: Icons */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <InstallPWA />
          <a
            href="https://drive.google.com/file/d/1CgfFOfX7Bmo2jM8nfVSTjW-78WlwbgB4/view"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none"
            title="Panduan Penggunaan"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </a>

          {isLoggedIn && (
            <div className="md:relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="group relative p-1.5 sm:p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                
                {pendingSubmissionsCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white text-[8px] sm:text-[9px] font-bold rounded-full ring-2 ring-[#0F172A]">
                    {pendingSubmissionsCount > 9 ? '9+' : pendingSubmissionsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute top-16 left-4 right-4 md:top-full md:right-0 md:left-auto md:w-80 md:mt-2 z-50 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right ring-1 ring-black/5">
                      <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifikasi</h3>
                        {pendingSubmissionsCount > 0 && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">{pendingSubmissionsCount} BARU</span>
                        )}
                      </div>
                      <div className="max-h-[320px] overflow-y-auto">
                        {submissions.slice(0, 10).map((sub) => (
                          <div 
                            key={sub.id} 
                            onClick={() => markAsRead(sub.id)}
                            className={`px-5 py-4 hover:bg-slate-50 border-b border-slate-50 transition-colors cursor-pointer flex gap-3 ${sub.isRead ? 'opacity-60' : 'opacity-100 bg-blue-50/30'}`}
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 font-bold text-xs">
                              {sub.nama.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">
                                {sub.nama}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                                {sub.layanan}
                              </p>
                              <p className="text-[9px] text-amber-600 font-medium mt-1.5">
                                {sub.tanggal}
                              </p>
                            </div>
                            {!sub.isRead && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                            )}
                          </div>
                        ))}
                        {submissions.length === 0 && (
                          <div className="py-12 text-center">
                            <p className="text-xs text-slate-400 font-medium">Tidak ada notifikasi baru</p>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={markAllAsRead} 
                        className="w-full py-3 text-center text-[10px] font-bold text-slate-500 hover:text-amber-600 hover:bg-slate-50 transition-colors border-t border-slate-50 uppercase tracking-wider"
                      >
                        Tandai Semua Dibaca
                      </button>
                    </div>
                  )}
                </div>
              )}

          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-1.5 sm:p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
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

      <section className={`relative overflow-hidden bg-slate-900 pt-32 pb-20 md:pt-40 md:pb-28 shadow-2xl z-10 ${activeTab === 'lpj-kegiatan' ? 'print:hidden' : ''}`}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-blue-500/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"></div>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent opacity-30"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Icon - Minimalist */}
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-2xl mb-6 sm:mb-8 border border-white/10 shadow-lg backdrop-blur-sm ring-1 ring-white/5">
             <svg className="w-6 h-6 md:w-8 md:h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
          </div>

          {/* Typography - Refined */}
          <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
            <h2 className="text-slate-400 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase">
              Selamat Datang di
            </h2>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight mb-3 sm:mb-4">
              SI-PANDANG
            </h1>
            
            <p className="text-slate-400 font-medium max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-2">
              Sistem Informasi Pelayanan Administrasi Kepegawaian<br className="hidden sm:block"/> Kecamatan Ujung Pandang
            </p>
          </div>

          {/* Button - Sleek */}
          <button 
            onClick={() => { setActiveTab('layanan'); setTimeout(() => document.getElementById('layanan-menu')?.scrollIntoView({ behavior: 'smooth' }), 50); }} 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 px-6 sm:px-8 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-1 transition-all duration-300 group text-xs sm:text-sm"
          >
            <span>MULAI LAYANAN</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 -mr-1 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>

      <main id="layanan-menu" className={`relative z-20 ${['data-pegawai', 'daftar-hadir', 'rekap-bmd', 'daftar-kendaraan'].includes(activeTab) ? 'w-full' : 'max-w-7xl'} mx-auto px-4 md:px-6 py-8 md:py-12 -mt-6 md:-mt-4 w-full flex-grow print:p-0 print:m-0 print:max-w-none`}>
        <PageTransition activeTab={activeTab}>
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
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#0a1e3b]">Monitoring Layanan</h2>
                  <p className="text-slate-400 text-[10px] md:text-xs font-medium mt-1">Pantau status pengajuan berkas kepegawaian Anda.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search Box */}
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Cari data..." 
                      value={monitoringSearchTerm}
                      onChange={(e) => setMonitoringSearchTerm(e.target.value)}
                      className="w-full sm:w-48 pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-sm"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Refresh Button */}
                  <button 
                    onClick={fetchSubmissions}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-[10px] md:text-xs flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 mr-2 ${isLoadingReports ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Segarkan
                  </button>
                </div>
             </div>

             {/* Show Entries Dropdown */}
             <div className="flex justify-end w-full mb-3">
               <div className="flex items-center gap-2">
                 <span className="text-sm text-slate-600 font-medium">Show</span>
                 <select 
                   value={itemsPerPage} 
                   onChange={(e) => setItemsPerPage(Number(e.target.value))}
                   className="w-auto px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                 >
                   {[5, 10, 20, 30, 50, 100].map(num => (
                     <option key={num} value={num}>{num}</option>
                   ))}
                 </select>
               </div>
             </div>

             <ReportsTable submissions={paginatedSubmissions} onViewDetail={setSelectedReport} onEdit={setEditingReport} />

             {isLoadingReports && submissions.length === 0 && (
               <div className="py-10 text-center text-slate-500 font-medium">
                 <div className="flex justify-center items-center space-x-2 mb-3">
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                 </div>
                 Loading data...
               </div>
             )}
             
             {fetchError && (
               <div className="py-6 text-center text-red-500 font-medium bg-red-50 rounded-xl border border-red-100 mt-4">
                 Error: {fetchError}
               </div>
             )}

             {/* Pagination Controls */}
             {filteredSubmissions.length > 0 && (
               <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                 <p className="text-slate-500 font-medium text-center md:text-left">
                   Menampilkan <span className="font-bold text-[#0a1e3b]">{(currentPage - 1) * itemsPerPage + 1}</span> sampai <span className="font-bold text-[#0a1e3b]">{Math.min(currentPage * itemsPerPage, filteredSubmissions.length)}</span> dari <span className="font-bold text-[#0a1e3b]">{filteredSubmissions.length}</span> data
                 </p>
                 
                 <div className="flex items-center space-x-1">
                   <button 
                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                     disabled={currentPage === 1}
                     className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                   >
                     Previous
                   </button>
                   
                   <div className="flex space-x-1">
                    {(() => {
                        const pages = [];
                        const maxVisibleButtons = 5;
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
                        
                        if (endPage - startPage + 1 < maxVisibleButtons) {
                          startPage = Math.max(1, endPage - maxVisibleButtons + 1);
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`w-8 h-8 rounded-lg font-bold transition-colors flex items-center justify-center ${
                                currentPage === i 
                                  ? 'bg-[#0a1e3b] text-white border border-[#0a1e3b]' 
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }
                        return pages;
                    })()}
                   </div>

                   <button 
                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                     disabled={currentPage === totalPages}
                     className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                   >
                     Next
                   </button>
                 </div>
               </div>
             )}
          </div>
         ) : activeTab === 'pantau-kgb' ? (
          <PantauKGB />
        ) : activeTab === 'rekap-bmd' ? (
          <DashboardRekapBmd />
        ) : activeTab === 'daftar-kendaraan' ? (
          <DaftarKendaraan />
        ) : activeTab === 'lpj-kegiatan' ? (
          <LpjKegiatan />
        ) : activeTab === 'data-pegawai' ? (
          <DataPegawaiPage />
        ) : activeTab === 'daftar-hadir' ? (
          <DaftarHadirAdmin />
        ) : null}
        </PageTransition>
      </main>

      {activeTab === 'layanan' && (
      <section className="contact-section max-w-4xl mx-auto px-4 md:px-6 mb-20 md:mb-32">
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-10 w-full max-w-lg mx-auto">
          <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8 space-y-3">
            <div className="text-blue-500">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Kontak Admin</h2>
          </div>

          <div className="contact-container space-y-3 sm:space-y-4">
            <a href={MAPS_LINK} target="_blank" className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 group cursor-pointer w-full">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">ALAMAT</h4>
                <p className="text-xs sm:text-base font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">Jl. Samiun No. 15, Kota Makassar</p>
              </div>
            </a>

            <a href={WA_LINK} target="_blank" className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 group cursor-pointer w-full">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.912-.001-3.793-.46-5.467-1.331l-6.53 1.714zm5.868-3.363l.42.249c1.662.984 3.566 1.503 5.507 1.504 5.814 0 10.546-4.731 10.549-10.548 0-2.817-1.097-5.465-3.091-7.458s-4.64-3.091-7.46-3.091c-5.815 0-10.547 4.732-10.55 10.548-.001 1.902.501 3.754 1.455 5.356l.271.456-1.011 3.694 3.8-.996z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">WHATSAPP</h4>
                <p className="text-xs sm:text-base font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{WA_NUMBER}</p>
              </div>
            </a>

            <a href={`mailto:${EMAIL_ADDRESS}`} className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 group cursor-pointer w-full">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">EMAIL</h4>
                <p className="text-xs sm:text-base font-semibold text-slate-700 group-hover:text-blue-700 transition-colors break-all line-clamp-2">{EMAIL_ADDRESS}</p>
              </div>
            </a>
          </div>
        </div>
      </section>
      )}

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

      {/* Guide Popup */}
      {showGuidePopup && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-[400px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6 shadow-inner">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-[#0a1e3b] mb-2">Buku Panduan SI-PANDANG</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Selamat datang! Untuk memudahkan Anda dalam menggunakan layanan administrasi kepegawaian, kami telah menyediakan buku panduan lengkap.
              </p>
              <div className="flex flex-col w-full space-y-3">
                <a
                  href="https://drive.google.com/file/d/1CgfFOfX7Bmo2jM8nfVSTjW-78WlwbgB4/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCloseGuide}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Buka Buku Panduan
                </a>
                <button
                  onClick={handleCloseGuide}
                  className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-colors"
                >
                  Lain Kali
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <PwaDebugger />
    </div>
  );
};

export default App;