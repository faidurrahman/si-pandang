import re

with open('App.tsx', 'r') as f:
    content = f.read()

# 1. Navbar
old_header = '<header className="relative w-full z-[140] bg-[#0F172A] border-b border-white/5 shadow-sm transition-all duration-300 print:hidden">'
new_header = '<header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 print:hidden">'
content = content.replace(old_header, new_header)

old_header_inner1 = '<div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8">'
new_header_inner1 = '<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between w-full">'
content = content.replace(old_header_inner1, new_header_inner1)

old_header_inner2 = '<div className="w-full flex justify-between items-center h-20">'
new_header_inner2 = '<div className="w-full flex justify-between items-center">'
content = content.replace(old_header_inner2, new_header_inner2)

# 2. Hero Background
old_hero_section = 'className={`relative bg-[#0F172A] pt-12 pb-20 md:pt-24 md:pb-28 overflow-hidden shadow-2xl z-10 ${activeTab === \'lpj-kegiatan\' ? \'print:hidden\' : \'\'}`}'
new_hero_section = 'className={`relative overflow-hidden bg-slate-900 pt-32 pb-20 md:pt-40 md:pb-28 shadow-2xl z-10 ${activeTab === \'lpj-kegiatan\' ? \'print:hidden\' : \'\'}`}'
content = content.replace(old_hero_section, new_hero_section)

# Inject the glowing orb inside the hero section, before Background Effects
orb_html = '        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>'
content = content.replace('{/* Background Effects */}', orb_html + '\n        {/* Background Effects */}')

# 3. Tipografi Judul
old_h1 = '<h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">'
new_h1 = '<h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight mb-4">'
content = content.replace(old_h1, new_h1)

old_p_sub = '<p className="text-slate-400 text-xs md:text-base font-light max-w-xl mx-auto leading-relaxed tracking-wide">'
new_p_sub = '<p className="text-slate-400 font-medium max-w-2xl mx-auto">'
content = content.replace(old_p_sub, new_p_sub)

# 4. Tombol "Mulai Layanan"
old_btn = 'className="group relative inline-flex items-center justify-center px-8 py-3 text-xs md:text-sm font-bold text-[#0F172A] transition-all duration-300 bg-[#F59E0B] rounded-full hover:bg-[#fbbf24] hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ring-offset-[#0F172A]"'
new_btn = 'className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-1 transition-all duration-300 group"'
content = content.replace(old_btn, new_btn)

with open('App.tsx', 'w') as f:
    f.write(content)
