-- ==============================================================================
-- DATABASE SPMI UNIVERSITAS PALEMBANG (MYSQL / MARIADB)
-- Generated automatically from current active database (PostgreSQL / Supabase)
-- Charset: utf8mb4, Collation: utf8mb4_unicode_ci
-- Engine: InnoDB
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. TABEL: accreditations (Akreditasi Institusi & Program Studi)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `accreditations`;
CREATE TABLE `accreditations` (
  `id` VARCHAR(64) NOT NULL,
  `institution_or_program` VARCHAR(255) NOT NULL,
  `level` VARCHAR(32) NOT NULL,
  `faculty` VARCHAR(255) DEFAULT NULL,
  `rating` VARCHAR(64) NOT NULL,
  `sk_number` VARCHAR(255) NOT NULL,
  `decree_date` DATE DEFAULT NULL,
  `expiry_date` DATE NOT NULL,
  `status` VARCHAR(64) NOT NULL,
  `accreditation_agency` VARCHAR(64) NOT NULL,
  `certificate_url` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_accreditations_level` (`level`),
  KEY `idx_accreditations_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data seed accreditations (7 baris)
INSERT INTO `accreditations` (`id`, `institution_or_program`, `level`, `faculty`, `rating`, `sk_number`, `decree_date`, `expiry_date`, `status`, `accreditation_agency`, `certificate_url`, `created_at`) VALUES
('acc_1787714544430', 'S1 Pendidikan Bahasa Inggris', 'S1', 'Fakultas Keguruan & Ilmu Pendidikan', 'Baik', '426/SK/LAMDIK/Ak/S/X/2022', '2022-10-13', '2027-10-12', 'Aktif', 'LAMDIK', '/uploads/accreditations/1787714454825_sertifikat_pendidikan_bahasa_inggris_2022.pdf', '2026-08-25 20:22:24'),
('acc_1787714698642', 'S1 Teknik Elektro', 'S1', 'Fakultas Teknik', 'Baik', '0163/SK/LAM Teknik/AS/VIII/2023', '2023-08-19', '2027-12-18', 'Aktif', 'LAM-TEKNIK', '/uploads/accreditations/1787714571243_sertifikat_teknik_elektro_2023.pdf', '2026-08-25 20:24:58'),
('acc_1787715990013', 'S1 Teknik Sipil', 'S1', 'Fakultas Teknik', 'Terakreditasi', 'No. 0903/SK/LAM Teknik/AS/XII/2025', '2025-12-19', '2030-12-18', 'Aktif', 'LAM-TEKNIK', '/uploads/accreditations/1787715888797_sertifikat_teknik_sipil.pdf', '2026-08-25 20:46:29'),
('acc-inst-1', 'Universitas Palembang', 'Institusi', 'Universitas', 'Baik Sekali', '83/SK/BAN-PT/Akred/PT/II/2021', '2021-02-14', '2026-02-14', 'Aktif', 'BAN-PT', '/uploads/accreditations/1787714048579_sertifikat_unpal_2021.pdf', '2026-08-21 22:36:52'),
('acc-prodi-1', 'S1 Manajemen', 'S1', 'Fakultas Ekonomi & Bisnis', 'Baik Sekali', '1824/DE/A.5/AR.10/XII/2024', '2024-12-07', '2029-12-07', 'Aktif', 'LAMEMBA', '/uploads/accreditations/1787713816421_sertifikat_manajemen_2024.pdf', '2026-08-21 22:36:52'),
('acc-prodi-5', 'S1 Ilmu Hukum', 'S1', 'Fakultas Hukum', 'Baik', '492/SK/BAN-PT/Ak.Ppj/S/II/2023', '2023-02-19', '2028-02-19', 'Aktif', 'BAN-PT', '/uploads/accreditations/1787714155456_sertifikat_ilmu_hukum_2023.pdf', '2026-08-21 22:36:52'),
('acc-prodi-6', 'S1 Agroteknologi', 'S1', 'Fakultas Pertanian', 'Baik', '8065/SK/BAN-PT/Ak.Ppj/S/X/2022', '2022-10-30', '2027-10-30', 'Aktif', 'BAN-PT', '/uploads/accreditations/1787714341236_sertifikat_agroteknologi_2023.pdf', '2026-08-21 22:36:52');

-- ------------------------------------------------------------------------------
-- 2. TABEL: documents (Dokumen Mutu, SPMI, AMI, RTM, dll)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `documents`;
CREATE TABLE `documents` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(128) NOT NULL,
  `standard_aspect` VARCHAR(128) DEFAULT NULL,
  `document_code` VARCHAR(64) DEFAULT NULL,
  `year` INT NOT NULL,
  `description` TEXT DEFAULT NULL,
  `file_url` TEXT NOT NULL,
  `file_size` VARCHAR(32) DEFAULT NULL,
  `download_count` INT DEFAULT 0,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_documents_category` (`category`),
  KEY `idx_documents_year` (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data seed documents (23 baris)
INSERT INTO `documents` (`id`, `title`, `category`, `standard_aspect`, `document_code`, `year`, `description`, `file_url`, `file_size`, `download_count`, `updated_at`) VALUES
('doc_1787640360493', 'Ilmu Hukum', 'Laporan AMI', NULL, '-', 2024, '', '/uploads/documents/1787640352651_ilmu_hukum.pdf', '0.6 MB', 0, '2026-10-02 08:35:14'),
('doc_1787640608655', 'UNIVERSITAS', 'Laporan AMI', NULL, '-', 2024, '', '/uploads/documents/1787640592467_universitas.pdf', '1.6 MB', 0, '2026-10-02 08:35:14'),
('doc_1787640721039', 'Agroteknologi', 'Laporan AMI', NULL, '-', 2021, '', '/uploads/documents/1787640706766_agroteknologi.pdf', '1.0 MB', 0, '2026-10-02 08:35:14'),
('doc_1787640945899', 'BAHASA INGGRIS', 'Laporan AMI', NULL, '-', 2021, '', '/uploads/documents/1787640928221_bahasa_inggris.pdf', '0.8 MB', 0, '2026-10-02 08:35:14'),
('doc_1787641022477', 'Agroteknologi', 'Laporan AMI', NULL, '-', 2022, '', '/uploads/documents/1787641009833_agroteknologi.pdf', '1.0 MB', 0, '2026-10-02 08:35:14'),
('doc_1787641059356', 'BAHASA INGGRIS', 'Laporan AMI', NULL, '-', 2022, '', '/uploads/documents/1787641042969_bahasa_inggris.pdf', '1.3 MB', 0, '2026-10-02 08:35:14'),
('doc_1787641095567', 'Universitas', 'Laporan AMI', NULL, '-', 2022, '', '/uploads/documents/1787641076008_universitas.pdf', '1.6 MB', 0, '2026-10-02 08:35:14'),
('doc_1787641314261', 'Teknik Elektro', 'Laporan AMI', NULL, '-', 2023, '', '/uploads/documents/1787641293231_teknik_elektro.pdf', '0.3 MB', 0, '2026-10-02 08:35:14'),
('doc_1787641398907', 'Agroteknologi', 'Laporan AMI', NULL, '-', 2025, '', '/uploads/documents/1787641388221_agroteknologi.pdf', '1.0 MB', 0, '2026-10-02 08:35:14'),
('doc_1787641447448', 'Teknik Sipil', 'Laporan AMI', NULL, '-', 2025, '', '/uploads/documents/1787641423869_teknik_sipil.pdf', '0.1 MB', 0, '2026-10-02 08:35:14'),
('doc_1787641490183', 'Bahasa Inggris', 'Laporan AMI', NULL, '-', 2025, '', '/uploads/documents/1787641462486_bahasa_inggris.pdf', '0.2 MB', 0, '2026-10-02 08:35:14'),
('doc_1787641542692', 'Universitas', 'Laporan AMI', NULL, '-', 2025, '', '/uploads/documents/1787641532039_universitas.pdf', '1.8 MB', 0, '2026-10-02 08:35:14'),
('doc_1787710647746', 'FORMULIR SASARAN MUTU UNIVERSITAS PALEMBANG', 'Formulir Mutu', NULL, '-', 2024, '', '/uploads/documents/1787710609423_formulir_sasaran_mutu_universitas_palembang.pdf', '0.3 MB', 0, '2026-10-02 08:35:14'),
('doc_1787710717256', 'KEBIJAKAN SPMI UNPAL', 'Kebijakan SPMI', NULL, '-', 2024, '', '/uploads/documents/1787710690859_kebijakan_spmi_unpal_2024.pdf', '2.9 MB', 0, '2026-10-02 08:35:14'),
('doc_1787710780917', 'PENDOKUMENTASIAN IMPLEMENTASI SPMI', 'Manual Mutu', NULL, '-', 2024, '', '/uploads/documents/1787710746896_pendokumentasian_implementasi_spmi.pdf', '2.3 MB', 0, '2026-10-02 08:35:14'),
('doc_1787710837030', 'BAHASA INGGRIS', 'Dokumen RTM', NULL, '-', 2021, '', '/uploads/documents/1787710822051_bahasa_inggris.pdf', '0.1 MB', 0, '2026-10-02 08:35:14'),
('doc_1787717416446', 'Kelengkapan Dokumen-Teknik Sipil', 'Formulir Mutu', NULL, '-', 2024, '', '/uploads/documents/1787717387956_form_1-_kelengkapan_dokumen-teknik_sipil_2023.pdf', '0.1 MB', 0, '2026-10-02 08:35:14'),
('doc_1787717611240', 'Laporan hasil Audit Teknik Sipil', 'Laporan AMI', NULL, '-', 2023, '', '/uploads/documents/1787717545804_form_6-_laporan_hasil_audit_-teknik_sipil.pdf', '0.1 MB', 0, '2026-10-02 08:35:14'),
('doc_1787717712564', 'Kebijakan Spmi Universitas Palembang', 'Kebijakan SPMI', NULL, '035 A/433.0.1/VII/2024', 2024, '', '/uploads/documents/1787717653229_kebijakan_spmi_unpal_2024.pdf', '2.9 MB', 0, '2026-10-02 08:35:14'),
('doc_1787717916374', 'PENDOKUMENTASIAN IMPLEMENTASI SPM', 'Formulir Mutu', NULL, '058.A/433.0.1/XI/2024', 2024, '', '/uploads/documents/1787717827785_pendokumentasian_implementasi_spmi.pdf', '2.3 MB', 0, '2026-10-02 08:35:14'),
('doc_1787718038641', 'DAFTAR TILIK UNIVERSITAS PALEMBANG TAHUN', 'Formulir Mutu', NULL, 'FM-AMI/02/00', 2024, '', '/uploads/documents/1787717967078_daftar_tilik_universitas_palembang_tahun_2024.pdf', '0.1 MB', 0, '2026-10-02 08:35:14'),
('doc_1787718486355', 'BAHASA INGGRIS', 'Dokumen RTM', NULL, '-', 2021, '', '/uploads/documents/1787718426288_bahasa_inggris.pdf', '0.1 MB', 0, '2026-10-02 08:35:14'),
('doc_1787718556713', 'ILMU HUKUM', 'Standar SPMI', NULL, '-', 2021, '', '/uploads/documents/1787718526284_ilmu_hukum.pdf', '0.1 MB', 0, '2026-10-02 08:35:14');

-- ------------------------------------------------------------------------------
-- 3. TABEL: document_access_keys (Kode & Token Akses Dokumen Terproteksi)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `document_access_keys`;
CREATE TABLE `document_access_keys` (
  `id` VARCHAR(64) NOT NULL,
  `code` VARCHAR(64) NOT NULL,
  `label` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME DEFAULT NULL,
  `max_uses` INT DEFAULT NULL,
  `used_count` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_by` VARCHAR(255) DEFAULT NULL,
  `note` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_code` (`code`),
  KEY `idx_access_keys_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data seed document_access_keys (2 baris)
INSERT INTO `document_access_keys` (`id`, `code`, `label`, `created_at`, `expires_at`, `max_uses`, `used_count`, `is_active`, `created_by`, `note`) VALUES
('key_1787542426144_8x33', 'SPMI-VV7R82', 'tes', '2026-08-23 20:33:46', NULL, NULL, 1, 1, 'Administrator LPM', NULL),
('key_1787712633886_re86', 'SPMI-ZHZ25Z', 'asesor', '2026-08-25 19:50:33', '2026-09-01 19:50:33', NULL, 2, 1, 'Administrator LPM', NULL);

-- ------------------------------------------------------------------------------
-- 4. TABEL: monitoring_data (Audit Mutu Internal / Ketercapaian Standar)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `monitoring_data`;
CREATE TABLE `monitoring_data` (
  `id` VARCHAR(64) NOT NULL,
  `standard_name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(128) NOT NULL,
  `faculty` VARCHAR(255) NOT NULL,
  `study_program` VARCHAR(255) DEFAULT NULL,
  `target_score` DECIMAL(5,2) NOT NULL,
  `actual_score` DECIMAL(5,2) NOT NULL,
  `achievement_rate` DECIMAL(5,2) NOT NULL,
  `status` VARCHAR(64) NOT NULL,
  `audit_period` VARCHAR(64) NOT NULL,
  `findings_count` INT DEFAULT 0,
  `resolved_findings` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_monitoring_period` (`audit_period`),
  KEY `idx_monitoring_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data seed monitoring_data (5 baris)
INSERT INTO `monitoring_data` (`id`, `standard_name`, `category`, `faculty`, `study_program`, `target_score`, `actual_score`, `achievement_rate`, `status`, `audit_period`, `findings_count`, `resolved_findings`) VALUES
('mon-5', 'Standar Prestasi Kemahasiswaan Tingkat Nasional & Kepuasan Layanan Pembelajaran', 'Kemahasiswaan', 'Fakultas Hukum', 'S1 Ilmu Hukum', 85, 91.4, 107.5, 'Melampaui', '2023/2024 Genap', 1, 1),
('mon-6', 'Standar Kualifikasi Dosen (Doktor S3 ≥ 40% & Lektor Kepala/Guru Besar ≥ 35%)', 'Sumber Daya Manusia', 'Fakultas Keguruan & Ilmu Pendidikan', 'S1 Pendidikan Bahasa Inggris', 85, 89.5, 105.3, 'Melampaui', '2023/2024 Genap', 2, 2),
('mon-7', 'Standar Ketersediaan & Pemutakhiran Fasilitas Sarana Prasarana Laboratorium', 'Sarana Prasarana', 'Fakultas Teknik', 'S1 Teknik Elektro', 85, 87, 102.4, 'Tercapai', '2023/2024 Genap', 2, 2),
('mon-8', 'Standar Transparansi & Akuntabilitas Alokasi Anggaran Keuangan Operasional', 'Keuangan', 'Universitas Palembang', 'Biro Administrasi Keuangan', 85, 90, 105.9, 'Melampaui', '2023/2024 Genap', 1, 1),
('mon-9', 'Standar Kerjasama Strategis Nasional & Internasional (MoU & MoA Aktif)', 'Kerja Sama', 'Universitas Palembang', 'Tingkat Institusi', 80, 83.5, 104.4, 'Tercapai', '2023/2024 Genap', 3, 3);

-- ------------------------------------------------------------------------------
-- 5. TABEL: regulations (Peraturan, Undang-Undang, SK Rektor, dsb.)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `regulations`;
CREATE TABLE `regulations` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `regulation_number` VARCHAR(255) NOT NULL,
  `category` VARCHAR(128) NOT NULL,
  `year` INT NOT NULL,
  `description` TEXT DEFAULT NULL,
  `file_url` TEXT NOT NULL,
  `issued_by` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_regulations_category` (`category`),
  KEY `idx_regulations_year` (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data seed regulations (5 baris)
INSERT INTO `regulations` (`id`, `title`, `regulation_number`, `category`, `year`, `description`, `file_url`, `issued_by`) VALUES
('reg_1787641711750', 'Peraturan SPM UNPAL', '06.A/433.0.1/1/2024', 'SK Rektor', 2024, '', '/uploads/regulations/1787641649939_peraturan_spm_unpal_2024.pdf', 'Rektor Universitas Palembang'),
('reg_1787641792453', 'Peraturan Manajemen Resiko UNPAL', '075A/433.0.1/X/2025', 'SK Rektor', 2025, '', '/uploads/regulations/1787641747200_peraturan_manajemen_risiko_unpal_2025.pdf', 'Rektor Universitas Palembang'),
('reg_1787641914879', 'INSTRUMEN PEMANTAUAN DAN EVALUASI MUTU PERGURUAN TINGGI UNTUK PERPANJANGAN STATUS TERAKREDITASI MELALUI MEKANISME AUTOMASI', 'NOMOR 5 TAHUN 2024', 'SN-Dikti', 2024, '', '/uploads/regulations/1787641813836_perban-pt-5-2024-instrumen-pemutu-pt-untuk-perpanjangan-status-terakreditasi-pt.pdf', 'BAN-PT'),
('reg_1787642017309', 'PERATURAN MENTERI PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI REPUBLIK INDONESIA', 'NOMOR 53 TAHUN 2023', 'Permendikbudristek', 2023, '', '/uploads/regulations/1787641937607_permendikbudridtek-no-53-tahun-2023.pdf', 'KEMENDIKBUD-RISTEK'),
('reg_1787718379920', 'Pedoman AMI Universitas Palembang', 'SK-REKTOR/2023', 'Pedoman SPMI', 2023, '', '/uploads/regulations/1787718258214_pedoman_ami_universitas_palembang.pdf', 'Rektor Universitas Palembang');

-- ------------------------------------------------------------------------------
-- 6. TABEL: contact_messages (Pesan Masuk Kontak & Pengaduan)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(64) DEFAULT NULL,
  `category` VARCHAR(128) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(64) DEFAULT 'Baru',
  `reply_note` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_messages_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data seed contact_messages (2 baris)
INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `category`, `subject`, `message`, `created_at`, `status`, `reply_note`) VALUES
('msg-2', 'Dra. Ratna Juwita, M.Si.', 'ratna_juwita@gmail.com', '085290182341', 'Permohonan Dokumen', 'Permohonan Salinan Legalisir Sertifikat Akreditasi Institusi', 'Mohon dibantu salinan digital legalisir sertifikat akreditasi institusi Universitas Palembang tahun 2023 dengan barcode resmi untuk kelengkapan administrasi beasiswa luar negeri.', '2026-08-19 22:36:52', 'Selesai', 'Dokumen sertifikat berlegalisir resmi telah dikirim ke email pemohon.'),
('msg-3', 'Budi Santoso, S.T.', 'budisantoso99@gmail.com', '081399887766', 'Pertanyaan Umum', 'Jadwal Siklus Audit Mutu Internal Periode Ganjil 2024/2025', 'Halo admin SPMI, mohon info kapan instrumen formulir AMI untuk evaluasi semester ganjil dapat diunduh oleh unit kerja? Terima kasih.', '2026-08-20 22:36:52', 'Baru', NULL);

-- ------------------------------------------------------------------------------
-- 7. TABEL: org_members (Struktur Organisasi SPMI)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `org_members`;
CREATE TABLE `org_members` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `position` VARCHAR(255) NOT NULL,
  `division` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `photo_url` TEXT DEFAULT NULL,
  `nip` VARCHAR(64) DEFAULT NULL,
  `order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_org_members_order` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data seed org_members (6 baris)
INSERT INTO `org_members` (`id`, `name`, `position`, `division`, `email`, `photo_url`, `nip`, `order`, `created_at`) VALUES
('org-1787633879121', 'Ir. Yani Purwanti, MSi.', 'Ketua', 'Pimpinan Utama SPMI', NULL, '/uploads/images/members/1787713183555_screenshot_2026-08-26_095828.png', NULL, 1, '2026-08-24 21:57:59'),
('org-1787633920988', 'Ir. Fitri Yetty Zairani, MP', 'Wakil Ketua', 'Pusat Audit & Evaluasi Mutu', NULL, '/uploads/images/members/1787713064890_q.jpeg', NULL, 2, '2026-08-24 21:58:41'),
('org-1787634098531', 'Hartini Agustiawati, S.Pd, M.Pd', 'Sekretaris', 'Pimpinan Utama SPMI', NULL, '/uploads/images/members/1787712826837_screenshot_2026-08-26_095301.png', NULL, 3, '2026-08-24 22:01:38'),
('org-1787634221602', 'Daeny Septi Yansuri, ST, MT', 'Anggota', 'Pusat Standar Mutu', NULL, '/uploads/images/members/1787713093891_r.jpeg', NULL, 4, '2026-08-24 22:03:41'),
('org-1787634247707', 'dr.Ardiana Hidayah, SH, MH', 'Anggota', 'Pusat Standar Mutu', NULL, '/uploads/images/members/1787712972228_screenshot_2026-08-26_095551.png', NULL, 5, '2026-08-24 22:04:07'),
('org-1787634274039', ' Tiara Eliza, S.Hum, MPd', 'Anggota', 'Pusat Standar Mutu', NULL, '/uploads/images/members/1787712920408_screenshot_2026-08-26_095312.png', NULL, 6, '2026-08-24 22:04:34');

-- ------------------------------------------------------------------------------
-- 8. TABEL: pages_content (Konten Beranda, Visi Misi, Tupoksi, Tentang Kami)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `pages_content`;
CREATE TABLE `pages_content` (
  `id` VARCHAR(64) NOT NULL,
  `slug` VARCHAR(128) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` TEXT DEFAULT NULL,
  `content` JSON NOT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_pages_slug` (`slug`),
  KEY `idx_pages_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data seed pages_content (4 baris)
INSERT INTO `pages_content` (`id`, `slug`, `title`, `subtitle`, `content`, `updated_at`) VALUES
('page-about', 'about', 'Tentang Kami', NULL, '{\"misi\":[\"Menyelenggarakan pendidikan tinggi untuk melaksanakan dan mengembangkan ilmu pengetahuan dan teknologi untuk menghasilkan lulusan yang memiliki kualifikasi akademik unggul, mampu bersaing dalam dunia kerja, dapat menghadapi tantangan dan menciptakan dunia kerja, memiliki kreatifitas dan inovasi serta berwawasan entrepreneur.\",\"Menyelenggarakan dan mengembangkan kegiatan penelitian serta menghasilkan karya ilmiah yang relevan dengan perkembangan IPTEKS dan kebutuhan masyarakat.\",\"Menyelenggarakan pengabdian kepada masyarakat melalui kegiatan pelayanan kepada masyarakat sesuai dengan pengembangan IPTEKS dan hasil penelitian yang dilaksanakan baik secara periodik maupun secara insidental.\",\"Mengembangkan soft skill dan kompetensi akademik mahasiswa agar menghasilkan lulusan yang imajinatif, inovatif dan kompeten secara profesional serta berwawasan entrepreneur sehingga mampu bersaing untuk mendapatkan pekerjaan dan mampu menghadapi tantangan serta menciptakan lapangan kerja.\",\"Menyelenggarakan tata pamong dan tata kelola yang baik dan benar menuju Good University Governance.\",\"Mengembangkan sumberdaya manusia (SDM) yang mampu menunjang peningkatan kualitas pendidikan, penelitian dan pengabdian kepada masyarakat.\",\"Menyelenggarakan kerjasama kemitraan yang saling menguntungkan dalam rangka meningkatkan kualitas SDM, mendukung sistem pendanaan dan pemanfaatan fasilitas untuk pelaksanaan kegiatan tri dharma perguruan tinggi serta membantu mitra dalam mendukung pelaksaan kegiatan kemitraan.\"],\"visi\":\"Visi SPMI Menjadi Universitas yang Unggul dalam Pendidikan Tinggi dan Berwawasan Entrepreneur tahun 2032.\",\"tujuan\":[\"Terwujudnya kepatuhan terhadap seluruh Standar Nasional Pendidikan Tinggi dan Standar Mutu Universitas Palembang.\",\"Meningkatnya perolehan peringkat akreditasi Unggul bagi seluruh program studi dan institusi.\",\"Terbangunnya budaya mutu kerja yang profesional, akuntabel, dan berorientasi pada kepuasan pemangku kepentingan.\"],\"tupoksi\":[{\"title\":\"Pusat Perencanaan dan Standar Mutu\",\"points\":[\"Merancang dan memutakhirkan 10 Aspek Standar Mutu SPMI.\",\"Menyusun pedoman manual mutu siklus PPEPP.\",\"Sosialisasi kebijakan mutu ke seluruh fakultas dan unit kerja.\"]},{\"title\":\"Pusat Audit dan Evaluasi Mutu (AMI)\",\"points\":[\"Menyelenggarakan Audit Mutu Internal berkala setiap semester.\",\"Merekrut dan meningkatkan kompetensi auditor mutu internal.\",\"Menyusun laporan hasil audit dan rekomendasi perbaikan.\"]},{\"title\":\"Pusat Akreditasi dan Asesmen\",\"points\":[\"Mendampingi penyusunan borang akreditasi BAN-PT dan LAM.\",\"Simulasi asesmen lapangan dan validasi LED/LKPS.\",\"Pemantauan masa berlaku dan perpanjangan SK akreditasi.\"]}],\"budaya_mutu\":[{\"desc\":\"Menjunjung tinggi kejujuran akademik dan keterbukaan data evaluasi kinerja tridharma.\",\"title\":\"Integritas & Akuntabilitas\"},{\"desc\":\"Berorientasi pada peningkatan standar mutu secara terus menerus melalui siklus PPEPP.\",\"title\":\"Perbaikan Berkelanjutan (Kaizen)\"},{\"desc\":\"Bersinergi aktif mendampingi unit kerja dan program studi mencapai target akreditasi unggul.\",\"title\":\"Kolaborasi & Pelayanan Prima\"}],\"maklumat_pelayanan\":\"Lembaga Penjaminan Mutu Internal (SPMI) Universitas Palembang berkomitmen memberikan pendampingan penjaminan mutu, fasilitasi akreditasi, dan audit internal secara independen, transparan, dan akuntabel demi terwujudnya tridharma perguruan tinggi berstandar unggul.\"}', '2026-08-24 03:07:38'),
('page-home', 'home', 'Halaman Beranda', NULL, '{\"stats\":[{\"id\":1,\"title\":\"Program Studi Terakreditasi\",\"value\":\"100%\",\"bgColor\":\"from-amber-500 to-yellow-500\",\"icon_name\":\"Award\",\"description\":\"Seluruh prodi telah terakreditasi BAN-PT & LAM\"},{\"id\":2,\"title\":\"Dokumen Standar SPMI\",\"value\":\"10 Standar\",\"bgColor\":\"from-blue-500 to-indigo-500\",\"icon_name\":\"FileText\",\"description\":\"Pedoman PPEPP tridharma terintegrasi\"},{\"id\":3,\"title\":\"Auditor Internal\",\"value\":\"5 Auditor\",\"bgColor\":\"from-emerald-500 to-teal-500\",\"icon_name\":\"Users\",\"description\":\"Auditor penjaminan mutu\"},{\"id\":4,\"title\":\"Capaian Rata-Rata Mutu\",\"value\":\"104.8%\",\"bgColor\":\"from-purple-500 to-pink-500\",\"icon_name\":\"BarChart3\",\"description\":\"Hasil evaluasi Audit Mutu Internal 2024\"}],\"hero_badge\":\"Sistem Informasi Penjaminan Mutu Internal\",\"hero_title\":\"Sistem Penjaminan Mutu Internal\",\"hero_subtitle\":\"Mengawal standar keunggulan akademik, tata kelola tridharma perguruan tinggi yang akuntabel, serta budaya mutu berkelanjutan (PPEPP) menuju akreditasi unggul nasional dan internasional.\",\"slider_images\":[\"/uploads/images/banners/1787711485690_11.jpeg\"],\"cta_banner_desc\":\"Lembaga Penjaminan Mutu Internal (SPMI) UNPAL siap memberikan pendampingan teknis LED, LKPS, instrumen AMI, serta fasilitasi borang akreditasi BAN-PT dan LAM.\",\"cta_banner_title\":\"Siap Mengawal Akreditasi Unggul Program Studi Anda\",\"hero_title_highlight\":\"Universitas Palembang\",\"hero_cta_primary_text\":\"Jelajahi Dokumen Mutu\",\"hero_cta_secondary_text\":\"Lihat Akreditasi\"}', '2026-10-02 08:35:15'),
('page-tupoksi', 'tupoksi', 'Tugas Pokok & Fungsi SPMI', 'Mandat tata kelola penjaminan mutu internal universitas', '{\"fungsi\":[\"Penyusunan dokumen PPEPP\",\"Fasilitasi akreditasi prodi\",\"Pengawalan kepatuhan standar mutu\"],\"tugas_pokok\":\"Merencanakan, melaksanakan, mengevaluasi, mengendalikan, dan meningkatkan standar mutu pendidikan tinggi di seluruh unit kerja Universitas Palembang.\"}', '2026-08-21 22:15:35'),
('page-visi-misi', 'visi-misi', 'Visi, Misi & Komitmen Mutu', 'Arah pengembangan mutu Universitas Palembang menuju perguruan tinggi unggul', '{\"misi\":[\"Menetapkan dan mengembangkan standar mutu tridharma perguruan tinggi yang adaptif.\",\"Melaksanakan audit mutu internal (AMI) secara berkala, independen, dan profesional.\",\"Mendorong peningkatan mutu berkelanjutan (Continuous Quality Improvement) berbasis budaya mutu sivitas akademika.\"],\"visi\":\"Menjadi Lembaga Penjaminan Mutu Internal yang kredibel, akuntabel, dan transformatif dalam mengawal Universitas Palembang menjadi perguruan tinggi unggul di tingkat nasional.\"}', '2026-08-21 22:15:35');

-- ------------------------------------------------------------------------------
-- 9. TABEL: users_admin (Akun Administrator, Auditor & Staff)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `users_admin`;
CREATE TABLE `users_admin` (
  `id` VARCHAR(64) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `role` VARCHAR(64) NOT NULL DEFAULT 'admin_spmi',
  `faculty` VARCHAR(255) DEFAULT NULL,
  `password_hash` VARCHAR(255) DEFAULT NULL,
  `permissions` JSON DEFAULT NULL,
  `nip` VARCHAR(64) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `last_login` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data seed users_admin (13 baris)
INSERT INTO `users_admin` (`id`, `email`, `full_name`, `name`, `role`, `faculty`, `password_hash`, `permissions`, `nip`, `is_active`, `last_login`, `created_at`) VALUES
('092f6c7c-db93-444f-8c5e-d4a43bc3a3ad', 'superadmin@unpal.ac.id', 'Super Administrator SPMI', 'Super Administrator SPMI', 'superadmin', 'Lembaga Penjaminan Mutu (SPMI)', 'admin123', '{\"users\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"content\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"messages\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"overview\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', '198501012010011001', 1, '2026-08-26 02:46:00', '2026-08-23 17:00:00'),
('3c2f4160-9891-4db0-8dde-9f49a3558ac2', 'admin@unpal.ac.id', 'Admin SPMI Utama', 'Admin SPMI Utama', 'superadmin', 'Lembaga Penjaminan Mutu (SPMI)', 'password', '{\"users\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"content\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"messages\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"overview\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', '197508122003121002', 1, NULL, '2026-08-23 17:00:00'),
('42b876ab-ac7c-4d28-85dd-df92e71434b4', 'jemi@gmail.com', 'jemiarian', 'jemiarian', 'superadmin', 'Lembaga Penjaminan Mutu (LPM)', 'Jemi12345', '{\"users\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"content\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"messages\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"overview\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', '197508122003121002', 1, '2026-08-24 08:34:00', '2024-01-14 17:00:00'),
('4e5673a1-362a-4b39-8213-486d203f081f', 'auditor.ami@unpal.ac.id', 'Ir. Bambang Supeno, M.Eng.', 'Ir. Bambang Supeno, M.Eng.', 'auditor', 'Pusat Audit Mutu Internal', 'auditor*unpal2025', '{\"users\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"content\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"messages\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"overview\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false},\"documents\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":false},\"regulations\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false},\"accreditations\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false}}', '197211051998031003', 1, '2026-08-23 11:54:00', '2024-02-29 17:00:00'),
('6f2472cc-e0f5-4796-843a-bed965133d6c', 'spmi@unpal.ac.id', 'Staf Penjaminan Mutu', 'Staf Penjaminan Mutu', 'admin_spmi', 'Lembaga Penjaminan Mutu (SPMI)', 'password', '{\"users\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"content\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false},\"messages\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":false},\"overview\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":false},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":false},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', '199002152015041003', 1, NULL, '2026-08-21 22:15:35'),
('717b5095-9513-4edd-a852-5357c82b748f', 'pakjoni@unpal.ac.id', 'Pak Joni', 'Pak Joni', 'superadmin', 'Lembaga Penjaminan Mutu (SPMI)', 'Pakjoni!23', '{\"users\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"content\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"messages\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"overview\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', NULL, 1, '2026-08-24 06:29:00', '2026-08-23 17:00:00'),
('7a31b212-6a31-4433-b544-6239ce911b58', 'bukyani@unpal.ac.id', 'bukyani', 'bukyani', 'admin_spmi', 'Lembaga Penjaminan Mutu (SPMI)', 'bukyani123', '{\"users\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"content\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"messages\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"overview\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', NULL, 1, '2026-08-24 19:07:00', '2026-08-23 17:00:00'),
('9173d3fe-5813-42b6-b4b4-8e78cf1de006', 'test@unpal.ac.id', 'test', 'test', 'admin_spmi', 'Lembaga Penjaminan Mutu (SPMI)', 'test12345', '{\"users\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"content\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"messages\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"overview\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', NULL, 1, NULL, '2026-08-23 17:00:00'),
('943f5ead-e3ec-43e8-9355-44858c08fa93', 'bukicha@unpal.ac.id', 'buk icha', 'buk icha', 'admin_spmi', 'Lembaga Penjaminan Mutu (SPMI)', 'bukicha!23', '{\"users\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"content\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"messages\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"overview\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', NULL, 1, '2026-08-24 09:45:00', '2026-08-23 17:00:00'),
('b521fc16-cf49-46e2-a0cf-68b87a70ed0c', 'rektorat@unpal.ac.id', 'Prof. Dr. Ir. H. Rektor UNPAL, M.Sc.', 'Prof. Dr. Ir. H. Rektor UNPAL, M.Sc.', 'pimpinan', 'Rektorat Universitas Palembang', 'rektor*unpal2025', '{\"users\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"content\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"messages\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"overview\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false},\"documents\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false},\"monitoring\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false},\"regulations\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false},\"accreditations\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false}}', '196803201992031001', 1, '2026-08-23 11:55:00', '2023-12-31 17:00:00'),
('d6acefec-7716-44af-b074-474f0586a7a4', 'test2@unpal.ac.id', 'test2', 'test2', 'superadmin', 'Lembaga Penjaminan Mutu (SPMI)', 'test2@unpal.ac.id', '{\"users\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"content\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"messages\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"overview\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', NULL, 1, '2026-08-24 08:25:00', '2026-08-23 17:00:00'),
('e3f7193e-f5e8-42c5-bd72-8a0ff1d2c600', 'user1@gmail.com', 'user1', 'user1', 'admin_spmi', 'Lembaga Penjaminan Mutu (SPMI)', 'User12345', '{\"users\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"content\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"messages\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"overview\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', NULL, 1, '2026-08-23 12:30:00', '2026-08-22 17:00:00'),
('fba43b8a-4a7e-4118-8377-59c00dda6c56', 'spmi.dokumen@unpal.ac.id', 'Dr. Hj. Siti Fatimah, S.Pd., M.Si.', 'Dr. Hj. Siti Fatimah, S.Pd., M.Si.', 'admin_spmi', 'Pusat Standarisasi & Akreditasi', 'dokumen*unpal2025', '{\"users\":{\"edit\":false,\"view\":false,\"create\":false,\"delete\":false},\"content\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":false},\"messages\":{\"edit\":true,\"view\":true,\"create\":false,\"delete\":true},\"overview\":{\"edit\":false,\"view\":true,\"create\":false,\"delete\":false},\"documents\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"monitoring\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":false},\"regulations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true},\"accreditations\":{\"edit\":true,\"view\":true,\"create\":true,\"delete\":true}}', '198004152006042001', 1, '2026-08-23 12:31:00', '2024-02-09 17:00:00');

SET FOREIGN_KEY_CHECKS = 1;
-- ==============================================================================
-- MIGRASI DAN SEED SELESAI
-- ==============================================================================
