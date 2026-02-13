
import { GoogleGenAI } from "@google/genai";

export async function askPandangAI(prompt: string, context: string) {
  // Ambil API Key dengan berbagai cara fallback untuk menjamin ketersediaan di Vite/Vercel
  const apiKey = 
    (process.env as any)?.API_KEY || 
    (import.meta as any).env?.VITE_GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    console.warn("API Key tidak ditemukan. Pastikan VITE_GOOGLE_GENERATIVE_AI_API_KEY sudah disetel di Vercel.");
    return "Maaf, fitur asisten AI belum siap (konfigurasi API Key tidak ditemukan).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `
      Anda adalah Asisten Virtual SI-PANDANG (Sistem Informasi Pelayanan Administrasi Kepegawaian Kecamatan Ujung Pandang).
      Tugas Anda adalah membantu ASN/Pegawai dalam memahami persyaratan layanan kepegawaian.
      
      Gunakan data berikut sebagai referensi layanan:
      ${context}

      Gunakan bahasa Indonesia yang sopan, profesional, dan informatif.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Saya tidak dapat memberikan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi gangguan pada sistem AI. Silakan hubungi admin atau coba lagi nanti.";
  }
}
