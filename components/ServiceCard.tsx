
import React from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onClick: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const getIconStyles = (id: string) => {
    switch (id) {
      case 'kp': return 'bg-amber-400 text-white';
      case 'kgb': return 'bg-blue-500 text-white';
      case 'suket': return 'bg-amber-500 text-white';
      case 'kp4': return 'bg-teal-500 text-white';
      case 'gelar': return 'bg-amber-400 text-white shadow-amber-200';
      case 'ct': return 'bg-emerald-400 text-white';
      case 'cs': return 'bg-red-500 text-white';
      case 'cm': return 'bg-pink-500 text-white';
      case 'cap': return 'bg-violet-500 text-white';
      case 'ib': return 'bg-cyan-500 text-white';
      case 'pensiun': return 'bg-slate-700 text-white';
      case 'mutasi': return 'bg-indigo-500 text-white';
      case 'sl': return 'bg-yellow-600 text-white';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  return (
    <div 
      onClick={() => onClick(service)}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer text-center flex flex-col items-center group h-full"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform ${getIconStyles(service.id)}`}>
        {service.icon}
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1 leading-tight px-1">
        {service.title}
      </h3>
      <p className="text-[10px] text-slate-400 font-medium leading-tight">
        {service.description}
      </p>
    </div>
  );
};
