import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'laporan-pjlp' | 'data-pegawai' | 'daftar-hadir' | 'rekap-bmd' | 'daftar-kendaraan';
  onNavigate: (tab: 'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'laporan-pjlp' | 'data-pegawai' | 'daftar-hadir' | 'rekap-bmd' | 'daftar-kendaraan') => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  visitorCount?: number | null;
}

const WA_MESSAGE = encodeURIComponent("Halo Sub bagian Umum dan Kepegawaian, saya ingin bertanya tentang kelengkapan berkas.");
const WA_LINK = `https://wa.me/6285242728901?text=${WA_MESSAGE}`;

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onNavigate, isLoggedIn, onLoginClick, onLogout, visitorCount }) => {
  const [isLaporanOpen, setIsLaporanOpen] = React.useState(activeTab === 'lpj-kegiatan' || activeTab === 'laporan-pjlp');

  // Update accordion state if activeTab changes externally
  React.useEffect(() => {
    if (activeTab === 'lpj-kegiatan' || activeTab === 'laporan-pjlp') {
      setIsLaporanOpen(true);
    }
  }, [activeTab]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-slate-900/95 backdrop-blur-md border-l border-white/10 z-[160] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

        {/* Header */}
        <div className="p-8 flex items-center justify-between relative border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-900/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-black text-lg tracking-tight uppercase">SI-PANDANG</h2>
              <p className="text-amber-400/60 text-[8px] font-bold uppercase tracking-[0.2em]">Navigasi Utama</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-all border border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-6 flex-1 flex flex-col space-y-2 relative">
          <button 
            onClick={() => { onNavigate('layanan'); onClose(); }}
            className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'layanan' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}`}
          >
            <div className={`flex items-center justify-center transition-all ${activeTab === 'layanan' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xs uppercase tracking-widest">Beranda</span>
          </button>

          {isLoggedIn && (
            <>
              <button 
                onClick={() => { onNavigate('monitoring'); onClose(); }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'monitoring' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}`}
              >
                <div className={`flex items-center justify-center transition-all ${activeTab === 'monitoring' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Monitoring</span>
              </button>

              <button 
                onClick={() => { onNavigate('pantau-kgb'); onClose(); }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'pantau-kgb' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}`}
              >
                <div className={`flex items-center justify-center transition-all ${activeTab === 'pantau-kgb' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Pantau KGB</span>
              </button>
              <button 
                onClick={() => { onNavigate('rekap-bmd'); onClose(); }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'rekap-bmd' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}`}
              >
                <div className={`flex items-center justify-center transition-all ${activeTab === 'rekap-bmd' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Rekap BMD</span>
              </button>
              <button 
                onClick={() => { onNavigate('daftar-kendaraan'); onClose(); }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'daftar-kendaraan' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}`}
              >
                <div className={`flex items-center justify-center transition-all ${activeTab === 'daftar-kendaraan' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Daftar Kendaraan</span>
              </button>

              <div className="flex flex-col">
                <button 
                  onClick={() => setIsLaporanOpen(!isLaporanOpen)}
                  className={`w-full px-4 py-3 flex items-center justify-between transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'lpj-kegiatan' || activeTab === 'laporan-pjlp' ? 'bg-blue-500/5 text-blue-400 font-semibold rounded-xl' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center transition-all ${activeTab === 'lpj-kegiatan' || activeTab === 'laporan-pjlp' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-xs uppercase tracking-widest">Laporan</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isLaporanOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isLaporanOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <button 
                    onClick={() => { onNavigate('lpj-kegiatan'); onClose(); }}
                    className={`w-full pl-12 pr-4 py-2 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'lpj-kegiatan' ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'lpj-kegiatan' ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
                    <span className="text-[11px] uppercase tracking-widest">LPJ Kegiatan</span>
                  </button>
                  <button 
                    onClick={() => { onNavigate('laporan-pjlp'); onClose(); }}
                    className={`w-full pl-12 pr-4 py-2 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'laporan-pjlp' ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-white'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'laporan-pjlp' ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
                    <span className="text-[11px] uppercase tracking-widest">Laporan PJLP / Satgas</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={() => { onNavigate('data-pegawai'); onClose(); }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'data-pegawai' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}`}
              >
                <div className={`flex items-center justify-center transition-all ${activeTab === 'data-pegawai' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Data Pegawai</span>
              </button>
              
              <button 
                onClick={() => { onNavigate('daftar-hadir'); onClose(); }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'daftar-hadir' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}`}
              >
                <div className={`flex items-center justify-center transition-all ${activeTab === 'daftar-hadir' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Daftar Hadir</span>
              </button>
            </>
          )}

          <div className="pt-8 pb-4 px-4">
             <div className="w-full h-[1px] bg-white/10" />
          </div>

          <a 
            href="https://drive.google.com/file/d/1CgfFOfX7Bmo2jM8nfVSTjW-78WlwbgB4/view" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200 ease-in-out cursor-pointer group"
          >
            <div className="flex items-center justify-center transition-all text-slate-400 group-hover:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <span className="text-xs uppercase tracking-widest">Panduan Penggunaan</span>
          </a>

          <a 
            href={WA_LINK} 
            target="_blank"
            className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200 ease-in-out cursor-pointer group"
          >
            <div className="flex items-center justify-center transition-all text-slate-400 group-hover:text-emerald-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.912-.001-3.793-.46-5.467-1.331l-6.53 1.714zm5.868-3.363l.42.249c1.662.984 3.566 1.503 5.507 1.504 5.814 0 10.546-4.731 10.549-10.548 0-2.817-1.097-5.465-3.091-7.458s-4.64-3.091-7.46-3.091c-5.815 0-10.547 4.732-10.55 10.548-.001 1.902.501 3.754 1.455 5.356l.271.456-1.011 3.694 3.8-.996z" /></svg>
            </div>
            <span className="text-xs uppercase tracking-widest">Kontak Admin</span>
          </a>

          {!isLoggedIn ? (
            <button 
              onClick={() => { onLoginClick(); onClose(); }}
              className="mt-auto w-full px-4 py-3 flex items-center gap-3 text-slate-400 font-medium hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200 ease-in-out cursor-pointer group border border-white/5"
            >
              <div className="flex items-center justify-center transition-all text-slate-500 group-hover:text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="text-xs uppercase tracking-widest">Login Admin</span>
            </button>
          ) : (
            <button 
              onClick={() => { onLogout(); onClose(); }}
              className="mt-auto border border-slate-700/50 text-slate-300 rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 cursor-pointer w-full group"
            >
              <div className="flex items-center justify-center transition-all text-slate-400 group-hover:text-rose-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="text-xs uppercase tracking-widest">Keluar / Logout</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 mt-auto flex flex-col gap-3">
          {visitorCount !== undefined && visitorCount !== null && (
            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Pengunjung</span>
              </div>
              <span className="text-xl font-black text-white">{visitorCount.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-[9px] font-black text-amber-400/50 uppercase tracking-[0.3em] mb-1">Versi 2.0</p>
            <p className="text-[10px] font-medium text-white/30 uppercase">Digitalisasi Kepegawaian</p>
          </div>
        </div>
      </div>
    </>
  );
};