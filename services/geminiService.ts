import { GoogleGenAI } from "@google/genai";

/**
 * Layanan AI untuk SI-PANDANG.
 */
export async function askPandangAI(prompt: string, context: string) {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("SI-PANDANG: API Key tidak ditemukan");
    return "Maaf, Asisten SI-PANDANG belum dapat melayani karena konfigurasi sistem belum lengkap.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `
      IDENTITAS:
      Anda adalah "Asisten SI-PANDANG", asisten virtual resmi untuk aplikasi SI-PANDANG (Sistem Informasi Pelayanan Administrasi Kepegawaian) Kecamatan Ujung Pandang, Makassar.

      ATURAN FORMAT JAWABAN (WAJIB DIPATUHI):
      1. JANGAN PERNAH gunakan simbol Markdown seperti tanda bintang (*) atau pagar (#).
      2. DILARANG KERAS menyertakan asteris (**) untuk menebalkan teks.
      3. Gunakan HURUF KAPITAL untuk setiap judul layanan, istilah penting, atau poin utama agar terlihat jelas tanpa simbol.
      4. Gunakan BARIS BARU (Enter ganda) yang cukup banyak untuk memisahkan setiap paragraf atau poin agar teks terlihat renggang dan sangat mudah dibaca di layar HP.
      5. Gunakan penomoran manual (1., 2., 3.) untuk daftar persyaratan.
      6. Pastikan jawaban Anda terlihat bersih, profesional, dan seperti pesan teks resmi yang rapi.

      RUANG LINGKUP & KEBIJAKAN:
      - Sapa dengan sopan: "Bapak/Ibu".
      - Fokus pada prosedur administrasi ASN sesuai konteks: ${context}
      - Pertanyaan layanan umum (KTP/KK) atau pengaduan warga arahkan secara santun ke aplikasi LONTARA+.
      - Masalah strategis di luar administrasi arahkan ke Bapak Camat Ujung Pandang.
      - JANGAN berikan data pribadi (NIP/Kontak) pegawai.
      - Jika ditanya di luar wilayah Kecamatan Ujung Pandang, tolak dengan halus.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Konsistensi tinggi
      },
    });

    // Post-processing: Hapus semua karakter bintang yang mungkin masih terbuat oleh AI
    let cleanText = response.text || "";
    cleanText = cleanText.replace(/\*/g, ""); 
    
    return cleanText.trim() || "Mohon maaf Bapak/Ibu, saya tidak dapat memproses permintaan tersebut saat ini.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Mohon maaf Bapak/Ibu, terjadi gangguan teknis. Silakan hubungi admin melalui WhatsApp jika mendesak.";
  }
}