
import React from 'react';
import ReactDOM from 'react-dom/client';

// Pastikan process.env terisi dari import.meta.env SEBELUM App di-import
// Ini mencegah error hoisting pada modul yang bergantung pada process.env
if (typeof window !== 'undefined') {
  const env = (import.meta as any).env;
  if (env) {
    (window as any).process.env.API_KEY = env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || env.API_KEY;
  }
}

// Import App diletakkan setelah inisialisasi shim env
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
