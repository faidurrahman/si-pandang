import fs from 'fs';
let content = fs.readFileSync('components/ApplicationForm.tsx', 'utf8');

// 1. Header & Ikon
content = content.replace(
  'bg-amber-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-100',
  'bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600'
);
content = content.replace(
  'rounded-full border-2 border-white flex items-center justify-center',
  'rounded-full flex items-center justify-center'
);
content = content.replace(
  'text-white" fill="none',
  'text-blue-600" fill="none'
);
content = content.replace(
  'text-lg md:text-xl font-extrabold text-[#0a192f]',
  'text-xl font-bold text-slate-800'
);
content = content.replace(
  'text-amber-500 text-[10px] md:text-[11px] font-bold mt-1 uppercase tracking-wide',
  'text-sm font-semibold text-blue-600 uppercase tracking-wider mt-1'
);

// 2. Input Fields
// Labels
content = content.replace(/block text-\[10px\] md:text-\[11px\] font-bold text-\[\#0a192f\] mb-1\.5 md:mb-2/g, 'text-sm font-semibold text-slate-700 mb-1.5 block');
// Inputs (Nama, NIP)
content = content.replace(
  /w-full px-4 md:px-5 py-2\.5 md:py-3\.5 rounded-xl border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-xs md:text-sm disabled:bg-slate-50/g,
  'w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-700 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 disabled:opacity-50 border-0'
);
// Select (Layanan)
content = content.replace(
  /w-full px-4 md:px-5 py-2\.5 md:py-3\.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-xs md:text-sm appearance-none disabled:bg-slate-50/g,
  'w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 appearance-none disabled:opacity-50 border-0'
);

// 3. Area Upload Berkas
content = content.replace(
  'w-full py-4 border-2 border-dashed border-amber-400/50 bg-amber-50/30 rounded-2xl flex flex-col items-center justify-center group-hover:bg-amber-50 transition-colors',
  'border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors w-full'
);
content = content.replace(
  'text-amber-500 mb-1.5',
  'text-blue-500 mb-2'
);
// Replace SVG with Plus
content = content.replace(
  '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />',
  '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />'
); // Actually it is already a Plus icon in the original! Wait, "M12 4v16m8-8H4" is exactly a plus icon.

content = content.replace(
  'text-[10px] font-extrabold text-[#0a192f] mb-0.5 text-center px-4',
  'text-sm font-bold text-slate-700'
);
content = content.replace(
  'text-[8px] text-slate-400 font-medium',
  'text-xs text-slate-500 mt-1'
);

// 4. Tombol Aksi (Footer)
content = content.replace(
  'grid grid-cols-2 gap-3 pt-3 md:pt-4 border-t border-slate-100',
  'flex gap-3 mt-6 pt-4 border-t border-slate-100'
);
content = content.replace(
  'py-3 md:py-4 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl md:rounded-2xl font-bold text-xs transition-colors disabled:opacity-50',
  'w-1/3 bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-semibold py-3 rounded-xl transition-all disabled:opacity-50'
);
content = content.replace(
  'py-3 md:py-4 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl md:rounded-2xl font-bold text-xs shadow-lg shadow-amber-100 flex items-center justify-center transition-all disabled:opacity-50',
  'flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50'
);

fs.writeFileSync('components/ApplicationForm.tsx', content);
