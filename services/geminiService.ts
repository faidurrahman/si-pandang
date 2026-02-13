import { GoogleGenAI } from "@google/genai";

/**
 * Layanan AI untuk SI-PANDANG.
 * Menggunakan model Gemini-3-Flash untuk memberikan informasi persyaratan administrasi.
 */
export async function askPandangAI(prompt: string, context: string) {
  /**
   * Mengambil API Key dari process.env.API_KEY.
   * Variabel ini telah diinisialisasi di index.tsx dari import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY.
   */
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("SI-PANDANG Error: API Key tidak terdeteksi. Pastikan VITE_GOOGLE_GENERATIVE_AI_API_KEY telah diatur di environment Vercel.");
    return "Maaf, asisten SI-PANDANG saat ini sedang tidak tersedia karena masalah konfigurasi sistem (API Key).";
  }

  try {
    // Inisialisasi SDK dengan API Key dari environment sesuai pedoman terbaru
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `
      Anda adalah Asisten Virtual SI-PANDANG (Sistem Informasi Pelayanan Administrasi Kepegawaian Kecamatan Ujung Pandang).
      Tugas utama Anda adalah membantu ASN dan Pegawai memahami syarat administrasi di wilayah Kecamatan Ujung Pandang.
      
      Gunakan data referensi berikut untuk menjawab:
      ${context}

      Panduan Jawaban:
      - Gunakan bahasa Indonesia yang santun, profesional, dan informatif.
      - Selalu sebutkan bahwa Anda adalah bagian dari sistem "SI-PANDANG".
      - Jika ditanya lokasi, arahkan ke Kantor Kecamatan Ujung Pandang di Jl. Samiun No. 15, Makassar.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Mengambil teks respons langsung dari properti .text sesuai pedoman SDK @google/genai
    return response.text || "Maaf, saya tidak dapat memberikan jawaban untuk saat ini.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Terjadi gangguan koneksi ke asisten AI SI-PANDANG. Silakan coba lagi beberapa saat lagi.";
  }
}