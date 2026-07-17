import re

with open('components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Replace the type definition
content = content.replace("activeTab: 'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir' | 'rekap-bmd';", "activeTab: 'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir' | 'rekap-bmd' | 'daftar-kendaraan';")
content = content.replace("onNavigate: (tab: 'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir' | 'rekap-bmd') => void;", "onNavigate: (tab: 'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir' | 'rekap-bmd' | 'daftar-kendaraan') => void;")

# Add a button for "daftar-kendaraan" right after 'rekap-bmd'
rekap_bmd_btn = """
              <button 
                onClick={() => { onNavigate('rekap-bmd'); onClose(); }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'rekap-bmd' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}`}
              >
                <div className={`flex items-center justify-center transition-all ${activeTab === 'rekap-bmd' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Rekap BMD</span>
              </button>"""

daftar_kendaraan_btn = """
              <button 
                onClick={() => { onNavigate('daftar-kendaraan'); onClose(); }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'daftar-kendaraan' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}`}
              >
                <div className={`flex items-center justify-center transition-all ${activeTab === 'daftar-kendaraan' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Daftar Kendaraan</span>
              </button>"""

content = content.replace(rekap_bmd_btn, rekap_bmd_btn + daftar_kendaraan_btn)

with open('components/Sidebar.tsx', 'w') as f:
    f.write(content)

