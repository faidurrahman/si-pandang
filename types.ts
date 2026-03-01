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
  isRead: boolean; // Kolom baru J (0=Unread, 1=Read)
  additionalFiles?: { filename: string; url: string }[];
}

export interface PegawaiKGB {
  id: string;
  timestamp: string;
  nama: string;
  nip: string;
  pangkat: string;
  jabatan: string;
  tmtKgb: string;
  gajiPokok: string;
  skUrl: string;
  kgbUrl: string;
  // Calculated fields for frontend
  jadwalBerikutnya?: string;
  status?: 'Aman' | 'Mendekati' | 'Lewat Jadwal';
}