import React, { useState, useMemo, useEffect } from 'react';
import { SERVICES } from './constants';
import { Service } from './types';
import { ServiceCard } from './components/ServiceCard';
import { ServiceModal } from './components/ServiceModal';
import { ApplicationForm } from './components/ApplicationForm';
import { InfoBoard } from './components/InfoBoard';

// URL Terbaru yang Anda berikan
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzV-HCizIkStig-rLD6ssKl8pjkEvYkBeC-7mlA3_LyF9dLjsOPHRQl4hFwze4I-x3L/exec";
const DRIVE_FOLDER_ID = "1SZpfSrz--Q1NBI4mfc1Or1Exs3jzsOow";
const SHEET_ID = "1PfITx5bKWrTM9m63L8fomxNf5LicNaDJ5tdpHP-C7GA";

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const filteredServices = useMemo(() => {
    return SERVICES.filter(s => {
      return s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
             s.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const scrollToServices = () => {
    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenForm = (service: Service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const payload = {
      ...data,
      folderId: DRIVE_FOLDER_ID,
      sheetId: SHEET_ID,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'long' })
    };

    try {
      // Menggunakan fetch dengan mode no-cors untuk kompatibilitas Apps Script
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      // Jika tidak ada error koneksi, kita anggap selesai (karena no-cors tidak mengembalikan status)
      setIsSubmitting(false);
      setShowForm(false);
      setSubmitStatus('success');
      
      // Reset status setelah 6 detik
      setTimeout(() => setSubmitStatus('idle'), 6000);
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      
      // Reset status setelah 6 detik
      setTimeout(() => setSubmitStatus('idle'), 6000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Notifikasi Status: Selesai / Gagal */}
      <div className="fixed top-6 right-6 z-[200] space-y-3 pointer-events-none">
        {submitStatus === 'success' && (
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 animate-in slide-in-from-right-10 border border-emerald-400 pointer-events-auto">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-black text-sm">Pengajuan Selesai!</p>
              <p className="text-[10px] font-bold opacity-90 uppercase tracking-tight">Berkas telah terkirim ke sistem SI-PANDANG.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-4 animate-in slide-in-from-right-10 border border-rose-400 pointer-events-auto">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="font-black text-sm">Pengajuan Gagal!</p>
              <p className="text-[10px] font-bold opacity-90 uppercase tracking-tight">Terjadi kesalahan teknis. Silakan coba lagi.</p>
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <section className="hero-bg relative min-h-[40vh] md:min-h-[45vh] pt-8 pb-16 flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-7xl px-8 flex justify-end mb-2 relative z-20">
          <button className="text-white p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 -mt-4">
          <div className="hero-icon-container w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-4 relative">
            <div className="relative">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 bg-emerald-500 rounded-full border-[3px] border-[#7c3aed] flex items-center justify-center">
                 <svg className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                 </svg>
              </div>
            </div>
          </div>

          <div className="badge-portal px-4 py-1 rounded-full mb-4">
            <span className="text-amber-400 text-[9px] md:text-[10px] font-bold tracking-wide">Portal Resmi Kepegawaian</span>
          </div>

          <h2 className="text-white text-xl md:text-2xl font-bold mb-0.5 tracking-tight uppercase">
            Selamat Datang di
          </h2>
          <h1 className="text-amber-400 text-3xl md:text-4xl font-black mb-4 tracking-tighter uppercase">
            SI-PANDANG
          </h1>

          <p className="text-white/80 text-[11px] md:text-xs max-w-lg mx-auto mb-6 leading-relaxed font-medium">
            Portal Layanan Kepegawaian ASN Terintegrasi Kecamatan Ujung Pandang. Solusi Cepat untuk Administrasi Digital Anda.
          </p>

          <button 
            onClick={scrollToServices}
            className="btn-mulai text-white px-8 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xl w-full max-w-[240px]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span>Mulai Layanan</span>
          </button>
        </div>

        <div className="wave-bottom">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
            </svg>
        </div>
      </section>

      <main id="services-section" className="relative z-20 max-w-7xl mx-auto px-6 py-10 md:py-16 -mt-4">
        <div className="mb-12 text-center">
            <h2 className="text-xl md:text-2xl font-black text-[#0a192f] tracking-tight">Layanan Kepegawaian</h2>
            <div className="w-12 h-1 bg-amber-400 mx-auto mt-2.5 rounded-full"></div>
            
            <div className="mt-8 relative max-w-xl mx-auto">
                <input 
                  type="text" 
                  placeholder="Cari layanan administrasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 transition-all text-sm font-medium outline-none shadow-sm"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
            </div>
        </div>

        <InfoBoard />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-10 mb-16">
          {filteredServices.map(service => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onClick={(s) => { setSelectedService(s); setShowForm(false); }} 
            />
          ))}
        </div>

        <div className="max-w-md mx-auto mb-16">
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-50">
            <div className="flex items-center space-x-3 mb-6">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="text-lg font-bold text-[#0a192f]">Kontak Admin</h3>
            </div>

            <div className="space-y-3">
              <a 
                href="https://maps.app.goo.gl/1auvZcbvmyoSPsUUA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-[#f8faff] rounded-xl group hover:bg-[#eff4ff] transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Alamat</p>
                    <p className="text-[11px] font-bold text-[#0a192f] leading-snug max-w-[180px]">
                      Jl. Samiun No. 15, Kota Makassar
                    </p>
                  </div>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <a 
                href="https://wa.me/6285242728901" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-[#f8fff9] rounded-xl group hover:bg-[#f0fff2] transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-sm shadow-green-100">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.912-.001-3.793-.46-5.467-1.331l-6.53 1.714zm5.868-3.363l.42.249c1.662.984 3.566 1.503 5.507 1.504 5.814 0 10.546-4.731 10.549-10.548 0-2.817-1.097-5.465-3.091-7.458s-4.64-3.091-7.46-3.091c-5.815 0-10.547 4.732-10.55 10.548-.001 1.902.501 3.754 1.455 5.356l.271.456-1.011 3.694 3.8-.996z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp</p>
                    <p className="text-[11px] font-bold text-[#0a192f]">085242728901</p>
                  </div>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                </svg>
              </a>

              <a 
                href="mailto:data.kecujungpandang@gmail.com" 
                className="flex items-center justify-between p-3.5 bg-[#fff9fe] rounded-xl group hover:bg-[#fff0fc] transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-500 shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-[11px] font-bold text-[#0a192f]">data.kecujungpandang@gmail.com</p>
                  </div>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#041126] text-white pt-12 pb-10 px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 mb-5 text-center md:text-left">
            <div className="hero-icon-container w-14 h-14 rounded-2xl flex items-center justify-center text-white relative">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-bold tracking-tight">SI-PANDANG</h3>
              <p className="text-white/60 text-[10px] font-medium uppercase">
                Kecamatan Ujung Pandang, Kota Makassar
              </p>
            </div>
          </div>
          <div className="w-full border-t border-white/10 my-6"></div>
          <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest text-center">
            © 2026 SI-PANDANG. All rights reserved.
          </p>
        </div>
      </footer>

      {!showForm && (
        <ServiceModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
          onApply={handleOpenForm}
        />
      )}
      
      {showForm && (
        <ApplicationForm 
          initialService={selectedService}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default App;