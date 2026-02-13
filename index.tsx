
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Bridge untuk kompatibilitas Vite/Vercel:
// SDK Gemini mengharapkan API Key di process.env.API_KEY.
// Kita mendefinisikannya secara global agar tidak terjadi ReferenceError di browser.
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
  (window as any).process.env = (window as any).process.env || {};
  
  // Mengambil API Key dari environment variable Vite
  (window as any).process.env.API_KEY = 
    (import.meta as any).env?.VITE_GOOGLE_GENERATIVE_AI_API_KEY || 
    (import.meta as any).env?.API_KEY;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
