with open('components/DaftarKendaraan.tsx', 'r') as f:
    content = f.read()

double_modal = """      <ModalDetailKendaraan 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        data={selectedKendaraan} 
      />
      <ModalDetailKendaraan 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        data={selectedKendaraan} 
      />"""
single_modal = """      <ModalDetailKendaraan 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        data={selectedKendaraan} 
      />"""

content = content.replace(double_modal, single_modal)

with open('components/DaftarKendaraan.tsx', 'w') as f:
    f.write(content)
