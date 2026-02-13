import { GoogleGenAI } from "@google/genai";

export async function askPandangAI(prompt: string, context: string) {
  // Selalu gunakan GoogleGenAI dengan properti apiKey dari process.env.API_KEY
  // Asumsikan variabel ini sudah disiapkan di level entry point (index.tsx)
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
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

    // Mengambil teks langsung dari properti .text sesuai pedoman SDK
    return response.text || "Maaf, saya tidak bisa memberikan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    return "Terjadi gangguan saat menghubungi asisten AI SI-PANDANG. Silakan coba lagi nanti.";
  }
}