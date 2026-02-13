import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Setup environment variable untuk SDK Gemini agar sesuai dengan pedoman process.env.API_KEY
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
  const viteEnv = (import.meta as any).env;
  if (viteEnv) {
    (window as any).process.env.API_KEY = viteEnv.VITE_GOOGLE_GENERATIVE_AI_API_KEY || viteEnv.API_KEY;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}