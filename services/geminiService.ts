
import { GoogleGenAI } from "@google/genai";

/**
 * Fungsi untuk berinteraksi dengan asisten AI SI-PANDANG.
 * Mengikuti aturan @google/genai: API Key diambil dari process.env.API_KEY.
 */
export async function askPandangAI(prompt: string, context: string) {
  // Pastikan API Key tersedia sebelum inisialisasi
  if (!process.env.API_KEY) {
    console.error("API Key tidak ditemukan di environment variables.");
    return "Layanan asisten AI belum dikonfigurasi dengan benar (API Key kosong).";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Anda adalah Asisten Virtual SI-PANDANG (Sistem Informasi Pelayanan Administrasi Kepegawaian Kecamatan Ujung Pandang).
    Tugas Anda adalah membantu ASN/Pegawai dalam memahami persyaratan layanan kepegawaian di Kecamatan Ujung Pandang.
    
    Berikut adalah data layanan yang tersedia di SI-PANDANG:
    ${context}

    Gunakan gaya bahasa yang profesional, ramah, dan informatif dalam Bahasa Indonesia.
    Sebutkan nama "SI-PANDANG" sesekali untuk memperkuat identitas sistem.
    Jika ditanya tentang prosedur, jelaskan berdasarkan data yang ada atau berikan tips umum administrasi kepegawaian sesuai aturan BKN yang relevan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Mengambil teks langsung dari properti .text sesuai pedoman SDK terbaru
    return response.text || "Maaf, saya tidak bisa memberikan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti atau hubungi Admin.";
  }
}
