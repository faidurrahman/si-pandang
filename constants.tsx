
import { Service } from './types';

export const SERVICES: Service[] = [
  {
    id: 'kp',
    title: 'Kenaikan Pangkat (KP)',
    description: 'Layanan kenaikan golongan ruang satu tingkat lebih tinggi.',
    icon: '⚡',
    category: 'Kepegawaian',
    estimatedTime: '14 Hari Kerja',
    requirements: [
      { id: 'kp1', label: 'Fotokopi SK Pangkat Terakhir', isMandatory: true },
      { id: 'kp2', label: 'Fotokopi SK Kenaikan Gaji Berkala (KGB) terakhir', isMandatory: true },
      { id: 'kp3', label: 'SKP bernilai "Baik" dalam 2 tahun terakhir', isMandatory: true },
      { id: 'kp4_old', label: 'Surat Pengantar dari Camat', isMandatory: true }
    ]
  },
  {
    id: 'kgb',
    title: 'Kenaikan Gaji Berkala (KGB)',
    description: 'Layanan kenaikan gaji berkala setiap 2 tahun masa kerja.',
    icon: '🕒',
    category: 'Kesejahteraan',
    estimatedTime: '3 Hari Kerja',
    requirements: [
      { id: 'kgb1', label: 'Fotokopi SK Pangkat Terakhir', isMandatory: true },
      { id: 'kgb2', label: 'Fotokopi SK KGB Terakhir', isMandatory: true },
      { id: 'kgb3', label: 'SKP 2 tahun terakhir (Minimal Baik)', isMandatory: true },
      { id: 'kgb4', label: 'Surat Pengantar', isMandatory: true }
    ]
  },
  {
    id: 'suket',
    title: 'Surat Keterangan (SUKET)',
    description: 'Untuk Bank, KPR, Paspor, Sekolah Anak, dll.',
    icon: '📄',
    category: 'Kepegawaian',
    estimatedTime: '2 Hari Kerja',
    requirements: [
      { id: 'suket1', label: 'File Scan SK Pangkat Terakhir', isMandatory: true },
      { id: 'suket2', label: 'File Scan KTP', isMandatory: true },
      { id: 'suket3', label: 'Bukti Pendukung (Misal: Formulir dari Bank atau Sekolah yang perlu ditandatangani)', isMandatory: true }
    ]
  },
  {
    id: 'kp4',
    title: 'Tunjangan Keluarga (KP4)',
    description: 'Layanan pembaruan data gaji (Model C) untuk tunjangan suami/istri/anak.',
    icon: '👨‍👩‍👧‍👦',
    category: 'Kesejahteraan',
    estimatedTime: '3 Hari Kerja',
    requirements: [
      { id: 'kp4_1', label: 'Penambahan Istri/Suami: Fotokopi Surat Nikah, KTP & KK Suami Istri, SK Pangkat.', isMandatory: true },
      { id: 'kp4_2', label: 'Penambahan Anak (Baru Lahir): Fotokopi Akta Kelahiran & KK Terbaru.', isMandatory: true },
      { id: 'kp4_3', label: 'Anak Kuliah (21-25 Tahun): Surat Keterangan Kuliah Aktif (Asli) & Surat Pernyataan Belum Bekerja/Menikah.', isMandatory: true }
    ]
  },
  {
    id: 'gelar',
    title: 'Pencantuman Gelar Akademik',
    description: 'Penyesuaian Gelar Baru pada SK.',
    icon: '🎓',
    category: 'Kepegawaian',
    estimatedTime: '14 Hari Kerja',
    requirements: [
      { id: 'gelar1', label: 'File Scan Ijazah & Transkrip Nilai (Legalisir)', isMandatory: true },
      { id: 'gelar2', label: 'File Scan SK Izin Belajar/Tugas Belajar (Dokumen dasar saat mulai kuliah)', isMandatory: true },
      { id: 'gelar3', label: 'File Scan SK Pangkat Terakhir', isMandatory: true },
      { id: 'gelar4', label: 'Uraian Tugas (Relevansi antara gelar baru dengan tugas jabatan)', isMandatory: true }
    ]
  },
  {
    id: 'ct',
    title: 'Cuti Tahunan',
    description: 'Layanan permohonan ketidakhadiran tahunan.',
    icon: '📅',
    category: 'Kesejahteraan',
    estimatedTime: '1 Hari Kerja',
    requirements: [
      { id: 'ct1', label: 'Mengisi Formulir Permintaan Cuti', isMandatory: true },
      { id: 'ct2', label: 'Masa kerja minimal 1 tahun terus menerus', isMandatory: true },
      { id: 'ct3', label: 'Sisa kuota cuti masih tersedia (Maksimal 12 hari/tahun)', isMandatory: true }
    ]
  },
  {
    id: 'cs',
    title: 'Cuti Sakit',
    description: 'Permohonan cuti karena alasan kesehatan.',
    icon: '➕',
    category: 'Kesejahteraan',
    estimatedTime: '1 Hari Kerja',
    requirements: [
      { id: 'cs1', label: 'Sakit 1-14 hari: Formulir Cuti & Surat Ket. Dokter/Puskesmas', isMandatory: true },
      { id: 'cs2', label: 'Sakit >14 hari: Formulir Cuti & Surat Ket. Dokter Pemerintah (RSUD)', isMandatory: true }
    ]
  },
  {
    id: 'cm',
    title: 'Cuti Melahirkan',
    description: 'Khusus pegawai wanita untuk persalinan.',
    icon: '🔘',
    category: 'Kesejahteraan',
    estimatedTime: '2 Hari Kerja',
    requirements: [
      { id: 'cm1', label: 'Berlaku untuk anak ke-1 s.d. ke-3', isMandatory: true },
      { id: 'cm2', label: 'Lampiran: Surat Keterangan Dokter/Bidan (HPL)', isMandatory: true }
    ]
  },
  {
    id: 'cap',
    title: 'Cuti Alasan Penting',
    description: 'Keluarga sakit/meninggal, nikah, atau istri melahirkan.',
    icon: '📍',
    category: 'Kesejahteraan',
    estimatedTime: '2 Hari Kerja',
    requirements: [
      { id: 'cap1', label: 'Surat Keterangan Dokter (Rawat Inap)', isMandatory: false },
      { id: 'cap2', label: 'Surat Keterangan Kematian/Nikah', isMandatory: false },
      { id: 'cap3', label: 'Formulir Permintaan Cuti', isMandatory: true }
    ]
  },
  {
    id: 'ib',
    title: 'Izin & Tugas Belajar',
    description: 'Layanan bagi pegawai yang melanjutkan pendidikan formal.',
    icon: '🛏️',
    category: 'Kepegawaian',
    estimatedTime: '7 Hari Kerja',
    requirements: [
      { id: 'ib1', label: 'Fotokopi SK Pangkat Terakhir', isMandatory: true },
      { id: 'ib2', label: 'Surat Keterangan Diterima/Aktif Kuliah (Akreditasi B)', isMandatory: true },
      { id: 'ib3', label: 'Jadwal Kuliah & Uraian Tugas Jabatan', isMandatory: true }
    ]
  },
  {
    id: 'pensiun',
    title: 'Pengajuan Pensiun',
    description: 'Layanan pemberhentian BUP atau Janda/Duda.',
    icon: '🏛️',
    category: 'Pensiun',
    estimatedTime: '30 Hari Kerja',
    requirements: [
      { id: 'p1', label: 'Data Perorangan Calon Penerima Pensiun (DPCP)', isMandatory: true },
      { id: 'p2', label: 'Fotokopi SK CPNS, PNS, dan Pangkat Terakhir', isMandatory: true },
      { id: 'p3', label: 'Fotokopi KK, KTP, Karpeg, Taspen', isMandatory: true },
      { id: 'p4', label: 'Pas Foto terbaru', isMandatory: true }
    ]
  },
  {
    id: 'sl',
    title: 'Satyalancana',
    description: 'Penghargaan pengabdian 10, 20, atau 30 tahun.',
    icon: '⭐',
    category: 'Kepegawaian',
    estimatedTime: '30 Hari Kerja',
    requirements: [
      { id: 'sl1', label: 'Daftar Riwayat Hidup', isMandatory: true },
      { id: 'sl2', label: 'SK CPNS dan SK Pangkat Terakhir', isMandatory: true },
      { id: 'sl3', label: 'Surat Pernyataan Bebas Hukuman Disiplin', isMandatory: true }
    ]
  },
  {
    id: 'mutasi',
    title: 'Mutasi Pegawai',
    description: 'Layanan pindah masuk/keluar instansi.',
    icon: '↔️',
    category: 'Mutasi',
    estimatedTime: '60 Hari Kerja',
    requirements: [
      { id: 'm1', label: 'Surat Permohonan Pindah', isMandatory: true },
      { id: 'm2', label: 'Analisis Jabatan & Beban Kerja (Anjab ABK)', isMandatory: true },
      { id: 'm3', label: 'Rekomendasi Instansi Asal & Tujuan', isMandatory: true }
    ]
  }
];
