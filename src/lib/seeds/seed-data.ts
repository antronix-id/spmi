import {
  Accreditation,
  SpmiDocument,
  MonitoringData,
  Regulation,
  ContactMessage,
  OrganizationMember,
  NewsItem,
  AboutPageContent,
  HomePageContent,
  ContactPageContent,
  AdminUser,
  PageContent,
  getDefaultPermissions
} from '../types';

export const orgMembersSeed: OrganizationMember[] = [
  {
    id: 'org-1',
    name: 'Dr. H. Hendra Wijaya, S.E., M.M.',
    position: 'Kepala Lembaga Penjaminan Mutu Internal (SPMI)',
    division: 'Pimpinan Utama SPMI',
    email: 'hendra.wijaya@unpal.ac.id',
    nip: '197508122003121002',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    order: 1
  },
  {
    id: 'org-2',
    name: 'Ir. Hj. Nurjanah, M.T.',
    position: 'Sekretaris Eksekutif SPMI',
    division: 'Pimpinan Utama SPMI',
    email: 'nurjanah@unpal.ac.id',
    nip: '198104192006042001',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    order: 2
  },
  {
    id: 'org-3',
    name: 'Dr. Muhammad Rizky, M.Kom.',
    position: 'Koordinator Pusat Audit Mutu Internal (AMI)',
    division: 'Pusat Audit & Evaluasi Mutu',
    email: 'rizky.spmi@unpal.ac.id',
    nip: '198402282008121003',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    order: 3
  },
  {
    id: 'org-4',
    name: 'Siti Rahmawati, S.H., M.H.',
    position: 'Koordinator Pusat Standar Mutu & Regulasi',
    division: 'Pusat Standar Mutu',
    email: 'siti.rahma@unpal.ac.id',
    nip: '198809152014042002',
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    order: 4
  },
  {
    id: 'org-5',
    name: 'Drs. H. M. Anwar Syahril, M.Si.',
    position: 'Koordinator Fasilitasi & Akreditasi Program Studi',
    division: 'Pusat Akreditasi & Asesmen',
    email: 'anwar.syahril@unpal.ac.id',
    nip: '197903142005011003',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    order: 5
  }
];

export const accreditationsSeed: Accreditation[] = [
  {
    "id": "acc-prodi-1",
    "institution_or_program": "S1 Manajemen",
    "level": "S1",
    "faculty": "Fakultas Ekonomi & Bisnis",
    "rating": "Unggul",
    "sk_number": "312/SK/LAMEMBA/Akred/S/V/2023",
    "expiry_date": "2028-05-20",
    "status": "Aktif",
    "accreditation_agency": "LAMEMBA",
    "certificate_url": "#"
  },
  {
    "id": "acc-prodi-2",
    "institution_or_program": "S1 Pendidikan Bahasa Inggris",
    "level": "S1",
    "faculty": "Fakultas Keguruan & Ilmu Pendidikan",
    "rating": "Baik Sekali",
    "sk_number": "482/SK/LAMDIK/Akred/S/IX/2023",
    "expiry_date": "2028-09-18",
    "status": "Aktif",
    "accreditation_agency": "LAMDIK",
    "certificate_url": "#"
  },
  {
    "id": "acc-prodi-3",
    "institution_or_program": "S1 Teknik Elektro",
    "level": "S1",
    "faculty": "Fakultas Teknik",
    "rating": "Baik",
    "sk_number": "095/SK/LAM-TEKNIK/Akred/S/II/2024",
    "expiry_date": "2029-02-28",
    "status": "Aktif",
    "accreditation_agency": "LAM-TEKNIK",
    "certificate_url": "#"
  },
  {
    "id": "acc-prodi-4",
    "institution_or_program": "S1 Teknik Sipil",
    "level": "S1",
    "faculty": "Fakultas Teknik",
    "rating": "Baik Sekali",
    "sk_number": "118/SK/LAM-TEKNIK/Akred/S/XI/2023",
    "expiry_date": "2028-11-14",
    "status": "Aktif",
    "accreditation_agency": "LAM-TEKNIK",
    "certificate_url": "#"
  },
  {
    "id": "acc-prodi-5",
    "institution_or_program": "S1 Ilmu Hukum",
    "level": "S1",
    "faculty": "Fakultas Hukum",
    "rating": "Baik Sekali",
    "sk_number": "551/SK/BAN-PT/Akred/S/IX/2022",
    "expiry_date": "2027-09-30",
    "status": "Aktif",
    "accreditation_agency": "BAN-PT",
    "certificate_url": "#"
  },
  {
    "id": "acc-prodi-6",
    "institution_or_program": "S1 Agroteknologi",
    "level": "S1",
    "faculty": "Fakultas Pertanian",
    "rating": "Baik Sekali",
    "sk_number": "143/SK/BAN-PT/Akred/S/IV/2023",
    "expiry_date": "2028-04-16",
    "status": "Aktif",
    "accreditation_agency": "BAN-PT",
    "certificate_url": "#"
  },
  {
    "id": "acc-inst-1",
    "institution_or_program": "Universitas Palembang",
    "level": "Institusi",
    "rating": "Baik Sekali",
    "sk_number": "124/SK/BAN-PT/Akred/PT/III/2023",
    "expiry_date": "2028-03-24",
    "status": "Aktif",
    "accreditation_agency": "BAN-PT",
    "certificate_url": "/uploads/1787384341854_spmi_-_universitas_palembang.pdf"
  }
];

export const documentsSeed: SpmiDocument[] = [
  {
    "id": "doc-1",
    "title": "Buku Kebijakan SPMI Universitas Palembang Edisi 2023",
    "category": "Kebijakan SPMI",
    "document_code": "KB-SPMI-UNPAL-2023-01",
    "year": 2023,
    "description": "Pedoman umum mengenai arah, visi, filosofi, komitmen, dan struktur penjaminan mutu internal Universitas Palembang.",
    "file_url": "#",
    "file_size": "2.4 MB",
    "download_count": 520,
    "updated_at": "2023-08-10"
  },
  {
    "id": "doc-2",
    "title": "Manual Mutu SPMI - Penetapan dan Pelaksanaan Standar (Siklus P-P)",
    "category": "Manual Mutu",
    "document_code": "MM-SPMI-UNPAL-2023-02",
    "year": 2023,
    "description": "Tata cara dan prosedur baku perumusan, penetapan, pengesahan, dan sosialisasi standar mutu tridharma perguruan tinggi.",
    "file_url": "#",
    "file_size": "3.1 MB",
    "download_count": 410,
    "updated_at": "2023-09-15"
  },
  {
    "id": "doc-3",
    "title": "Manual Mutu SPMI - Evaluasi, Pengendalian, dan Peningkatan Standar (Siklus E-P-P)",
    "category": "Manual Mutu",
    "document_code": "MM-SPMI-UNPAL-2023-03",
    "year": 2023,
    "description": "Tata cara Audit Mutu Internal (AMI), Rapat Tinjauan Manajemen (RTM), dan mekanisme tindakan koreksi berkelanjutan (Kaizen).",
    "file_url": "#",
    "file_size": "2.8 MB",
    "download_count": 385,
    "updated_at": "2023-09-20"
  },
  {
    "id": "doc-4",
    "title": "Standar Aspek Pendidikan (Kurikulum OBE, Proses Pembelajaran & Penilaian)",
    "category": "Standar SPMI",
    "standard_aspect": "Pendidikan",
    "document_code": "STD-SPMI-UNPAL-PEND-01",
    "year": 2023,
    "description": "Standar kompetensi lulusan, isi pembelajaran, proses pembelajaran, penilaian edukatif, dan evaluasi hasil belajar.",
    "file_url": "#",
    "file_size": "4.2 MB",
    "download_count": 630,
    "updated_at": "2023-10-05"
  },
  {
    "id": "doc-5",
    "title": "Standar Aspek Penelitian (Arah Riset, Hibah Kompetitif, & Publikasi Bereputasi)",
    "category": "Standar SPMI",
    "standard_aspect": "Penelitian",
    "document_code": "STD-SPMI-UNPAL-LIT-02",
    "year": 2023,
    "description": "Standar hasil penelitian, proses riset dosen dan mahasiswa, pendanaan hibah, dan publikasi jurnal terindeks Scopus/SINTA.",
    "file_url": "#",
    "file_size": "3.6 MB",
    "download_count": 490,
    "updated_at": "2023-10-12"
  },
  {
    "id": "doc-6",
    "title": "Standar Aspek Pengabdian pada Masyarakat (PkM Berbasis Hilirisasi)",
    "category": "Standar SPMI",
    "standard_aspect": "Pengabdian pada Masyarakat",
    "document_code": "STD-SPMI-UNPAL-PKM-03",
    "year": 2023,
    "description": "Standar luaran PkM, pemanfaatan hasil riset untuk pemberdayaan masyarakat Sumatera Selatan, dan kemitraan UMKM.",
    "file_url": "#",
    "file_size": "3.2 MB",
    "download_count": 340,
    "updated_at": "2023-10-15"
  },
  {
    "id": "doc-7",
    "title": "Standar Organisasi & Tata Kelola Kelembagaan Universitas",
    "category": "Standar SPMI",
    "standard_aspect": "Organisasi",
    "document_code": "STD-SPMI-UNPAL-ORG-04",
    "year": 2023,
    "description": "Standar struktur kepemimpinan, akuntabilitas manajerial, sistem penjaminan mutu fakultas/prodi (GKM), dan manajemen risiko.",
    "file_url": "#",
    "file_size": "3.4 MB",
    "download_count": 380,
    "updated_at": "2023-10-18"
  },
  {
    "id": "doc-8",
    "title": "Standar Aspek Kemahasiswaan & Pembinaan Prestasi",
    "category": "Standar SPMI",
    "standard_aspect": "Kemahasiswaan",
    "document_code": "STD-SPMI-UNPAL-MHS-05",
    "year": 2023,
    "description": "Standar penerimaan mahasiswa baru, layanan konseling, kegiatan minat bakat, penalaran, dan tracer study alumni.",
    "file_url": "#",
    "file_size": "3.1 MB",
    "download_count": 420,
    "updated_at": "2023-10-20"
  },
  {
    "id": "doc-9",
    "title": "Standar Aspek Sumber Daya Manusia (Dosen & Tenaga Kependidikan)",
    "category": "Standar SPMI",
    "standard_aspect": "Sumber Daya Manusia",
    "document_code": "STD-SPMI-UNPAL-SDM-06",
    "year": 2023,
    "description": "Standar kualifikasi akademik dosen (S3), jabatan fungsional (Lektor Kepala/Guru Besar), dan pelatihan kompetensi tendik.",
    "file_url": "#",
    "file_size": "3.5 MB",
    "download_count": 460,
    "updated_at": "2023-10-22"
  },
  {
    "id": "doc-10",
    "title": "Standar Aspek Sarana Prasarana & Teknologi Informasi",
    "category": "Standar SPMI",
    "standard_aspect": "Sarana Prasarana",
    "document_code": "STD-SPMI-UNPAL-SARPRAS-07",
    "year": 2023,
    "description": "Standar ruang kuliah ber-AC, fasilitas laboratorium terakreditasi, perpustakaan digital, dan infrastruktur jaringan internet.",
    "file_url": "#",
    "file_size": "3.9 MB",
    "download_count": 350,
    "updated_at": "2023-10-24"
  },
  {
    "id": "doc-11",
    "title": "Standar Aspek Keuangan & Pengelolaan Anggaran Tridharma",
    "category": "Standar SPMI",
    "standard_aspect": "Keuangan",
    "document_code": "STD-SPMI-UNPAL-KEU-08",
    "year": 2023,
    "description": "Standar alokasi dana operasional pendidikan, transparansi audit keuangan, efisiensi anggaran, dan dana abadi universitas.",
    "file_url": "#",
    "file_size": "2.9 MB",
    "download_count": 310,
    "updated_at": "2023-10-26"
  },
  {
    "id": "doc-12",
    "title": "Standar Aspek Kerja Sama Strategis Nasional & Internasional",
    "category": "Standar SPMI",
    "standard_aspect": "Kerja Sama",
    "document_code": "STD-SPMI-UNPAL-KS-09",
    "year": 2023,
    "description": "Standar implementasi MoU/MoA tridharma, pertukaran mahasiswa merdeka (MBKM), dan magang industri terstruktur.",
    "file_url": "#",
    "file_size": "3.3 MB",
    "download_count": 395,
    "updated_at": "2023-10-28"
  },
  {
    "id": "doc-13",
    "title": "Standar Aspek Kesejahteraan Sivitas Akademika & Tenaga Kependidikan",
    "category": "Standar SPMI",
    "standard_aspect": "Kesejahteraan",
    "document_code": "STD-SPMI-UNPAL-SEJAHTERA-10",
    "year": 2023,
    "description": "Standar jaminan kesehatan, tunjangan kinerja dosen/tendik, lingkungan kerja yang aman dan inklusif, serta beasiswa.",
    "file_url": "#",
    "file_size": "2.7 MB",
    "download_count": 480,
    "updated_at": "2023-10-30"
  },
  {
    "id": "doc-16",
    "title": "Risalah & Rencana Tindak Lanjut Rapat Tinjauan Manajemen (RTM) 2024",
    "category": "Dokumen RTM",
    "document_code": "RTM-SPMI-UNPAL-2024-01",
    "year": 2024,
    "description": "Notula keputusan RTM universitas bersama rektorat dan senat mengenai perbaikan dan peningkatan berkelanjutan.",
    "file_url": "#",
    "file_size": "2.3 MB",
    "download_count": 310,
    "updated_at": "2024-07-02"
  },
  {
    "id": "doc-14",
    "title": "Instrumen Formulir Audit Mutu Internal (AMI) Siklus XI 2024",
    "category": "Formulir Mutu",
    "standard_aspect": "Pendidikan",
    "document_code": "FRM-SPMI-UNPAL-AMI-2024",
    "year": 2024,
    "description": "Formulir instrumen audit kepatuhan 10 aspek standar, lembar temuan KTS/OB, dan format Rencana Tindak Koreksi (RTK).",
    "file_url": "#",
    "file_size": "1.9 MB",
    "download_count": 0,
    "updated_at": "2026-08-22"
  },
  {
    "id": "doc-1787382821011",
    "title": "test",
    "category": "Kebijakan SPMI",
    "standard_aspect": "Penelitian",
    "document_code": "test",
    "year": 2026,
    "description": "test deskripsi",
    "file_url": "/uploads/1787382814397_spmi_-_universitas_palembang.pdf",
    "file_size": "1.2 MB",
    "download_count": 0,
    "updated_at": "2026-08-22"
  },
  {
    "id": "doc_1787480070105",
    "title": "test3",
    "category": "Standar SPMI",
    "document_code": "STD-SPMI-2026-018",
    "year": 2026,
    "description": "test 3",
    "file_url": "/uploads/1787480064884_spmi_-_universitas_palembang.pdf",
    "file_size": "NaN MB",
    "download_count": 0,
    "updated_at": "2026-08-23"
  }
];

export const monitoringDataSeed: MonitoringData[] = [
  {
    "id": "mon-4",
    "standard_name": "Standar Efektivitas Tata Kelola Organisasi & Gugus Kendali Mutu (GKM) Fakultas",
    "category": "Organisasi",
    "faculty": "Fakultas Hukum",
    "study_program": "Tingkat Fakultas",
    "target_score": 85,
    "actual_score": 89,
    "achievement_rate": 104.7,
    "status": "Melampaui",
    "audit_period": "2023/2024 Genap",
    "findings_count": 1,
    "resolved_findings": 1
  },
  {
    "id": "mon-5",
    "standard_name": "Standar Prestasi Kemahasiswaan Tingkat Nasional & Kepuasan Layanan Pembelajaran",
    "category": "Kemahasiswaan",
    "faculty": "Fakultas Hukum",
    "study_program": "S1 Ilmu Hukum",
    "target_score": 85,
    "actual_score": 91.4,
    "achievement_rate": 107.5,
    "status": "Melampaui",
    "audit_period": "2023/2024 Genap",
    "findings_count": 1,
    "resolved_findings": 1
  },
  {
    "id": "mon-6",
    "standard_name": "Standar Kualifikasi Dosen (Doktor S3 ≥ 40% & Lektor Kepala/Guru Besar ≥ 35%)",
    "category": "Sumber Daya Manusia",
    "faculty": "Fakultas Keguruan & Ilmu Pendidikan",
    "study_program": "S1 Pendidikan Bahasa Inggris",
    "target_score": 85,
    "actual_score": 89.5,
    "achievement_rate": 105.3,
    "status": "Melampaui",
    "audit_period": "2023/2024 Genap",
    "findings_count": 2,
    "resolved_findings": 2
  },
  {
    "id": "mon-7",
    "standard_name": "Standar Ketersediaan & Pemutakhiran Fasilitas Sarana Prasarana Laboratorium",
    "category": "Sarana Prasarana",
    "faculty": "Fakultas Teknik",
    "study_program": "S1 Teknik Elektro",
    "target_score": 85,
    "actual_score": 87,
    "achievement_rate": 102.4,
    "status": "Tercapai",
    "audit_period": "2023/2024 Genap",
    "findings_count": 2,
    "resolved_findings": 2
  },
  {
    "id": "mon-8",
    "standard_name": "Standar Transparansi & Akuntabilitas Alokasi Anggaran Keuangan Operasional",
    "category": "Keuangan",
    "faculty": "Universitas Palembang",
    "study_program": "Biro Administrasi Keuangan",
    "target_score": 85,
    "actual_score": 90,
    "achievement_rate": 105.9,
    "status": "Melampaui",
    "audit_period": "2023/2024 Genap",
    "findings_count": 1,
    "resolved_findings": 1
  },
  {
    "id": "mon-9",
    "standard_name": "Standar Kerjasama Strategis Nasional & Internasional (MoU & MoA Aktif)",
    "category": "Kerja Sama",
    "faculty": "Universitas Palembang",
    "study_program": "Tingkat Institusi",
    "target_score": 80,
    "actual_score": 83.5,
    "achievement_rate": 104.4,
    "status": "Tercapai",
    "audit_period": "2023/2024 Genap",
    "findings_count": 3,
    "resolved_findings": 3
  },
  {
    "id": "mon-10",
    "standard_name": "Standar Kesejahteraan Dosen, Tenaga Kependidikan & Fasilitas Jaminan Kesehatan",
    "category": "Kesejahteraan",
    "faculty": "Universitas Palembang",
    "study_program": "Seluruh Sivitas Akademika",
    "target_score": 85,
    "actual_score": 88.5,
    "achievement_rate": 104.1,
    "status": "Tercapai",
    "audit_period": "2023/2024 Genap",
    "findings_count": 1,
    "resolved_findings": 1
  },
  {
    "id": "mon-1787383066264",
    "standard_name": "Test Aja",
    "category": "Penelitian",
    "faculty": "Fakultas Ekonomi",
    "study_program": "manajemen",
    "target_score": 85,
    "actual_score": 90,
    "achievement_rate": 105.9,
    "status": "Melampaui",
    "audit_period": "2024/2025 Ganjil",
    "findings_count": 0,
    "resolved_findings": 0
  },
  {
    "id": "mon-3",
    "standard_name": "Standar Kegiatan Pengabdian Masyarakat Berbasis Hilirisasi & Mitra Lokal",
    "category": "Pengabdian pada Masyarakat",
    "faculty": "Fakultas Pertanian",
    "study_program": "S1 Agroteknologi",
    "target_score": 85,
    "actual_score": 88,
    "achievement_rate": 103.5,
    "status": "Melampaui",
    "audit_period": "2023/2024 Genap",
    "findings_count": 2,
    "resolved_findings": 2
  }
];

export const regulationsSeed: Regulation[] = [
  {
    "id": "reg-1",
    "title": "Undang-Undang Republik Indonesia Nomor 12 Tahun 2012 tentang Pendidikan Tinggi",
    "regulation_number": "UU No. 12 Tahun 2012",
    "category": "Undang-Undang",
    "year": 2012,
    "description": "Payung hukum utama penyelenggaraan sistem penjaminan mutu pendidikan tinggi (SPM Dikti) melalui SPMI dan SPME (Akreditasi).",
    "file_url": "#",
    "issued_by": "Pemerintah Republik Indonesia"
  },
  {
    "id": "reg-3",
    "title": "Peraturan BAN-PT Nomor 1 Tahun 2022 tentang Mekanisme Akreditasi Perguruan Tinggi",
    "regulation_number": "PerBAN-PT No. 01/2022",
    "category": "SN-Dikti",
    "year": 2022,
    "description": "Pedoman pelaksanaan asesmen lapangan, matriks penilaian 9 kriteria akreditasi, dan mekanisme banding.",
    "file_url": "#",
    "issued_by": "Badan Akreditasi Nasional Perguruan Tinggi"
  },
  {
    "id": "reg-5",
    "title": "Pedoman Pelaksanaan Audit Mutu Internal (AMI) dan Rapat Tinjauan Manajemen (RTM)",
    "regulation_number": "SK Rektor No. 205/UNPAL/SK/2023",
    "category": "Pedoman SPMI",
    "year": 2023,
    "description": "Standard Operating Procedure (SOP) pelaksanaan siklus audit mutu internal rutin, kualifikasi auditor, dan tindak koreksi.",
    "file_url": "#",
    "issued_by": "Badan Penjaminan Mutu UNPAL"
  },
  {
    "id": "reg-2",
    "title": "Permendikbudristek Nomor 53 Tahun 2023 tentang Penjaminan Mutu Pendidikan Tinggi",
    "regulation_number": "Permendikbudristek No. 53/2023",
    "category": "Permendikbudristek",
    "year": 2023,
    "description": "Transformasi Standar Nasional Pendidikan Tinggi (SN-Dikti) yang menyederhanakan standar tridharma dan mekanisme akreditasi otomatis.",
    "file_url": "/uploads/1787481338273_spmi_-_universitas_palembang.pdf",
    "issued_by": "Kemendikbudristek RI"
  }
];

export const contactMessagesSeed: ContactMessage[] = [
  {
    "id": "msg-1",
    "name": "Dr. Faisal Rahman, M.Kom.",
    "email": "faisal.fti@unpal.ac.id",
    "phone": "081273891029",
    "category": "Konsultasi Mutu",
    "subject": "Konsultasi Penyusunan LED Akreditasi LAM-INFOKOM",
    "message": "Selamat pagi tim SPMI, kami dari Program Studi ingin menjadwalkan sesi konsultasi penyesuaian instrumen LED aspek SDM dan Pendidikan. Mohon kesediaan tim fasilitator.",
    "created_at": "2026-08-19T05:36:52.446042+00:00",
    "status": "Diproses",
    "reply_note": "Dijadwalkan sesi pendampingan pada hari Kamis, 1 Agustus 2024 bersama Koordinator Akreditasi SPMI."
  },
  {
    "id": "msg-2",
    "name": "Dra. Ratna Juwita, M.Si.",
    "email": "ratna_juwita@gmail.com",
    "phone": "085290182341",
    "category": "Permohonan Dokumen",
    "subject": "Permohonan Salinan Legalisir Sertifikat Akreditasi Institusi",
    "message": "Mohon dibantu salinan digital legalisir sertifikat akreditasi institusi Universitas Palembang tahun 2023 dengan barcode resmi untuk kelengkapan administrasi beasiswa luar negeri.",
    "created_at": "2026-08-20T05:36:52.446042+00:00",
    "status": "Selesai",
    "reply_note": "Dokumen sertifikat berlegalisir resmi telah dikirim ke email pemohon."
  },
  {
    "id": "msg-3",
    "name": "Budi Santoso, S.T.",
    "email": "budisantoso99@gmail.com",
    "phone": "081399887766",
    "category": "Pertanyaan Umum",
    "subject": "Jadwal Siklus Audit Mutu Internal Periode Ganjil 2024/2025",
    "message": "Halo admin SPMI, mohon info kapan instrumen formulir AMI untuk evaluasi semester ganjil dapat diunduh oleh unit kerja? Terima kasih.",
    "created_at": "2026-08-21T05:36:52.446042+00:00",
    "status": "Baru"
  }
];

export const pageContentSeed: PageContent[] = [
  {
    "id": "page-visi-misi",
    "slug": "visi-misi",
    "title": "Visi, Misi & Komitmen Mutu",
    "subtitle": "Arah pengembangan mutu Universitas Palembang menuju perguruan tinggi unggul",
    "content": {
      "misi": [
        "Menetapkan dan mengembangkan standar mutu tridharma perguruan tinggi yang adaptif.",
        "Melaksanakan audit mutu internal (AMI) secara berkala, independen, dan profesional.",
        "Mendorong peningkatan mutu berkelanjutan (Continuous Quality Improvement) berbasis budaya mutu sivitas akademika."
      ],
      "visi": "Menjadi Lembaga Penjaminan Mutu Internal yang kredibel, akuntabel, dan transformatif dalam mengawal Universitas Palembang menjadi perguruan tinggi unggul di tingkat nasional."
    },
    "updated_at": "2026-08-22T05:15:35.530746+00:00"
  },
  {
    "id": "page-tupoksi",
    "slug": "tupoksi",
    "title": "Tugas Pokok & Fungsi SPMI",
    "subtitle": "Mandat tata kelola penjaminan mutu internal universitas",
    "content": {
      "fungsi": [
        "Penyusunan dokumen PPEPP",
        "Fasilitasi akreditasi prodi",
        "Pengawalan kepatuhan standar mutu"
      ],
      "tugas_pokok": "Merencanakan, melaksanakan, mengevaluasi, mengendalikan, dan meningkatkan standar mutu pendidikan tinggi di seluruh unit kerja Universitas Palembang."
    },
    "updated_at": "2026-08-22T05:15:35.530746+00:00"
  }
];

export const aboutPageContentSeed: AboutPageContent = {
  visi: 'Menjadi Lembaga Penjaminan Mutu Perguruan Tinggi yang Unggul, Kredibel, dan Berdaya Saing Global dalam Mengawal Mutu Tridharma Universitas Palembang pada Tahun 2030.',
  misi: [
    'Merumuskan dan memutakhirkan kebijakan, manual, standar, dan formulir SPMI sesuai perkembangan SN-Dikti serta standar akreditasi internasional.',
    'Menyelenggarakan Audit Mutu Internal (AMI) secara berkala, objektif, dan independen di seluruh fakultas, program studi, dan unit kerja.',
    'Memfasilitasi dan mendampingi program studi dalam persiapan dan pelaksanaan asesmen akreditasi BAN-PT dan Lembaga Akreditasi Mandiri (LAM).',
    'Menyelenggarakan Rapat Tinjauan Manajemen (RTM) serta mengawal pelaksanaan tindakan koreksi dan peningkatan mutu berkelanjutan (PPEPP).',
    'Membangun sistem informasi penjaminan mutu digital yang transparan, akuntabel, dan terintegrasi untuk mendukung budaya mutu universitas.'
  ],
  tujuan: [
    'Terwujudnya kepatuhan terhadap seluruh Standar Nasional Pendidikan Tinggi dan Standar Mutu Universitas Palembang.',
    'Meningkatnya perolehan peringkat akreditasi Unggul bagi seluruh program studi dan institusi.',
    'Terbangunnya budaya mutu kerja yang profesional, akuntabel, dan berorientasi pada kepuasan pemangku kepentingan.'
  ],
  tupoksi: [
    {
      title: 'Pusat Perencanaan dan Standar Mutu',
      points: [
        'Merancang dan memutakhirkan 10 Aspek Standar Mutu SPMI.',
        'Menyusun pedoman manual mutu siklus PPEPP.',
        'Sosialisasi kebijakan mutu ke seluruh fakultas dan unit kerja.'
      ]
    },
    {
      title: 'Pusat Audit dan Evaluasi Mutu (AMI)',
      points: [
        'Menyelenggarakan Audit Mutu Internal berkala setiap semester.',
        'Merekrut dan meningkatkan kompetensi auditor mutu internal.',
        'Menyusun laporan hasil audit dan rekomendasi perbaikan.'
      ]
    },
    {
      title: 'Pusat Akreditasi dan Asesmen',
      points: [
        'Mendampingi penyusunan borang akreditasi BAN-PT dan LAM.',
        'Simulasi asesmen lapangan dan validasi LED/LKPS.',
        'Pemantauan masa berlaku dan perpanjangan SK akreditasi.'
      ]
    }
  ],
  maklumat_pelayanan: 'Lembaga Penjaminan Mutu Internal (SPMI) Universitas Palembang berkomitmen memberikan pendampingan penjaminan mutu, fasilitasi akreditasi, dan audit internal secara independen, transparan, dan akuntabel demi terwujudnya tridharma perguruan tinggi berstandar unggul.',
  budaya_mutu: [
    {
      title: 'Integritas & Akuntabilitas',
      desc: 'Menjunjung tinggi kejujuran akademik dan keterbukaan data evaluasi kinerja tridharma.'
    },
    {
      title: 'Perbaikan Berkelanjutan (Kaizen)',
      desc: 'Berorientasi pada peningkatan standar mutu secara terus menerus melalui siklus PPEPP.'
    },
    {
      title: 'Kolaborasi & Pelayanan Prima',
      desc: 'Bersinergi aktif mendampingi unit kerja dan program studi mencapai target akreditasi unggul.'
    }
  ]
};

export const homePageContentSeed: HomePageContent = {
  hero_badge: 'Sistem Informasi Penjaminan Mutu Internal',
  hero_title: 'Sistem Penjaminan Mutu Internal',
  hero_title_highlight: 'Universitas Palembang',
  hero_subtitle: 'Mengawal standar keunggulan akademik, tata kelola tridharma perguruan tinggi yang akuntabel, serta budaya mutu berkelanjutan (PPEPP) menuju akreditasi unggul nasional dan internasional.',
  hero_cta_primary_text: 'Jelajahi Dokumen Mutu',
  hero_cta_secondary_text: 'Lihat Akreditasi',
  stats: [
    {
      id: 1,
      title: 'Program Studi Terakreditasi',
      value: '100%',
      description: 'Seluruh prodi telah terakreditasi BAN-PT & LAM',
      icon_name: 'Award',
      bgColor: 'from-amber-500 to-yellow-500'
    },
    {
      id: 2,
      title: 'Dokumen Standar SPMI',
      value: '10 Standar',
      description: 'Pedoman PPEPP tridharma terintegrasi',
      icon_name: 'FileText',
      bgColor: 'from-blue-500 to-indigo-500'
    },
    {
      id: 3,
      title: 'Auditor Internal Tersertifikasi',
      value: '24 Auditor',
      description: 'Auditor profesional penjaminan mutu',
      icon_name: 'Users',
      bgColor: 'from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      title: 'Capaian Rata-Rata Mutu',
      value: '104.8%',
      description: 'Hasil evaluasi Audit Mutu Internal 2024',
      icon_name: 'BarChart3',
      bgColor: 'from-purple-500 to-pink-500'
    }
  ],
  cta_banner_title: 'Siap Mengawal Akreditasi Unggul Program Studi Anda',
  cta_banner_desc: 'Lembaga Penjaminan Mutu Internal (SPMI) UNPAL siap memberikan pendampingan teknis LED, LKPS, instrumen AMI, serta fasilitasi borang akreditasi BAN-PT dan LAM.'
};

export const contactPageContentSeed: ContactPageContent = {
  office_name: 'Lembaga Penjaminan Mutu Internal (SPMI)',
  institution_name: 'Universitas Palembang',
  address: 'Gedung Rektorat Lt. 2, Kampus Terpadu Universitas Palembang, Jl. Dharmapala No. 1A, Bukit Besar',
  city: 'Kota Palembang, Sumatera Selatan 30139',
  email: 'spmi@unpal.ac.id',
  phone: '(0711) 512345 / 512346',
  whatsapp: '+62 812-7389-9900',
  operational_hours: 'Senin - Jumat: 08.00 - 16.00 WIB',
  google_maps_url: 'https://maps.google.com/maps?q=-2.992631,104.725786+(Universitas+Palembang)&t=&z=17&ie=UTF8&iwloc=B&output=embed'
};

export const newsItemsSeed: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Sosialisasi Instrumen Akreditasi LAMEMBA 2024 bagi Fakultas Ekonomi & Bisnis',
    slug: 'sosialisasi-instrumen-akreditasi-lamemba-2024',
    category: 'Akreditasi',
    date: '2024-07-15',
    excerpt: 'SPMI UNPAL menggelar workshop pendampingan penyusunan Laporan Evaluasi Diri (LED) berbasis luaran OBE bagi tim akreditasi FEB.',
    image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    author: 'Tim Humas SPMI',
    read_time: '3 menit baca'
  },
  {
    id: 'news-2',
    title: 'Pelaksanaan Audit Mutu Internal (AMI) Siklus XI Tahun Akademik 2023/2024 Genap',
    slug: 'pelaksanaan-audit-mutu-internal-ami-siklus-xi-2024',
    category: 'Audit Mutu',
    date: '2024-06-20',
    excerpt: 'Sebanyak 18 auditor internal bersertifikat diterjunkan untuk mengaudit kepatuhan 10 standar mutu di seluruh program studi.',
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    author: 'Pusat Audit SPMI',
    read_time: '4 menit baca'
  },
  {
    id: 'news-3',
    title: 'Rapat Tinjauan Manajemen (RTM) Semester Genap: Komitmen Peningkatan Skor Akreditasi',
    slug: 'rapat-tinjauan-manajemen-rtm-semester-genap-2024',
    category: 'RTM',
    date: '2024-07-02',
    excerpt: 'Rektorat bersama pimpinan fakultas menyepakati 12 butir Rencana Tindak Koreksi (RTK) untuk peningkatan mutu berkelanjutan.',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800',
    author: 'Sekretariat SPMI',
    read_time: '3 menit baca'
  }
];

export const adminUsersSeed: AdminUser[] = [
  {
    id: 'c7f9a4ad-d0ac-4fae-9fac-2056d1eb89e7',
    name: 'Super Administrator SPMI',
    email: 'superadmin@unpal.ac.id',
    password: 'admin123',
    role: 'superadmin',
    role_label: 'Super Administrator',
    nip: '198501012010011001',
    unit_fakultas: 'Lembaga Penjaminan Mutu (SPMI)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    is_active: true,
    permissions: getDefaultPermissions('superadmin'),
    last_login: '2026-08-24 10:00',
    created_at: '2024-01-01'
  },
  {
    id: 'c7f9a4ad-d0ac-4fae-9fac-2056d1eb89e8',
    name: 'Administrator SPMI UNPAL',
    email: 'admin@unpal.ac.id',
    password: 'password',
    role: 'superadmin',
    role_label: 'Super Administrator',
    nip: '197508122003121002',
    unit_fakultas: 'Lembaga Penjaminan Mutu (SPMI)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    is_active: true,
    permissions: getDefaultPermissions('superadmin'),
    last_login: '2026-08-23 20:00',
    created_at: '2024-01-01'
  },
  {
    id: '6f2472cc-e0f5-4796-843a-bed965133d6c',
    name: 'Staf Penjaminan Mutu',
    email: 'spmi@unpal.ac.id',
    password: 'password',
    role: 'admin_spmi',
    role_label: 'Administrator Sistem',
    nip: '198104192006042001',
    unit_fakultas: 'Lembaga Penjaminan Mutu (SPMI)',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    is_active: true,
    permissions: getDefaultPermissions('admin_spmi'),
    last_login: '2026-08-23 19:30',
    created_at: '2024-01-01'
  }
];

