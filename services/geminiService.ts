
import { GoogleGenAI } from "@google/genai";

// Fix: The API key must be obtained exclusively from process.env.API_KEY as per the @google/genai guidelines.
export async function askPandangAI(prompt: string, context: string) {
  // Fix: Create a new GoogleGenAI instance inside the function using the required named parameter.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `
    Anda adalah Asisten Virtual SI-PANDANG (Sistem Informasi Pelayanan Administrasi Kepegawaian Kecamatan Ujung Pandang).
    Tugas Anda adalah membantu ASN/Pegawai dalam memahami persyaratan layanan kepegawaian di Kecamatan Ujung Pandang.
    
    Berikut adalah data layanan yang tersedia di SI-PANDANG:
    ${context}

    Gunakan gaya bahasa yang profesional, ramah, dan informatif dalam Bahasa Indonesia.
    Jika pengguna bertanya tentang layanan yang tidak ada di daftar, arahkan mereka untuk menghubungi bagian kepegawaian langsung melalui kontak admin.
    Jika ditanya tentang prosedur, jelaskan berdasarkan data yang ada atau berikan tips umum administrasi kepegawaian sesuai aturan BKN yang relevan.
    Sebutkan nama "SI-PANDANG" sesekali untuk memperkuat identitas sistem.
  `;

  try {
    // Fix: Use ai.models.generateContent to query GenAI with model and prompt.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Fix: Access the .text property directly (do not call as a method).
    return response.text || "Maaf, saya tidak bisa memberikan jawaban saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti atau hubungi Admin.";
  }
}
