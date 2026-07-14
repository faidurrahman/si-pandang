import fs from 'fs';

let code = fs.readFileSync('components/DataPegawaiPage.tsx', 'utf8');

const targetFunction = `  const formatDateStr = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };`;

const replacementFunction = `  const formatDateStr = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };`;

code = code.replace(targetFunction, replacementFunction);

code = code.replace(
  `  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);`,
  `  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeDateToISO = (val: any) => {
    if (!val) return '';
    try {
      let d = new Date(val);
      if (isNaN(d.getTime())) {
        if (typeof val === 'string') {
          const parts = val.split('-');
          if (parts.length === 3) {
             d = new Date(\`\${parts[2]}-\${parts[1]}-\${parts[0]}\`);
          }
        }
      }
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };`
);

code = code.replace(`tmtGolongan: row[7] ? new Date(row[7]).toISOString().split('T')[0] : '',`, `tmtGolongan: safeDateToISO(row[7]),`);
code = code.replace(`tmtJabatan: row[10] ? new Date(row[10]).toISOString().split('T')[0] : '',`, `tmtJabatan: safeDateToISO(row[10]),`);
code = code.replace(`tmtPegawai: row[12] ? new Date(row[12]).toISOString().split('T')[0] : '',`, `tmtPegawai: safeDateToISO(row[12]),`);

fs.writeFileSync('components/DataPegawaiPage.tsx', code);
