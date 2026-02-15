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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0a1e3b]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-[400px] overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-white/20">
        
        {/* Header */}
        <div className="p-8 pb-4 text-center">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-amber-900/10">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#0a1e3b] tracking-tight uppercase">Admin Login</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">SI-PANDANG Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#0a1e3b] mb-2 uppercase tracking-widest">Username</label>
            <input 
              type="text"
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-700 placeholder-slate-300 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-sm font-medium"
              placeholder="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#0a1e3b] mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-700 placeholder-slate-300 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-sm font-medium"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Username atau Password Salah!</p>
            </div>
          )}

          <div className="pt-4 flex space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-900/10 transition-all active:scale-95"
            >
              Masuk Sekarang
            </button>
          </div>
        </form>

        <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
             Sistem Informasi Pelayanan Kepegawaian<br/>Kecamatan Ujung Pandang
           </p>
        </div>
      </div>
    </div>
  );
};