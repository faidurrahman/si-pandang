import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * PENTING: Inisialisasi shim process.env sebelum modul lain dimuat.
 * Ini memetakan VITE_GOOGLE_GENERATIVE_AI_API_KEY dari Vite ke process.env.API_KEY 
 * sesuai dengan persyaratan SDK Google GenAI.
 */
if (typeof window !== 'undefined') {
  // Pastikan objek process dan process.env tersedia secara global di browser
  (window as any).process = (window as any).process || { env: {} };
  (window as any).process.env = (window as any).process.env || {};

  // Ambil API Key dari environment variable Vite
  const viteApiKey = (import.meta as any).env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (viteApiKey) {
    (window as any).process.env.API_KEY = viteApiKey;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}