import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Mendaftarkan service worker untuk PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Versi terbaru aplikasi tersedia. Muat ulang sekarang?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("Aplikasi siap digunakan secara offline.");
  },
});

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
