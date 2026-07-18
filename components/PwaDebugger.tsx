import React, { useEffect, useState } from 'react';

export const PwaDebugger: React.FC = () => {
  const [manifestJsonStatus, setManifestJsonStatus] = useState<string>('Checking...');
  const [swStatus, setSwStatus] = useState<string>('Checking...');
  const [swRegStatus, setSwRegStatus] = useState<string>('Checking...');
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    // Check /manifest.json
    fetch('/manifest.json')
      .then((res) => {
        if (res.ok) {
          setManifestJsonStatus(`OK (${res.status})`);
        } else {
          setManifestJsonStatus(`Error (${res.status})`);
        }
      })
      .catch((err) => {
        setManifestJsonStatus(`Failed: ${err.message || err}`);
      });

    // Check /sw.js
    fetch('/sw.js')
      .then((res) => {
        if (res.ok) {
          setSwStatus(`OK (${res.status})`);
        } else {
          setSwStatus(`Error (${res.status})`);
        }
      })
      .catch((err) => {
        setSwStatus(`Failed: ${err.message || err}`);
      });

    // Check Service Worker Registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          setSwRegStatus(`Active (Scope: ${reg.scope})`);
        } else {
          setSwRegStatus('Not Registered');
        }
      }).catch(err => {
        setSwRegStatus(`Error: ${err.message}`);
      });
    } else {
      setSwRegStatus('Not Supported');
    }

    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-slate-900 text-slate-100 px-3 py-1.5 rounded-full text-xs font-mono shadow-lg border border-slate-700 hover:bg-slate-800 transition-all"
      >
        🛠️ PWA Status
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-slate-950/95 text-slate-200 p-4 rounded-xl shadow-2xl border border-slate-800 font-mono text-xs max-w-sm backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <span className="font-bold text-amber-400">🔍 PWA Debugger</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-200 text-sm font-bold px-1"
        >
          ×
        </button>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">manifest.json:</span>
          <span className={manifestJsonStatus.includes('OK') ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {manifestJsonStatus}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">sw.js fetch:</span>
          <span className={swStatus.includes('OK') ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {swStatus}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">SW Status:</span>
          <span className={swRegStatus.includes('Active') ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
            {swRegStatus}
          </span>
        </div>
        <div className="flex justify-between gap-4 border-t border-slate-900 pt-1.5 mt-1.5">
          <span className="text-slate-400">Install Prompt State:</span>
          <span className={(window as any).deferredPrompt ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-500'}>
            {(window as any).deferredPrompt ? 'READY (Prompt Avail)' : 'NOT READY'}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Display Mode:</span>
          <span className={isStandalone ? 'text-amber-400 font-bold' : 'text-slate-500'}>
            {isStandalone ? 'STANDALONE (Installed)' : 'BROWSER'}
          </span>
        </div>
      </div>
    </div>
  );
};
