import fs from 'fs';
let content = fs.readFileSync('components/ApplicationForm.tsx', 'utf8');

content = content.replace(
  'className="bg-white rounded-[32px] w-full max-w-[500px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"',
  'className="bg-white rounded-[24px] md:rounded-[32px] w-[92%] md:w-full max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"'
);

content = content.replace(
  'className="p-6 md:p-8 pb-3 md:pb-4 flex items-start justify-between"',
  'className="p-6 md:p-8 pb-3 md:pb-4 flex items-start justify-between flex-shrink-0"'
);

content = content.replace(
  'className="p-6 md:p-8 pt-4 md:pt-6 space-y-3 md:space-y-5"',
  'className="p-6 md:p-8 pt-4 md:pt-6 space-y-3 md:space-y-5 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-50 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full"'
);

fs.writeFileSync('components/ApplicationForm.tsx', content);
