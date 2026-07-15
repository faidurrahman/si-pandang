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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] md:rounded-[32px] w-[92%] md:w-full max-w-[600px] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-6 md:p-8 pb-4 flex items-start justify-between flex-shrink-0">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 text-2xl md:text-3xl flex-shrink-0">
              {service.icon}
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-extrabold text-[#0a192f] leading-tight">
                {service.title}
              </h2>
              <p className="text-slate-500 text-[10px] md:text-[11px] font-medium mt-1">
                {service.description}
              </p>
              <p className="text-slate-400 text-[10px] md:text-[11px] font-medium opacity-80 mt-0.5">
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

        <hr className="mx-6 md:mx-8 border-slate-100" />

        <div className="p-6 md:p-8 pt-6 overflow-y-auto max-h-[50vh] flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            <h3 className="text-sm font-extrabold text-[#0a192f]">Persyaratan Berkas</h3>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {service.requirements.map((req) => (
              <li key={req.id} className="group relative flex items-start p-3 md:p-4 bg-white border border-slate-200 rounded-xl transition-all duration-200 shadow-sm hover:border-blue-300 hover:shadow-md">
                <div className="mt-0.5 h-5 w-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-slate-600 text-[10px] md:text-[11px] font-medium leading-relaxed">
                  {req.label}
                </p>
              </li>
            ))}
          </ul>

          {service.downloadUrl && (
            <a 
              href={service.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-xl md:rounded-2xl hover:bg-blue-100 transition-colors group"
            >
              <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-white group-hover:scale-110 transition-all shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[9px] md:text-[10px] font-bold text-blue-800 uppercase tracking-wide opacity-70">
                  Dokumen Pendukung
                </p>
                <p className="text-[10px] md:text-[11px] font-bold text-blue-900">
                  {service.downloadLabel || 'Download Format Dokumen'}
                </p>
              </div>
              <svg className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}

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
        <div className="p-6 md:p-8 pt-4 border-t border-slate-100 flex flex-col-reverse md:flex-row items-center justify-end gap-3 flex-shrink-0 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="w-full md:w-auto py-2.5 px-5 text-slate-500 hover:text-slate-700 font-medium text-xs transition-colors"
          >
            Tutup
          </button>
          <a 
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto py-2.5 px-5 border border-green-500 text-green-600 hover:bg-green-50 rounded-xl font-semibold text-xs flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.912-.001-3.793-.46-5.467-1.331l-6.53 1.714zm5.868-3.363l.42.249c1.662.984 3.566 1.503 5.507 1.504 5.814 0 10.546-4.731 10.549-10.548 0-2.817-1.097-5.465-3.091-7.458s-4.64-3.091-7.46-3.091c-5.815 0-10.547 4.732-10.55 10.548-.001 1.902.501 3.754 1.455 5.356l.271.456-1.011 3.694 3.8-.996z" />
            </svg>
            Hubungi Admin
          </a>
          <button 
            onClick={() => onApply(service)}
            className="w-full md:w-auto py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-200 flex items-center justify-center transition-all"
          >
            Ajukan Sekarang
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};