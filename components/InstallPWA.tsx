import React, { useEffect, useState } from 'react';

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Periksa langsung jika event sudah ditangkap oleh script di index.html sebelum komponen di-mount
    if ((window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
    }

    // 2. Listener untuk event beforeinstallprompt jika baru terpicu setelah komponen di-mount
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Polling interval kecil untuk memantau window.deferredPrompt guna menghindari race condition
    const interval = setInterval(() => {
      if ((window as any).deferredPrompt && !deferredPrompt) {
        setDeferredPrompt((window as any).deferredPrompt);
      }
    }, 500);

    // 4. Listener saat aplikasi sukses diinstal agar tombol otomatis menghilang
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(interval);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPrompt;
    if (!promptEvent) {
      return;
    }
    
    // Tampilkan prompt instalasi native
    promptEvent.prompt();
    
    // Tunggu pilihan user
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // Bersihkan prompt agar tidak bisa digunakan ulang
    setDeferredPrompt(null);
    (window as any).deferredPrompt = null;
  };

  if (!deferredPrompt && !(window as any).deferredPrompt) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      className="p-1.5 sm:p-2 rounded-full text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-all duration-200 focus:outline-none relative group"
      title="Instal Aplikasi ke Layar Utama"
    >
      <svg className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
      </span>
    </button>
  );
};
