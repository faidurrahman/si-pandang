import React from 'react';
import { Service } from '../types';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
  onApply: (service: Service) => void;
}

const WA_MESSAGE = encodeURIComponent("Halo Sub bagian Umum dan Kepegawaian, saya ingin bertanya tentang kelengkapan berkas.");
const WA_LINK = `https://wa.me/6285242728901?text=${WA_MESSAGE}`;

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onApply }) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[2px]">
      <div className="bg-white rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-8 pb-4 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-amber-100 flex-shrink-0">
              {service.icon}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#0a192f] leading-tight">
                {service.title}
              </h2>
              <p className="text-amber-500 text-[11px] font-bold mt-1">
                {service.description}
              </p>
              <p className="text-amber-500 text-[11px] font-medium opacity-80">
                Pengajuan {service.title.toLowerCase()} dengan persyaratan lengkap
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <hr className="mx-8 border-slate-100" />

        <div className="p-8 pt-6 max-h-[65vh] overflow-y-auto">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-4 bg-[#0a192f] rounded-full"></div>
            <h3 className="text-sm font-extrabold text-[#0a192f]">Persyaratan Berkas</h3>
          </div>

          <ul className="space-y-3">
            {service.requirements.map((req) => (
              <li key={req.id} className="group relative flex items-center p-4 bg-slate-50/50 rounded-2xl border-l-[3px] border-amber-400/30 hover:border-amber-400 hover:bg-white transition-all duration-200 shadow-sm">
                <div className="h-6 w-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-4 text-slate-600 text-[11px] font-medium leading-relaxed">
                  {req.label}
                </p>
              </li>
            ))}
          </ul>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-amber-400/20 flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-sm flex-shrink-0">
              i
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Untuk informasi lebih lengkap, hubungi bagian kepegawaian melalui WhatsApp atau kunjungi kantor kami.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 pt-2 grid grid-cols-3 gap-3">
          <button 
            onClick={onClose}
            className="py-4 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-xs transition-colors"
          >
            Tutup
          </button>
          <a 
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="py-4 px-2 bg-[#22C55E] hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-100 flex items-center justify-center transition-all"
          >
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            Hubungi Admin
          </a>
          <button 
            onClick={() => onApply(service)}
            className="py-4 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-amber-100 transition-all"
          >
            Ajukan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};