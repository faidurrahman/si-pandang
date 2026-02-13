import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Inisialisasi global process jika belum ada
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
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