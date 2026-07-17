import os

with open('components/DaftarKendaraan.tsx', 'r') as f:
    content = f.read()

import_statement = "import { ModalDetailKendaraan } from './ModalDetailKendaraan';\n"
content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\n" + import_statement)

# Add state
state_statement = """  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedKendaraan, setSelectedKendaraan] = useState<any>(null);"""
content = content.replace("const [filter, setFilter] = useState<'Semua' | 'Terdata SIMBAKDA' | 'Tidak Terdata'>('Semua');", "const [filter, setFilter] = useState<'Semua' | 'Terdata SIMBAKDA' | 'Tidak Terdata'>('Semua');\n" + state_statement)

# Add click handler for Detail button
detail_btn_old = """<button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Detail">"""
detail_btn_new = """<button 
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Detail"
                          onClick={() => {
                            setSelectedKendaraan(item);
                            setIsDetailModalOpen(true);
                          }}
                        >"""
content = content.replace(detail_btn_old, detail_btn_new)

# Add modal element before closing div
modal_element = """
      <ModalDetailKendaraan 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        data={selectedKendaraan} 
      />
    </div>
  );
};"""
content = content.replace("    </div>\n  );\n};\n", modal_element + "\n")
content = content.replace("    </div>\n  );\n};", modal_element)

with open('components/DaftarKendaraan.tsx', 'w') as f:
    f.write(content)

