import re

# 1. Patch Sidebar.tsx
with open('components/Sidebar.tsx', 'r') as f:
    content = f.read()

# Replace the type definition
content = content.replace("activeTab: 'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir';", "activeTab: 'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir' | 'rekap-bmd';")
content = content.replace("onNavigate: (tab: 'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir') => void;", "onNavigate: (tab: 'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir' | 'rekap-bmd') => void;")

# Add a button for "rekap-bmd" right after 'pantau-kgb'
pantau_kgb_btn = """              <button 
                onClick={() => { onNavigate('pantau-kgb'); onClose(); }}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${activeTab === 'pantau-kgb' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}`}
              >
                <div className={`flex items-center justify-center transition-all ${activeTab === 'pantau-kgb' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs uppercase tracking-widest">Pantau KGB</span>
              </button>"""

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

content = content.replace(pantau_kgb_btn, pantau_kgb_btn + rekap_bmd_btn)

with open('components/Sidebar.tsx', 'w') as f:
    f.write(content)


# 2. Patch App.tsx
with open('App.tsx', 'r') as f:
    content = f.read()

import_statement = "import { DashboardRekapBmd } from './components/DashboardRekapBmd';\n"
content = content.replace("import { DashboardKGB } from './components/DashboardKGB';", "import { DashboardKGB } from './components/DashboardKGB';\n" + import_statement)

content = content.replace("useState<'layanan' | 'monitoring' | 'pantau-kgb' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir'>('layanan');", "useState<'layanan' | 'monitoring' | 'pantau-kgb' | 'rekap-bmd' | 'lpj-kegiatan' | 'data-pegawai' | 'daftar-hadir'>('layanan');")

content = content.replace("['data-pegawai', 'daftar-hadir']", "['data-pegawai', 'daftar-hadir', 'rekap-bmd']")

dashboard_kgb = """        ) : activeTab === 'pantau-kgb' ? (
          <DashboardKGB />
"""
dashboard_bmd = """        ) : activeTab === 'rekap-bmd' ? (
          <DashboardRekapBmd />
"""

content = content.replace(dashboard_kgb, dashboard_kgb + dashboard_bmd)

with open('App.tsx', 'w') as f:
    f.write(content)
