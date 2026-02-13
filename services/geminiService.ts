
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export async function askPandangAI(prompt: string, context: string) {
  if (!API_KEY) return "Sistem AI sedang tidak tersedia (API Key tidak ditemukan).";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const systemInstruction = `
    Anda adalah Asisten Virtual SI-PANDANG (Sistem Informasi Pelayanan Administrasi Kepegawaian Kecamatan Ujung Pandang).
    Tugas Anda adalah membantu ASN/Pegawai dalam memahami persyaratan layanan kepegawaian.
    
    Berikut adalah data layanan yang tersedia di SI-PANDANG:
    ${context}

    Gunakan gaya bahasa yang profesional, ramah, dan informatif dalam Bahasa Indonesia.
    Jika pengguna bertanya tentang layanan yang tidak ada di daftar, arahkan mereka untuk menghubungi bagian kepegawaian langsung.
    Jika ditanya tentang prosedur, jelaskan berdasarkan data yang ada atau berikan tips umum administrasi kepegawaian sesuai aturan BKN.
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

    return response.text || "Maaf, saya tidak bisa memberikan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti.";
  }
}
