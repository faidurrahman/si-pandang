import { GoogleGenAI } from "@google/genai";

export async function askPandangAI(prompt: string, context: string) {
  // Mengambil kunci API dari environment variable Vite
  const apiKey = (import.meta as any).env.VITE_GOOGLE_GENERATIVE_AI_API_KEY || (typeof process !== 'undefined' ? process.env.API_KEY : '');

  if (!apiKey) {
    console.warn("Konfigurasi API Key tidak ditemukan. Pastikan VITE_GOOGLE_GENERATIVE_AI_API_KEY telah diatur.");
    return "Maaf, fitur asisten AI SI-PANDANG belum dikonfigurasi dengan benar di server.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `
      Anda adalah Asisten Virtual SI-PANDANG (Sistem Informasi Pelayanan Administrasi Kepegawaian Kecamatan Ujung Pandang).
      Tugas Anda adalah membantu ASN/Pegawai dalam memahami persyaratan layanan kepegawaian di Kecamatan Ujung Pandang.
      
      Berikut adalah data layanan yang tersedia sebagai referensi:
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

    return response.text || "Maaf, saya tidak bisa memberikan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    return "Terjadi gangguan saat menghubungi asisten AI SI-PANDANG. Silakan coba lagi nanti.";
  }
}