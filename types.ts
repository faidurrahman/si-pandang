export interface Requirement {
  id: string;
  label: string;
  isMandatory: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirements: Requirement[];
  category: 'Kepegawaian' | 'Kesejahteraan' | 'Mutasi' | 'Pensiun';
  estimatedTime: string;
}

export type SubmissionStatus = 'Dalam Proses' | 'Selesai' | 'Ditolak' | 'Direvisi';

export interface Submission {
  id: string; // ID Unik dari Database (Google Sheets)
  nama: string;
  nip: string;
  layanan: string;
  tanggal: string;
  status: SubmissionStatus;
  filename: string;
  fileUrl: string;
  pengumuman?: string; // Kolom baru I
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}