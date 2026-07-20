const fs = require('fs');
let code = fs.readFileSync('components/DaftarKendaraan.tsx', 'utf8');

const importSwal = "import Swal from 'sweetalert2';\n";
if (!code.includes("sweetalert2")) {
  code = importSwal + code;
}

const oldHandleUpdate = `  const handleUpdate = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: 'updateDaftarKendaraan',
          ...formData
        })
      });
      const resultText = await response.text();
      if (resultText.toLowerCase().includes("error")) {
        throw new Error(resultText);
      }
      setIsEditModalOpen(false);
      setSelectedKendaraan(null);
      await fetchData();
    } catch (error: any) {
      console.error("Update error:", error);
      alert(error.message || "Gagal mengupdate data");
    } finally {
      setIsSubmitting(false);
    }
  };`;

const newHandleUpdate = `  const handleUpdate = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const payloadBase64 = {
        action: 'updateDaftarKendaraan',
        ...formData
      };
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        // headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payloadBase64)
      });
      
      const textRes = await response.text();
      
      if (textRes.includes("Success")) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data kendaraan berhasil diperbarui',
          confirmButtonColor: '#f59e0b'
        });
        setIsEditModalOpen(false);
        setSelectedKendaraan(null);
        await fetchData();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: textRes || 'Terjadi kesalahan saat mengupdate data',
        });
      }
    } catch (error: any) {
      console.error("Update error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error Jaringan',
        text: error.message || 'Gagal terhubung ke server'
      });
    } finally {
      setIsSubmitting(false);
    }
  };`;

code = code.replace(oldHandleUpdate, newHandleUpdate);

fs.writeFileSync('components/DaftarKendaraan.tsx', code);
