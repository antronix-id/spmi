-- ==============================================================================
-- SPMI UNIVERSITAS PALEMBANG - POSTGRESQL DATABASE SCHEMA & SEED DATA
-- ==============================================================================

-- 1. Tabel users_admin
CREATE TABLE IF NOT EXISTS users_admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel pages_content
CREATE TABLE IF NOT EXISTS pages_content (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    content JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel accreditations
CREATE TABLE IF NOT EXISTS accreditations (
    id TEXT PRIMARY KEY,
    institution_or_program TEXT NOT NULL,
    level TEXT NOT NULL,
    faculty TEXT,
    rating TEXT NOT NULL,
    sk_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL,
    accreditation_agency TEXT NOT NULL,
    certificate_url TEXT NOT NULL
);

-- 4. Tabel documents
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    standard_aspect TEXT,
    document_code TEXT,
    year INTEGER NOT NULL,
    description TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size TEXT,
    download_count INTEGER DEFAULT 0,
    updated_at DATE NOT NULL
);

-- 5. Tabel monitoring_data
CREATE TABLE IF NOT EXISTS monitoring_data (
    id TEXT PRIMARY KEY,
    standard_name TEXT NOT NULL,
    category TEXT NOT NULL,
    faculty TEXT NOT NULL,
    study_program TEXT,
    target_score NUMERIC(5,2) NOT NULL,
    actual_score NUMERIC(5,2) NOT NULL,
    achievement_rate NUMERIC(5,2) NOT NULL,
    status TEXT NOT NULL,
    audit_period TEXT NOT NULL,
    findings_count INTEGER DEFAULT 0,
    resolved_findings INTEGER DEFAULT 0
);

-- 6. Tabel contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'Baru',
    reply_note TEXT
);

-- 7. Tabel regulations
CREATE TABLE IF NOT EXISTS regulations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    regulation_number TEXT NOT NULL,
    category TEXT NOT NULL,
    year INTEGER NOT NULL,
    description TEXT NOT NULL,
    file_url TEXT NOT NULL,
    issued_by TEXT NOT NULL
);

-- ==============================================================================
-- SEED DATA INSERTIONS (S1 UNIVERSITAS PALEMBANG)
-- ==============================================================================

-- Seed users_admin
INSERT INTO users_admin (email, full_name, role)
VALUES
('admin@unpal.ac.id', 'Administrator SPMI UNPAL', 'superadmin'),
('spmi@unpal.ac.id', 'Staf Penjaminan Mutu', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed pages_content
INSERT INTO pages_content (id, slug, title, subtitle, content)
VALUES
('page-visi-misi', 'visi-misi', 'Visi, Misi & Komitmen Mutu', 'Arah pengembangan mutu Universitas Palembang menuju perguruan tinggi unggul', '{"visi": "Menjadi Lembaga Penjaminan Mutu Internal yang kredibel, akuntabel, dan transformatif dalam mengawal Universitas Palembang menjadi perguruan tinggi unggul di tingkat nasional.", "misi": ["Menetapkan dan mengembangkan standar mutu tridharma perguruan tinggi yang adaptif.", "Melaksanakan audit mutu internal (AMI) secara berkala, independen, dan profesional.", "Mendorong peningkatan mutu berkelanjutan (Continuous Quality Improvement) berbasis budaya mutu sivitas akademika."]}'::jsonb),
('page-tupoksi', 'tupoksi', 'Tugas Pokok & Fungsi SPMI', 'Mandat tata kelola penjaminan mutu internal universitas', '{"tugas_pokok": "Merencanakan, melaksanakan, mengevaluasi, mengendalikan, dan meningkatkan standar mutu pendidikan tinggi di seluruh unit kerja Universitas Palembang.", "fungsi": ["Penyusunan dokumen PPEPP", "Fasilitasi akreditasi prodi", "Pengawalan kepatuhan standar mutu"]}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed accreditations (Institusi + 6 S1 Program Studi)
INSERT INTO accreditations (id, institution_or_program, level, faculty, rating, sk_number, expiry_date, status, accreditation_agency, certificate_url)
VALUES
('acc-inst-1', 'Universitas Palembang', 'Institusi', NULL, 'Baik Sekali', '124/SK/BAN-PT/Akred/PT/III/2023', '2028-03-24', 'Aktif', 'BAN-PT', '#'),
('acc-prodi-1', 'S1 Manajemen', 'S1', 'Fakultas Ekonomi & Bisnis', 'Unggul', '312/SK/LAMEMBA/Akred/S/V/2023', '2028-05-20', 'Aktif', 'LAMEMBA', '#'),
('acc-prodi-2', 'S1 Pendidikan Bahasa Inggris', 'S1', 'Fakultas Keguruan & Ilmu Pendidikan', 'Baik Sekali', '482/SK/LAMDIK/Akred/S/IX/2023', '2028-09-18', 'Aktif', 'LAMDIK', '#'),
('acc-prodi-3', 'S1 Teknik Elektro', 'S1', 'Fakultas Teknik', 'Baik', '095/SK/LAM-TEKNIK/Akred/S/II/2024', '2029-02-28', 'Aktif', 'LAM-TEKNIK', '#'),
('acc-prodi-4', 'S1 Teknik Sipil', 'S1', 'Fakultas Teknik', 'Baik Sekali', '118/SK/LAM-TEKNIK/Akred/S/XI/2023', '2028-11-14', 'Aktif', 'LAM-TEKNIK', '#'),
('acc-prodi-5', 'S1 Ilmu Hukum', 'S1', 'Fakultas Hukum', 'Baik Sekali', '551/SK/BAN-PT/Akred/S/IX/2022', '2027-09-30', 'Aktif', 'BAN-PT', '#'),
('acc-prodi-6', 'S1 Agroteknologi', 'S1', 'Fakultas Pertanian', 'Baik Sekali', '143/SK/BAN-PT/Akred/S/IV/2023', '2028-04-16', 'Aktif', 'BAN-PT', '#')
ON CONFLICT (id) DO NOTHING;

-- Seed documents
INSERT INTO documents (id, title, category, standard_aspect, document_code, year, description, file_url, file_size, download_count, updated_at)
VALUES
('doc-1', 'Buku Kebijakan SPMI Universitas Palembang Edisi 2023', 'Kebijakan SPMI', NULL, 'KB-SPMI-UNPAL-2023-01', 2023, 'Pedoman umum mengenai arah, visi, filosofi, komitmen, dan struktur penjaminan mutu internal Universitas Palembang.', '#', '2.4 MB', 520, '2023-08-10'),
('doc-2', 'Manual Mutu SPMI - Penetapan dan Pelaksanaan Standar (Siklus P-P)', 'Manual Mutu', NULL, 'MM-SPMI-UNPAL-2023-02', 2023, 'Tata cara dan prosedur baku perumusan, penetapan, pengesahan, dan sosialisasi standar mutu tridharma perguruan tinggi.', '#', '3.1 MB', 410, '2023-09-15'),
('doc-3', 'Manual Mutu SPMI - Evaluasi, Pengendalian, dan Peningkatan Standar (Siklus E-P-P)', 'Manual Mutu', NULL, 'MM-SPMI-UNPAL-2023-03', 2023, 'Tata cara Audit Mutu Internal (AMI), Rapat Tinjauan Manajemen (RTM), dan mekanisme tindakan koreksi berkelanjutan (Kaizen).', '#', '2.8 MB', 385, '2023-09-20'),
('doc-4', 'Standar Aspek Pendidikan (Kurikulum OBE, Proses Pembelajaran & Penilaian)', 'Standar SPMI', 'Pendidikan', 'STD-SPMI-UNPAL-PEND-01', 2023, 'Standar kompetensi lulusan, isi pembelajaran, proses pembelajaran, penilaian edukatif, dan evaluasi hasil belajar.', '#', '4.2 MB', 630, '2023-10-05'),
('doc-5', 'Standar Aspek Penelitian (Arah Riset, Hibah Kompetitif, & Publikasi Bereputasi)', 'Standar SPMI', 'Penelitian', 'STD-SPMI-UNPAL-LIT-02', 2023, 'Standar hasil penelitian, proses riset dosen dan mahasiswa, pendanaan hibah, dan publikasi jurnal terindeks Scopus/SINTA.', '#', '3.6 MB', 490, '2023-10-12'),
('doc-6', 'Standar Aspek Pengabdian pada Masyarakat (PkM Berbasis Hilirisasi)', 'Standar SPMI', 'Pengabdian pada Masyarakat', 'STD-SPMI-UNPAL-PKM-03', 2023, 'Standar luaran PkM, pemanfaatan hasil riset untuk pemberdayaan masyarakat Sumatera Selatan, dan kemitraan UMKM.', '#', '3.2 MB', 340, '2023-10-15'),
('doc-7', 'Standar Organisasi & Tata Kelola Kelembagaan Universitas', 'Standar SPMI', 'Organisasi', 'STD-SPMI-UNPAL-ORG-04', 2023, 'Standar struktur kepemimpinan, akuntabilitas manajerial, sistem penjaminan mutu fakultas/prodi (GKM), dan manajemen risiko.', '#', '3.4 MB', 380, '2023-10-18'),
('doc-8', 'Standar Aspek Kemahasiswaan & Pembinaan Prestasi', 'Standar SPMI', 'Kemahasiswaan', 'STD-SPMI-UNPAL-MHS-05', 2023, 'Standar penerimaan mahasiswa baru, layanan konseling, kegiatan minat bakat, penalaran, dan tracer study alumni.', '#', '3.1 MB', 420, '2023-10-20'),
('doc-9', 'Standar Aspek Sumber Daya Manusia (Dosen & Tenaga Kependidikan)', 'Standar SPMI', 'Sumber Daya Manusia', 'STD-SPMI-UNPAL-SDM-06', 2023, 'Standar kualifikasi akademik dosen (S3), jabatan fungsional (Lektor Kepala/Guru Besar), dan pelatihan kompetensi tendik.', '#', '3.5 MB', 460, '2023-10-22'),
('doc-10', 'Standar Aspek Sarana Prasarana & Teknologi Informasi', 'Standar SPMI', 'Sarana Prasarana', 'STD-SPMI-UNPAL-SARPRAS-07', 2023, 'Standar ruang kuliah ber-AC, fasilitas laboratorium terakreditasi, perpustakaan digital, dan infrastruktur jaringan internet.', '#', '3.9 MB', 350, '2023-10-24'),
('doc-11', 'Standar Aspek Keuangan & Pengelolaan Anggaran Tridharma', 'Standar SPMI', 'Keuangan', 'STD-SPMI-UNPAL-KEU-08', 2023, 'Standar alokasi dana operasional pendidikan, transparansi audit keuangan, efisiensi anggaran, dan dana abadi universitas.', '#', '2.9 MB', 310, '2023-10-26'),
('doc-12', 'Standar Aspek Kerja Sama Strategis Nasional & Internasional', 'Standar SPMI', 'Kerja Sama', 'STD-SPMI-UNPAL-KS-09', 2023, 'Standar implementasi MoU/MoA tridharma, pertukaran mahasiswa merdeka (MBKM), dan magang industri terstruktur.', '#', '3.3 MB', 395, '2023-10-28'),
('doc-13', 'Standar Aspek Kesejahteraan Sivitas Akademika & Tenaga Kependidikan', 'Standar SPMI', 'Kesejahteraan', 'STD-SPMI-UNPAL-SEJAHTERA-10', 2023, 'Standar jaminan kesehatan, tunjangan kinerja dosen/tendik, lingkungan kerja yang aman dan inklusif, serta beasiswa.', '#', '2.7 MB', 480, '2023-10-30'),
('doc-14', 'Instrumen Formulir Audit Mutu Internal (AMI) Siklus XI 2024', 'Formulir Mutu', NULL, 'FRM-SPMI-UNPAL-AMI-2024', 2024, 'Formulir instrumen audit kepatuhan 10 aspek standar, lembar temuan KTS/OB, dan format Rencana Tindak Koreksi (RTK).', '#', '1.9 MB', 850, '2024-02-01'),
('doc-15', 'Laporan Hasil Audit Mutu Internal (AMI) Siklus XI Tahun 2023/2024', 'Laporan AMI', NULL, 'LAP-AMI-UNPAL-2024-XI', 2024, 'Rekapitulasi lengkap evaluasi kepatuhan 10 aspek standar mutu pada seluruh program studi dan unit kerja universitas.', '#', '5.8 MB', 420, '2024-06-15'),
('doc-16', 'Risalah & Rencana Tindak Lanjut Rapat Tinjauan Manajemen (RTM) 2024', 'Dokumen RTM', NULL, 'RTM-SPMI-UNPAL-2024-01', 2024, 'Notula keputusan RTM universitas bersama rektorat dan senat mengenai perbaikan dan peningkatan berkelanjutan.', '#', '2.3 MB', 310, '2024-07-02')
ON CONFLICT (id) DO NOTHING;

-- Seed monitoring_data (10 Aspek Standar)
INSERT INTO monitoring_data (id, standard_name, category, faculty, study_program, target_score, actual_score, achievement_rate, status, audit_period, findings_count, resolved_findings)
VALUES
('mon-1', 'Standar Capaian Pembelajaran Lulusan & Kurikulum OBE (IPK > 3.30 & Waktu Tunggu < 5 Bulan)', 'Pendidikan', 'Fakultas Ekonomi & Bisnis', 'S1 Manajemen', 90, 95.2, 105.8, 'Melampaui', '2023/2024 Genap', 1, 1),
('mon-2', 'Standar Luaran Penelitian & Publikasi Jurnal Bereputasi (Scopus / SINTA 1-2)', 'Penelitian', 'Fakultas Teknik', 'S1 Teknik Sipil', 80, 75.0, 93.8, 'Belum Tercapai', '2023/2024 Genap', 4, 3),
('mon-3', 'Standar Kegiatan Pengabdian Masyarakat Berbasis Hilirisasi & Mitra Lokal', 'Pengabdian pada Masyarakat', 'Fakultas Pertanian', 'S1 Agroteknologi', 85, 88.0, 103.5, 'Melampaui', '2023/2024 Genap', 2, 2),
('mon-4', 'Standar Efektivitas Tata Kelola Organisasi & Gugus Kendali Mutu (GKM) Fakultas', 'Organisasi', 'Fakultas Hukum', 'Tingkat Fakultas', 85, 89.0, 104.7, 'Melampaui', '2023/2024 Genap', 1, 1),
('mon-5', 'Standar Prestasi Kemahasiswaan Tingkat Nasional & Kepuasan Layanan Pembelajaran', 'Kemahasiswaan', 'Fakultas Hukum', 'S1 Ilmu Hukum', 85, 91.4, 107.5, 'Melampaui', '2023/2024 Genap', 1, 1),
('mon-6', 'Standar Kualifikasi Dosen (Doktor S3 ≥ 40% & Lektor Kepala/Guru Besar ≥ 35%)', 'Sumber Daya Manusia', 'Fakultas Keguruan & Ilmu Pendidikan', 'S1 Pendidikan Bahasa Inggris', 85, 89.5, 105.3, 'Melampaui', '2023/2024 Genap', 2, 2),
('mon-7', 'Standar Ketersediaan & Pemutakhiran Fasilitas Sarana Prasarana Laboratorium', 'Sarana Prasarana', 'Fakultas Teknik', 'S1 Teknik Elektro', 85, 87.0, 102.4, 'Tercapai', '2023/2024 Genap', 2, 2),
('mon-8', 'Standar Transparansi & Akuntabilitas Alokasi Anggaran Keuangan Operasional', 'Keuangan', 'Universitas Palembang', 'Biro Administrasi Keuangan', 85, 90.0, 105.9, 'Melampaui', '2023/2024 Genap', 1, 1),
('mon-9', 'Standar Kerjasama Strategis Nasional & Internasional (MoU & MoA Aktif)', 'Kerja Sama', 'Universitas Palembang', 'Tingkat Institusi', 80, 83.5, 104.4, 'Tercapai', '2023/2024 Genap', 3, 3),
('mon-10', 'Standar Kesejahteraan Dosen, Tenaga Kependidikan & Fasilitas Jaminan Kesehatan', 'Kesejahteraan', 'Universitas Palembang', 'Seluruh Sivitas Akademika', 85, 88.5, 104.1, 'Tercapai', '2023/2024 Genap', 1, 1)
ON CONFLICT (id) DO NOTHING;

-- Seed regulations
INSERT INTO regulations (id, title, regulation_number, category, year, description, file_url, issued_by)
VALUES
('reg-1', 'Undang-Undang Republik Indonesia Nomor 12 Tahun 2012 tentang Pendidikan Tinggi', 'UU No. 12 Tahun 2012', 'Undang-Undang', 2012, 'Payung hukum utama penyelenggaraan sistem penjaminan mutu pendidikan tinggi (SPM Dikti) melalui SPMI dan SPME (Akreditasi).', '#', 'Pemerintah Republik Indonesia'),
('reg-2', 'Permendikbudristek Nomor 53 Tahun 2023 tentang Penjaminan Mutu Pendidikan Tinggi', 'Permendikbudristek No. 53/2023', 'Permendikbudristek', 2023, 'Transformasi Standar Nasional Pendidikan Tinggi (SN-Dikti) yang menyederhanakan standar tridharma dan mekanisme akreditasi otomatis.', '#', 'Kemendikbudristek RI'),
('reg-3', 'Peraturan BAN-PT Nomor 1 Tahun 2022 tentang Mekanisme Akreditasi Perguruan Tinggi', 'PerBAN-PT No. 01/2022', 'SN-Dikti', 2022, 'Pedoman pelaksanaan asesmen lapangan, matriks penilaian 9 kriteria akreditasi, dan mekanisme banding.', '#', 'Badan Akreditasi Nasional Perguruan Tinggi'),
('reg-4', 'Surat Keputusan Rektor tentang Kebijakan SPMI Universitas Palembang Periode 2023-2028', 'SK Rektor No. 142/UNPAL/SK/2023', 'SK Rektor', 2023, 'Penetapan buku kebijakan, manual mutu, dan 10 aspek standar mutu penjaminan internal UNPAL.', '#', 'Rektor Universitas Palembang'),
('reg-5', 'Pedoman Pelaksanaan Audit Mutu Internal (AMI) dan Rapat Tinjauan Manajemen (RTM)', 'SK Rektor No. 205/UNPAL/SK/2023', 'Pedoman SPMI', 2023, 'Standard Operating Procedure (SOP) pelaksanaan siklus audit mutu internal rutin, kualifikasi auditor, dan tindak koreksi.', '#', 'Badan Penjaminan Mutu UNPAL')
ON CONFLICT (id) DO NOTHING;

-- Seed contact_messages
INSERT INTO contact_messages (id, name, email, phone, category, subject, message, created_at, status, reply_note)
VALUES
('msg-1', 'Dr. Faisal Rahman, M.Kom.', 'faisal.fti@unpal.ac.id', '081273891029', 'Konsultasi Mutu', 'Konsultasi Penyusunan LED Akreditasi LAM-INFOKOM', 'Selamat pagi tim SPMI, kami dari Program Studi ingin menjadwalkan sesi konsultasi penyesuaian instrumen LED aspek SDM dan Pendidikan. Mohon kesediaan tim fasilitator.', now() - INTERVAL '3 days', 'Diproses', 'Dijadwalkan sesi pendampingan pada hari Kamis, 1 Agustus 2024 bersama Koordinator Akreditasi SPMI.'),
('msg-2', 'Dra. Ratna Juwita, M.Si.', 'ratna_juwita@gmail.com', '085290182341', 'Permohonan Dokumen', 'Permohonan Salinan Legalisir Sertifikat Akreditasi Institusi', 'Mohon dibantu salinan digital legalisir sertifikat akreditasi institusi Universitas Palembang tahun 2023 dengan barcode resmi untuk kelengkapan administrasi beasiswa luar negeri.', now() - INTERVAL '2 days', 'Selesai', 'Dokumen sertifikat berlegalisir resmi telah dikirim ke email pemohon.'),
('msg-3', 'Budi Santoso, S.T.', 'budisantoso99@gmail.com', '081399887766', 'Pertanyaan Umum', 'Jadwal Siklus Audit Mutu Internal Periode Ganjil 2024/2025', 'Halo admin SPMI, mohon info kapan instrumen formulir AMI untuk evaluasi semester ganjil dapat diunduh oleh unit kerja? Terima kasih.', now() - INTERVAL '1 day', 'Baru', NULL)
ON CONFLICT (id) DO NOTHING;
