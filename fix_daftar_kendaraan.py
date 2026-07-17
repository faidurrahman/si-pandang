import re

with open('components/DaftarKendaraan.tsx', 'r') as f:
    content = f.read()

# 1. Update Table Headers
content = re.sub(
    r'<th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Pajak & Plat</th>',
    '<th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Info Pajak</th>\n              <th className="py-4 px-5 font-bold text-slate-700 uppercase tracking-wider text-xs">Masa Plat</th>',
    content
)

# 2. Update column spanning in Empty state
content = re.sub(
    r'<td colSpan=\{6\} className="py-12 text-center">',
    '<td colSpan={7} className="py-12 text-center">',
    content
)

# 3. Update Skeleton Loading
content = re.sub(
    r'<td className="py-4 px-5"><div className="flex gap-2"><div className="h-5 bg-slate-200 rounded w-10"></div><div className="h-5 bg-slate-200 rounded w-10"></div></div></td>',
    '<td className="py-4 px-5"><div className="h-5 bg-slate-200 rounded w-20"></div></td>\n                  <td className="py-4 px-5"><div className="flex gap-2"><div className="h-5 bg-slate-200 rounded w-10"></div><div className="h-5 bg-slate-200 rounded w-10"></div></div></td>',
    content
)

# 4. Update the logic before return (mapping)
mapping_logic = """
                const platNomor = String(item['Polisi'] || '-');
                const merk = String(item['Merk/Tipe'] || '-');
                const jenis = String(item['Asal Usul'] || '-');
                const tahun = String(item['Tahun Pembuatan'] || '-');
                const penanggungJawab = String(item['Driver'] || '-');
                
                // Info Pajak
                const statusPajak = String(item['Status Pajak'] || 'Tidak ada data');
                const statusPajakLower = statusPajak.toLowerCase();
                const isPajakMerah = statusPajakLower.includes('belum lunas') || statusPajakLower.includes('tidak ada data');
                const isPajakHijau = statusPajakLower.includes('lunas') && !statusPajakLower.includes('belum');
                
                const jatuhTempo = String(item['Jatuh Tempo'] || '-');
                const totalPajak = String(item['Total Pajak Kendaraan'] || '-');
                
                // Masa Plat
                const masaPlat = String(item['Masa Plat'] || '-');
                
                // Dokumen
                const bpkb = String(item['Status BPKB'] || '');
                const stnk = String(item['Status STNK'] || '');
                const isBpkbAda = bpkb && bpkb.toLowerCase() !== 'tidak ada' && bpkb.toLowerCase() !== 'kosong' && bpkb !== '-';
                const isStnkAda = stnk && stnk.toLowerCase() !== 'tidak ada' && stnk.toLowerCase() !== 'kosong' && stnk !== '-';
"""

# We need to replace the old mapping logic in DaftarKendaraan.tsx
content = re.sub(
    r"const platNomor = String\(item\['Polisi'\] \|\| '-'\);.*?const bpkbAda = !!item\['BPKB'\];",
    mapping_logic.strip(),
    content,
    flags=re.DOTALL
)

# 5. Update the JSX for the table row
# We will replace everything from <td className="py-4 px-5">\n                      <div className="flex flex-col">\n                        <span className="text-sm font-bold text-slate-800">{merk}</span> to the end of the row
row_jsx = """
                    <td className="py-4 px-5">
                      <div className="inline-block bg-red-800 text-white font-bold px-3 py-1 rounded-md border-b-2 border-slate-900 tracking-widest shadow-sm whitespace-nowrap">
                        {platNomor}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col max-w-[180px] lg:max-w-[250px] truncate">
                        <span className="text-sm font-bold text-slate-800 truncate">{merk}</span>
                        <span className="text-xs text-slate-500 font-medium truncate">{jenis} • {tahun}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 max-w-[180px] lg:max-w-[250px] truncate">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                          {penanggungJawab.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-700 truncate">{penanggungJawab}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1 max-w-[180px] lg:max-w-[250px]">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border max-w-max truncate ${isPajakMerah ? 'bg-rose-50 text-rose-600 border-rose-200' : isPajakHijau ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                          {statusPajak}
                        </span>
                        <span className="text-xs text-slate-500 truncate">Jatuh Tempo: {jatuhTempo}</span>
                        <span className="text-sm font-bold text-slate-700 truncate">{totalPajak.startsWith('Rp') ? totalPajak : totalPajak !== '-' && totalPajak !== '' ? `Rp. ${totalPajak}` : '-'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">{masaPlat}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex gap-1.5">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${isStnkAda ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-50 text-rose-500'}`}>
                          STNK: {stnk || 'Tidak Ada'}
                        </span>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${isBpkbAda ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-50 text-rose-500'}`}>
                          BPKB: {bpkb || 'Tidak Ada'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Detail"
                          onClick={() => {
                            setSelectedKendaraan(item);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </td>
"""

content = re.sub(
    r'<td className="py-4 px-5">\s*<div className="inline-block bg-red-800 text-white font-bold px-3 py-1 rounded-md border-b-2 border-slate-900 tracking-widest shadow-sm whitespace-nowrap">.*?</td>\s*</tr>',
    row_jsx.strip() + "\n                  </tr>",
    content,
    flags=re.DOTALL
)

with open('components/DaftarKendaraan.tsx', 'w') as f:
    f.write(content)

