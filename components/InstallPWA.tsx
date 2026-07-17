import React, { useEffect, useState } from 'react';

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Aplikasi ini sudah diinstal atau browser tidak mendukung fitur instalasi PWA.");
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  if (!deferredPrompt) {
    // Tampilkan tombol yang disabled, atau ikon yang berbeda jika ingin
    // Tapi untuk UI yang bersih, bisa juga kita tampilkan tombol yang memberi info jika diklik
    return (
      <button
        onClick={handleInstallClick}
        className="p-1.5 sm:p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none"
        title="Instal Aplikasi"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      </button>
    );
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
