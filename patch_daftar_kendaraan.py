import os

with open('components/DaftarKendaraan.tsx', 'r') as f:
    content = f.read()

content = content.replace("const API_URL = (import.meta as any).env.VITE_APPS_SCRIPT_KENDARAAN_URL || '[PASTE_URL_APPS_SCRIPT_ANDA_DISINI]';", "const API_URL = '/api/proxy?action=getDaftarKendaraan';")

content = content.replace("""        if (API_URL === '[PASTE_URL_APPS_SCRIPT_ANDA_DISINI]') {
          console.warn("Harap masukkan URL Google Apps Script Anda di komponen DaftarKendaraan.tsx atau via env VITE_APPS_SCRIPT_KENDARAAN_URL.");
          setIsLoading(false);
          return;
        }""", "")

content = content.replace("""{API_URL === '[PASTE_URL_APPS_SCRIPT_ANDA_DISINI]' && (
                    <p className="text-xs text-rose-500 mt-2">Peringatan: URL API Google Apps Script belum diatur.</p>
                  )}""", "")


with open('components/DaftarKendaraan.tsx', 'w') as f:
    f.write(content)
