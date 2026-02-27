import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'layanan' | 'monitoring' | 'pantau-kgb';
  onNavigate: (tab: 'layanan' | 'monitoring' | 'pantau-kgb') => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

const WA_MESSAGE = encodeURIComponent("Halo Sub bagian Umum dan Kepegawaian, saya ingin bertanya tentang kelengkapan berkas.");
const WA_LINK = `https://wa.me/6285242728901?text=${WA_MESSAGE}`;

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onNavigate, isLoggedIn, onLoginClick, onLogout }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-[#0a1e3b] z-[160] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16" />

        {/* Header */}
        <div className="p-8 flex items-center justify-between relative">
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
        <div className="px-4 py-6 flex-1 space-y-2 relative">
          <button 
            onClick={() => { onNavigate('layanan'); onClose(); }}
            className={`w-full flex items-center p-4 rounded-2xl transition-all group ${activeTab === 'layanan' ? 'bg-white/10 text-white font-black' : 'text-white/60 hover:bg-white/5 hover:text-white font-bold'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all ${activeTab === 'layanan' ? 'bg-amber-400 text-slate-900' : 'bg-white/5 group-hover:bg-white/10'}`}>
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
                className={`w-full flex items-center p-4 rounded-2xl transition-all group ${activeTab === 'monitoring' ? 'bg-amber-400 text-slate-900 font-black shadow-xl shadow-amber-900/20' : 'text-white/60 hover:bg-white/5 hover:text-white font-bold'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all ${activeTab === 'monitoring' ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Monitoring</span>
              </button>

              <button 
                onClick={() => { onNavigate('pantau-kgb'); onClose(); }}
                className={`w-full flex items-center p-4 rounded-2xl transition-all group ${activeTab === 'pantau-kgb' ? 'bg-amber-400 text-slate-900 font-black shadow-xl shadow-amber-900/20' : 'text-white/60 hover:bg-white/5 hover:text-white font-bold'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all ${activeTab === 'pantau-kgb' ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Pantau KGB</span>
              </button>
            </>
          )}

          <div className="pt-8 pb-4 px-4">
             <div className="w-full h-[1px] bg-white/10" />
          </div>

          <a 
            href={WA_LINK} 
            target="_blank"
            className="w-full flex items-center p-4 rounded-2xl text-white/60 hover:bg-white/5 hover:text-white font-bold transition-all group"
          >
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mr-4 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.912-.001-3.793-.46-5.467-1.331l-6.53 1.714zm5.868-3.363l.42.249c1.662.984 3.566 1.503 5.507 1.504 5.814 0 10.546-4.731 10.549-10.548 0-2.817-1.097-5.465-3.091-7.458s-4.64-3.091-7.46-3.091c-5.815 0-10.547 4.732-10.55 10.548-.001 1.902.501 3.754 1.455 5.356l.271.456-1.011 3.694 3.8-.996z" /></svg>
            </div>
            <span className="text-xs uppercase tracking-widest">Kontak Admin</span>
          </a>

          {!isLoggedIn ? (
            <button 
              onClick={() => { onLoginClick(); onClose(); }}
              className="w-full flex items-center p-4 rounded-2xl text-white/40 hover:bg-white/5 hover:text-white/60 font-bold transition-all group mt-8 border border-white/5"
            >
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mr-4 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="text-xs uppercase tracking-widest">Login Admin</span>
            </button>
          ) : (
            <button 
              onClick={() => { onLogout(); onClose(); }}
              className="w-full flex items-center p-4 rounded-2xl text-red-400 hover:bg-red-500/10 font-bold transition-all group mt-8 border border-red-500/10"
            >
              <div className="w-10 h-10 bg-red-500/5 rounded-xl flex items-center justify-center mr-4 group-hover:bg-red-500/20 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <span className="text-xs uppercase tracking-widest">Keluar / Logout</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 mt-auto">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-[9px] font-black text-amber-400/50 uppercase tracking-[0.3em] mb-1">Versi 2.0</p>
            <p className="text-[10px] font-medium text-white/30 uppercase">Digitalisasi Kepegawaian</p>
          </div>
        </div>
      </div>
    </>
  );
};