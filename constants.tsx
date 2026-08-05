
import { Service } from './types';

export const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzE1go6iu-zCDbaH01l9Jx1pj4xcgoksr6A22NHc95SmQelY67Ck8_N66f-i7buSRjI/exec";

export const SERVICES: Service[] = [
  {
    id: 'kp',
    title: 'Kenaikan Pangkat (KP)',
    description: 'Layanan kenaikan golongan ruang satu tingkat lebih tinggi.',
    icon: '⚡',
    category: 'Kepegawaian',
    estimatedTime: '14 Hari Kerja',
    requirements: [
      { id: 'kp1', label: 'SK CPNS', isMandatory: true },
      { id: 'kp2', label: 'SK PNS', isMandatory: true },
      { id: 'kp3', label: 'SK Pangkat Terakhir', isMandatory: true },
      { id: 'kp4', label: 'Ijazah & Transkrip Nilai', isMandatory: true },
      { id: 'kp5', label: 'SKP 2 Tahun Terakhir', isMandatory: true },
      { id: 'kp7', label: 'Surat Pernyataan Pelantikan', isMandatory: true },
      { id: 'kp8', label: 'SK Jabatan Terakhir', isMandatory: true },
      { id: 'kp6', label: 'Dokumen Mutasi (jika memiliki riwayat mutasi)', isMandatory: false }
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
      { id: 'kgb1', label: 'Fotocopy SK pangkat terakhir', isMandatory: true },
      { id: 'kgb2', label: 'Fotocopy SK KGB terakhir', isMandatory: true }
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
      { id: 'kp4_1', label: 'Fotocopy Kartu Keluarga', isMandatory: true },
      { id: 'kp4_2', label: 'Fotocopy Buku Nikah (Legalisir)', isMandatory: true },
      { id: 'kp4_3', label: 'Fotocopy Akta Kelahiran anak', isMandatory: true }
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
      { id: 'gelar1', label: 'SK CPNS', isMandatory: true },
      { id: 'gelar2', label: 'SK PNS', isMandatory: true },
      { id: 'gelar3', label: 'SK Pangkat Terakhir', isMandatory: true },
      { id: 'gelar4', label: 'Ijazah & Transkrip Nilai', isMandatory: true },
      { id: 'gelar5', label: 'SKP 2 Tahun Terakhir', isMandatory: true },
      { id: 'gelar6', label: 'Dokumen Mutasi (jika memiliki riwayat mutasi)', isMandatory: false },
      { id: 'gelar7', label: 'Surat izin belajar/tugas belajar', isMandatory: true },
      { id: 'gelar8', label: 'Keterangan PDPT/PD DIKTI', isMandatory: true },
      { id: 'gelar9', label: 'Ijazah & transkrip nilai terbaru', isMandatory: true },
      { id: 'gelar10', label: 'Keterangan akreditasi prodi', isMandatory: true },
      { id: 'gelar11', label: 'Sertifikat lulus ujian penyesuaian ijazah (bagi PI)', isMandatory: false },
      { id: 'gelar12', label: 'Uraian tugas yang ditetapkan pejabat setingkat eselon II (bagi PI)', isMandatory: false }
    ]
  },
  {
    id: 'cuti',
    title: 'Cuti',
    description: 'Layanan permohonan segala jenis cuti (Tahunan, Sakit, Melahirkan, Alasan Penting).',
    icon: '📅',
    category: 'Kesejahteraan',
    estimatedTime: '1-3 Hari Kerja',
    downloadUrl: 'https://docs.google.com/document/d/1B-e7pimbYtR3SsB9qIhQPM6oTKrsIHY0/export?format=doc',
    downloadLabel: 'Download Format Form Pengajuan Cuti',
    requirements: [
      { id: 'cuti1', label: 'Fotocopy SK Pangkat Terakhir', isMandatory: true },
      { id: 'cuti2', label: 'Form Pengajuan Cuti', isMandatory: true },
      { id: 'cuti3', label: 'Rekapitulasi Absen (di siapkan oleh sub bag. umum dan kepegawaian kecamatan ujung pandang)', isMandatory: true }
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
      { id: 'ib1', label: 'Surat Keterangan Lulus (SKL) atau Bukti Kelulusan Seleksi Akademik', isMandatory: true },
      { id: 'ib2', label: 'Kartu Rencana Studi (KRS) semester berjalan', isMandatory: true },
      { id: 'ib3', label: 'Ijazah Pendidikan Terakhir (yang telah dilegalisir)', isMandatory: true },
      { id: 'ib4', label: 'Sertifikat Akreditasi Program Studi dan Perguruan Tinggi tujuan (minimal Akreditasi B atau sesuai regulasi yang berlaku)', isMandatory: true },
      { id: 'ib5', label: 'Fotokopi SK CPNS', isMandatory: true },
      { id: 'ib6', label: 'Fotokopi SK Pangkat/Golongan Terakhir', isMandatory: true }
    ]
  },
  {
    id: 'pensiun',
    title: 'Pengajuan Berkas Usia Pensiun (BUP)',
    description: 'Layanan pemberhentian BUP atau Janda/Duda.',
    icon: '🏛️',
    category: 'Pensiun',
    estimatedTime: '30 Hari Kerja',
    requirements: [
      { id: 'p1', label: 'Surat pengantar', isMandatory: true },
      { id: 'p2', label: 'Surat permohonan yang diketahui atasan langsung', isMandatory: true },
      { id: 'p3', label: 'SK CPNS', isMandatory: true },
      { id: 'p4', label: 'SK PNS', isMandatory: true },
      { id: 'p5', label: 'SK pangkat terakhir', isMandatory: true },
      { id: 'p6', label: 'Surat tidak pernah dijatuhi hukuman disiplin', isMandatory: true },
      { id: 'p7', label: 'SKP tahun 1 (satu) tahun terakhir', isMandatory: true },
      { id: 'p8', label: 'Daftar susunan keluarga', isMandatory: true },
      { id: 'p9', label: 'FC akta nikah / akta cerai / akta kematian (dilegalisir)', isMandatory: true },
      { id: 'p10', label: 'FC akta lahir anak (disahkan)', isMandatory: true },
      { id: 'p11', label: 'FC nomor rekening', isMandatory: true },
      { id: 'p12', label: 'FC NPWP & KTP', isMandatory: true },
      { id: 'p13', label: 'SK PNS suami/istri (jika PNS)', isMandatory: false }
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
      { id: 'sl1', label: 'SK CPNS', isMandatory: true },
      { id: 'sl2', label: 'SK PNS', isMandatory: true },
      { id: 'sl3', label: 'SK Pangkat terakhir', isMandatory: true },
      { id: 'sl4', label: 'SK Jabatan terakhir', isMandatory: true },
      { id: 'sl5', label: 'Daftar Riwayat Hidup / Biodata pegawai', isMandatory: true }
    ]
  },

];
