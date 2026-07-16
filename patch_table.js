import fs from 'fs';
let content = fs.readFileSync('components/DaftarHadirAdmin.tsx', 'utf8');

// Replace table wrapper and table tag
content = content.replace(
  '<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">\n              <table className="w-full text-sm text-left">',
  '<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">\n              <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar">\n              <table className="w-full text-sm text-left min-w-[600px]">'
);

// Close the wrapper
content = content.replace(
  '                </table>\n            </div>\n          </div>\n        )}',
  '                </table>\n              </div>\n            </div>\n          </div>\n        )}'
);

// I'll use regex for the thead
content = content.replace(
  /<th className="px-6 py-4 font-semibold">Nama Kegiatan<\/th>/g,
  '<th className="px-6 py-4 font-semibold min-w-[200px]">Nama Kegiatan</th>'
);
content = content.replace(
  /<th className="px-6 py-4 font-semibold">Waktu<\/th>/g,
  '<th className="px-6 py-4 font-semibold whitespace-nowrap">Waktu</th>'
);
content = content.replace(
  /<th className="px-6 py-4 font-semibold">Tempat<\/th>/g,
  '<th className="px-6 py-4 font-semibold min-w-[150px]">Tempat</th>'
);
content = content.replace(
  /<th className="px-6 py-4 font-semibold text-right">Aksi<\/th>/g,
  '<th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Aksi</th>'
);

// and for the tbody
content = content.replace(
  /<td className="px-6 py-4 font-medium text-gray-900">\{k\.nama\}<\/td>/g,
  '<td className="px-6 py-4 font-medium text-gray-900 min-w-[200px]">{k.nama}</td>'
);
content = content.replace(
  /<td className="px-6 py-4 text-gray-600">\{k\.hariTanggal\}<br\/>\{k\.waktu\}<\/td>/g,
  '<td className="px-6 py-4 text-gray-600 whitespace-nowrap">{k.hariTanggal}<br/>{k.waktu}</td>'
);
content = content.replace(
  /<td className="px-6 py-4 text-gray-600">\{k\.tempat\}<\/td>/g,
  '<td className="px-6 py-4 text-gray-600 min-w-[150px]">{k.tempat}</td>'
);
content = content.replace(
  /<td className="px-6 py-4 text-right">/g,
  '<td className="px-6 py-4 text-right whitespace-nowrap">'
);


fs.writeFileSync('components/DaftarHadirAdmin.tsx', content);
