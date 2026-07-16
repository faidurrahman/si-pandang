import fs from 'fs';

let content = fs.readFileSync('components/DaftarHadirAdmin.tsx', 'utf8');

const newImpl = `
  const handleDownloadPDF = async () => {
    if (!selectedRekapKegiatan) return;
    
    setIsGeneratingPdf(true);
    // Add loading state visually
    Swal.fire({
      title: 'Memproses PDF',
      text: 'Mohon tunggu sebentar...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Load kop logos dynamically using urlToBase64
      const [leftLogoBase64, rightLogoBase64] = await Promise.all([
        urlToBase64('/logo-pemkot.png'),
        urlToBase64('/logo-kecamatan.png')
      ]);
      
      // Draw logos
      const logoY = 12;
      
      if (leftLogoBase64) {
        const leftProps = doc.getImageProperties(leftLogoBase64);
        const leftWidth = 18;
        const leftHeight = (leftProps.height * leftWidth) / leftProps.width;
        doc.addImage(leftLogoBase64, 'PNG', 14, logoY, leftWidth, leftHeight);
      }
      if (rightLogoBase64) {
        const rightProps = doc.getImageProperties(rightLogoBase64);
        const rightWidth = 18;
        const rightHeight = (rightProps.height * rightWidth) / rightProps.width;
        doc.addImage(rightLogoBase64, 'PNG', pageWidth - 14 - rightWidth, logoY, rightWidth, rightHeight);
      }
      
      // Draw centered title
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      
      const titleLines = doc.splitTextToSize(selectedRekapKegiatan.nama.toUpperCase(), 130); // Leave room for logos
      let y = 16;
      
      titleLines.forEach((line: string) => {
        doc.text(line, pageWidth / 2, y, { align: 'center' });
        y += 6;
      });
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(selectedRekapKegiatan.hariTanggal, pageWidth / 2, y, { align: 'center' });
      y += 6;
      doc.text(selectedRekapKegiatan.tempat, pageWidth / 2, y, { align: 'center' });
      y += 6;
      doc.text(selectedRekapKegiatan.waktu, pageWidth / 2, y, { align: 'center' });
      y += 15;
      
      // Preload images for ttd
      const enrichedKehadirans = await Promise.all(filteredKehadirans.map(async (k) => {
        let ttdBase64 = null;
        if (k.ttd) {
           const fileId = k.ttd.split('id=')[1];
           if (fileId) {
             const thumbUrl = \`https://drive.google.com/thumbnail?id=\${fileId}&sz=w200\`;
             ttdBase64 = await urlToBase64(thumbUrl);
           }
        }
        return {
          ...k,
          ttdBase64
        };
      }));

      const tableData = enrichedKehadirans.map((k, index) => [
        index + 1,
        k.nama_lengkap,
        k.instansi,
        k.gender,
        k.no_hp,
        k.email,
        k.ttdBase64 || ''
      ]);

      autoTable(doc, {
        startY: 42,
        margin: { top: 42, right: 10, bottom: 15, left: 10 },
        head: [['No', 'Nama', 'Instansi', 'Gender', 'No. HP', 'Email', 'TTD']],
        body: tableData,
        theme: 'grid',
        styles: { 
          fontSize: 8, 
          cellPadding: 2,
          valign: 'middle',
          minCellHeight: 14,
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          textColor: [0, 0, 0]
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 35 },
          3: { halign: 'center', cellWidth: 15 },
          4: { cellWidth: 25 },
          5: { cellWidth: 40 },
          6: { halign: 'center', cellWidth: 25 }
        },
        didDrawCell: function(data) {
          if (data.column.index === 6 && data.cell.section === 'body') {
            const ttdBase64 = data.row.raw[6];
            if (ttdBase64) {
              try {
                const imgProps = doc.getImageProperties(ttdBase64);
                const maxWidth = 20;
                const maxHeight = 10;
                let imgWidth = maxWidth;
                let imgHeight = (imgProps.height * maxWidth) / imgProps.width;
                if (imgHeight > maxHeight) {
                   imgHeight = maxHeight;
                   imgWidth = (imgProps.width * maxHeight) / imgProps.height;
                }
                const xOffset = data.cell.x + (data.cell.width - imgWidth) / 2;
                const yOffset = data.cell.y + (data.cell.height - imgHeight) / 2;
                
                doc.addImage(
                  ttdBase64,
                  'PNG',
                  xOffset,
                  yOffset,
                  imgWidth,
                  imgHeight
                );
              } catch(e) {}
            }
          }
        }
      });
      
      Swal.close();
      doc.save(\`Daftar_Hadir_\${selectedRekapKegiatan.nama.replace(/\\s+/g, '_')}.pdf\`);
    } catch(err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat membuat PDF'
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };
`;

const startIdx = content.indexOf('const handleDownloadPDF = async () => {');
const endStr = '  const getAppUrl = () => {';
const endIdx = content.indexOf(endStr, startIdx);

content = content.substring(0, startIdx) + newImpl + content.substring(endIdx);

fs.writeFileSync('components/DaftarHadirAdmin.tsx', content);
