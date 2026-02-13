
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Sinkronisasi ulang process.env dari Vite environment jika shim HTML belum terisi
if (typeof window !== 'undefined' && (window as any).process) {
  const env = (import.meta as any).env;
  if (env && !(window as any).process.env.API_KEY) {
    (window as any).process.env.API_KEY = env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || env.API_KEY;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Gagal melakukan rendering aplikasi:", error);
  }
}
