import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary';
import { registerSW } from 'virtual:pwa-register';

// Mendaftarkan service worker untuk PWA
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      if (confirm("Versi terbaru aplikasi tersedia. Muat ulang sekarang?")) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log("Aplikasi siap digunakan secara offline.");
    },
  });
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary><App /></ErrorBoundary>
    </React.StrictMode>
  );
}
