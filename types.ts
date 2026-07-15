export type SubmissionStatus = 'Dalam Proses' | 'Selesai' | 'Ditolak' | 'Direvisi';

export interface Submission {
  id: string;
  nama: string;
  nip: string;
  layanan: string;
  status: SubmissionStatus;
  berkasUrl: string;
  timestamp: string;
  tanggal?: string;
  pengumuman?: string;
  isRead?: boolean;
  filename?: string;
  fileUrl?: string;
  additionalFiles?: Array<{filename: string, url: string}>;
}

export interface Pegawai {
  id: string;
  nama: string;
  nip: string;
  layanan: string;
  status: string;
  berkasUrl: string;
  timestamp: string;
  pengumuman?: string;
  isRead?: boolean;
}

export interface Service {
  id: string;
  name?: string;
  title?: string;
  category?: string;
  estimatedTime?: string;
  icon: string;
  description: string;
  color?: string;
  requirements?: Array<{id: string, label: string, isMandatory: boolean}>;
  downloadUrl?: string;
  downloadLabel?: string;
}

export interface PegawaiKGB {
  id: string;
  nama: string;
  nip: string;
  pangkat: string;
  jabatan: string;
  tmtKgb: string;
  gajiPokok: string;
  skUrl?: string;
  kgbUrl?: string;
  // Calculated fields for frontend
  jadwalBerikutnya?: string;
  status?: 'Aman' | 'Mendekati' | 'Lewat Jadwal';
}

export interface DataPegawai {
  id: string;
  nama: string;
  tempatTanggalLahir: string;
  nip: string;
  unitKerja: string;
  golongan: string;
  golonganPangkat: string;
  tmtGolongan: string;
  eselon: string;
  namaJabatan: string;
  tmtJabatan: string;
  statusPegawai: string;
  tmtPegawai: string;
  masaKerjaTahun: number;
  masaKerjaBulan: number;
  jenisKelamin: string;
  agama: string;
  statusPerkawinan: string;
  pendidikanAwal: string;
  pendidikanAkhir: string;
  noAskes: string;
  noNpwp: string;
  noKtp: string;
  alamatRumah: string;
  kelurahan: string;
  kecamatan: string;
  telp: string;
  email: string;
}
