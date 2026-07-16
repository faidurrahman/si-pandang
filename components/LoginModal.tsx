import React, { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (success: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'superadmin' && password === 'samiun15') {
      onLogin(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-8 pb-2 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-5">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Admin Login</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">SI-PANDANG Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Username</label>
            <input 
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
            <input 
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-center">
              <p className="text-xs font-bold text-rose-600">Username atau Password Salah!</p>
            </div>
          )}

          <div className="pt-2 flex space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm transition-all"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
            >
              Masuk Sekarang
            </button>
          </div>
        </form>

        <div className="p-5 bg-slate-50 text-center border-t border-slate-100">
           <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-relaxed">
             Sistem Informasi Pelayanan Kepegawaian<br/>Kecamatan Ujung Pandang
           </p>
        </div>
      </div>
    </div>
  );
};