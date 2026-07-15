import fs from 'fs';
let content = fs.readFileSync('components/ApplicationForm.tsx', 'utf8');

// 1. Padding Modal Utama
content = content.replace(
  'className="p-6 md:p-8 pb-3 md:pb-4 flex items-start justify-between flex-shrink-0"',
  'className="p-5 md:p-8 pb-3 md:pb-4 flex items-start justify-between flex-shrink-0"'
);
content = content.replace(
  'className="p-6 md:p-8 pt-4 md:pt-6 space-y-3 md:space-y-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full"',
  'className="p-5 md:p-8 pt-4 md:pt-6 space-y-3 md:space-y-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full"'
);
content = content.replace(
  'className="mx-6 md:mx-8 border-slate-100"',
  'className="mx-5 md:mx-8 border-slate-100"'
);

// 2. Header
content = content.replace(
  'className="flex items-center space-x-3 md:space-x-4"',
  'className="flex items-center gap-3 sm:gap-4"'
);
content = content.replace(
  'className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0"',
  'className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0"'
);
content = content.replace(
  'className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center"',
  'className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center"'
);
content = content.replace(
  'className="text-xl font-bold text-slate-800 leading-tight"',
  'className="text-lg sm:text-xl font-bold text-slate-800 leading-tight"'
);
content = content.replace(
  'className="text-sm font-semibold text-blue-600 uppercase tracking-wider mt-1"',
  'className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider mt-1"'
);

// 3. Input Fields
content = content.replace(
  /className="text-sm font-semibold text-slate-700 mb-1\.5 block"/g,
  'className="text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-1.5 block"'
);
content = content.replace(
  /w-full px-4 py-3 rounded-xl bg-slate-50/g,
  'w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-slate-50'
);

fs.writeFileSync('components/ApplicationForm.tsx', content);
