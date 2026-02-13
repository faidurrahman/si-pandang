
import { GoogleGenAI } from "@google/genai";

export async function askPandangAI(prompt: string, context: string) {
  // Mendapatkan API Key secara aman dari environment variables
  const apiKey = (window as any).process?.env?.API_KEY || (import.meta as any).env?.VITE_GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    console.error("Critical: API Key tidak ditemukan di environment variables.");
    return "Maaf, fitur asisten AI belum dikonfigurasi dengan benar (API Key kosong).";
  }

  try {
    // Selalu inisialisasi instance baru untuk memastikan kunci terbaru digunakan
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `
      Anda adalah Asisten Virtual SI-PANDANG (Sistem Informasi Pelayanan Administrasi Kepegawaian Kecamatan Ujung Pandang).
      Tugas Anda adalah membantu ASN/Pegawai dalam memahami persyaratan layanan kepegawaian di Kecamatan Ujung Pandang.
      
      Berikut adalah data layanan yang tersedia:
      ${context}

      Gunakan bahasa Indonesia yang profesional, ramah, dan informatif. 
      Sebutkan nama "SI-PANDANG" untuk memperkuat identitas sistem.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Mengambil teks langsung dari properti .text (bukan metode)
    return response.text || "Maaf, saya tidak bisa memberikan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    return "Terjadi gangguan saat menghubungi asisten AI. Silakan coba lagi nanti.";
  }
}
