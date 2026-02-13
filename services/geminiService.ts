import { GoogleGenAI } from "@google/genai";

/**
 * Layanan AI untuk SI-PANDANG.
 * Menggunakan model Gemini-3-Flash untuk memberikan informasi persyaratan administrasi.
 */
export async function askPandangAI(prompt: string, context: string) {
  // Mengambil API Key dari environment variable process.env.API_KEY sesuai standar SDK
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("SI-PANDANG: API Key tidak ditemukan di process.env.API_KEY");
    return "Maaf, asisten SI-PANDANG belum dapat melayani karena konfigurasi API Key belum tersedia.";
  }

  try {
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

    // Mengambil teks respons langsung dari properti .text sesuai pedoman
    return response.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Terjadi gangguan saat menghubungi asisten AI SI-PANDANG. Silakan coba sesaat lagi.";
  }
}