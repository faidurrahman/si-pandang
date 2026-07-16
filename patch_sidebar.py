import re

with open('components/Sidebar.tsx', 'r') as f:
    content = f.read()

# 1. Wrapper sidebar
content = content.replace('bg-[#0a1e3b] z-[160] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col', 'bg-slate-900/95 backdrop-blur-md border-l border-white/10 z-[160] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col')

# 2. Header
content = content.replace('className="p-8 flex items-center justify-between relative"', 'className="p-8 flex items-center justify-between relative border-b border-white/10 pb-4 mb-4"')

# 3. Menu Items wrapper
content = content.replace('className="px-4 py-6 flex-1 space-y-2 relative"', 'className="px-4 py-6 flex-1 flex flex-col space-y-2 relative"')

# Active tab classes replacement function
def replace_button(tab_id, text, svg_path):
    global content
    
    # Need to match the whole button block. It's safer to just replace specific patterns.
    # Pattern for the main button class
    old_btn_class = f"w-full flex items-center p-4 rounded-2xl transition-all group ${{activeTab === '{tab_id}' ? 'bg-amber-400 text-slate-900 font-black shadow-xl shadow-amber-900/20' : 'text-white/60 hover:bg-white/5 hover:text-white font-bold'}}"
    
    # Note: Layanan has a different inactive/active string
    if tab_id == 'layanan':
        old_btn_class = f"w-full flex items-center p-4 rounded-2xl transition-all group ${{activeTab === '{tab_id}' ? 'bg-white/10 text-white font-black' : 'text-white/60 hover:bg-white/5 hover:text-white font-bold'}}"
        
    new_btn_class = f"w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out cursor-pointer group ${{activeTab === '{tab_id}' ? 'bg-blue-500/15 text-blue-400 font-semibold rounded-xl border border-blue-500/20' : 'text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl border border-transparent'}}"
    
    content = content.replace(old_btn_class, new_btn_class)

    # Pattern for the icon wrapper class
    if tab_id == 'layanan':
        old_icon_class = f"w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all ${{activeTab === '{tab_id}' ? 'bg-amber-400 text-slate-900' : 'bg-white/5 group-hover:bg-white/10'}}"
    else:
        old_icon_class = f"w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all ${{activeTab === '{tab_id}' ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}}"
        
    new_icon_class = f"flex items-center justify-center transition-all ${{activeTab === '{tab_id}' ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'}}"
    
    content = content.replace(old_icon_class, new_icon_class)

tabs = ['layanan', 'monitoring', 'pantau-kgb', 'lpj-kegiatan', 'data-pegawai', 'daftar-hadir']
for t in tabs:
    replace_button(t, '', '')

# Replace links
old_link_class = 'w-full flex items-center p-4 rounded-2xl text-white/60 hover:bg-white/5 hover:text-white font-bold transition-all group'
new_link_class = 'w-full px-4 py-3 flex items-center gap-3 text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200 ease-in-out cursor-pointer group'
content = content.replace(old_link_class, new_link_class)

old_panduan_icon = 'w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all'
new_panduan_icon = 'flex items-center justify-center transition-all text-slate-400 group-hover:text-blue-400'
content = content.replace(old_panduan_icon, new_panduan_icon)

old_wa_icon = 'w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mr-4 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all'
new_wa_icon = 'flex items-center justify-center transition-all text-slate-400 group-hover:text-emerald-400'
content = content.replace(old_wa_icon, new_wa_icon)

# Login
old_login_btn = 'w-full flex items-center p-4 rounded-2xl text-white/40 hover:bg-white/5 hover:text-white/60 font-bold transition-all group mt-8 border border-white/5'
new_login_btn = 'mt-auto w-full px-4 py-3 flex items-center gap-3 text-slate-400 font-medium hover:bg-white/5 hover:text-white rounded-xl transition-all duration-200 ease-in-out cursor-pointer group border border-white/5'
content = content.replace(old_login_btn, new_login_btn)

old_login_icon = 'w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mr-4 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-all'
new_login_icon = 'flex items-center justify-center transition-all text-slate-500 group-hover:text-amber-400'
content = content.replace(old_login_icon, new_login_icon)

# Logout
old_logout_btn = 'w-full flex items-center p-4 rounded-2xl text-red-400 hover:bg-red-500/10 font-bold transition-all group mt-8 border border-red-500/10'
new_logout_btn = 'mt-auto border border-slate-700/50 text-slate-300 rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-200 ease-in-out hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 cursor-pointer w-full group'
content = content.replace(old_logout_btn, new_logout_btn)

old_logout_icon = 'w-10 h-10 bg-red-500/5 rounded-xl flex items-center justify-center mr-4 group-hover:bg-red-500/20 transition-all'
new_logout_icon = 'flex items-center justify-center transition-all text-slate-400 group-hover:text-rose-400'
content = content.replace(old_logout_icon, new_logout_icon)

with open('components/Sidebar.tsx', 'w') as f:
    f.write(content)
