import fs from 'fs';
let content = fs.readFileSync('components/ApplicationForm.tsx', 'utf8');

content = content.replace(
  'text-[8px] text-slate-400 font-medium',
  'text-xs text-slate-500 mt-1'
);

fs.writeFileSync('components/ApplicationForm.tsx', content);
