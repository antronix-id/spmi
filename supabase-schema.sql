-- =========================================================
-- SKEMA DATABASE SPMI UNIVERSITAS PALEMBANG (PostgreSQL / Supabase)
-- =========================================================

-- 1. Tabel Akreditasi (BAN-PT / LAM)
CREATE TABLE IF NOT EXISTS accreditations (
    id TEXT PRIMARY KEY,
    institution_or_program TEXT NOT NULL,
    level TEXT NOT NULL, -- 'D3' | 'S1' | 'S2' | 'S3' | 'Profesi' | 'Institusi'
    faculty TEXT,
    rating TEXT NOT NULL, -- 'Unggul' | 'Baik Sekali' | 'Baik' | 'A' | 'B' | 'C' | 'Terakreditasi'
    sk_number TEXT NOT NULL,
    decree_date DATE,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL, -- 'Aktif' | 'Proses Reakreditasi' | 'Kedaluwarsa'
    accreditation_agency TEXT NOT NULL, -- 'BAN-PT' | 'LAMEMBA' | 'LAM-INFOKOM' | 'LAM-PTKes' | 'LAM-TEKNIK' | 'LAMDIK'
    certificate_url TEXT
);

-- 2. Tabel Dokumen Mutu SPMI
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Kebijakan SPMI' | 'Manual Mutu' | 'Standar SPMI' | 'Formulir Mutu' | 'Laporan AMI' | 'Dokumen RTM'
    standard_aspect TEXT, -- 'Pendidikan' | 'Penelitian' | 'Pengabdian pada Masyarakat' | dll
    document_code TEXT,
    year INTEGER NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_size TEXT,
    download_count INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Kunci & Link Akses Dokumen Terproteksi
CREATE TABLE IF NOT EXISTS document_access_keys (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by TEXT,
    note TEXT
);

-- 4. Tabel Pemantauan Mutu (Audit Mutu Internal / AMI)
CREATE TABLE IF NOT EXISTS monitoring_data (
    id TEXT PRIMARY KEY,
    standard_name TEXT NOT NULL,
    category TEXT NOT NULL,
    faculty TEXT NOT NULL,
    study_program TEXT,
    target_score NUMERIC NOT NULL,
    actual_score NUMERIC NOT NULL,
    achievement_rate NUMERIC NOT NULL,
    status TEXT NOT NULL, -- 'Tercapai' | 'Melampaui' | 'Belum Tercapai'
    audit_period TEXT NOT NULL,
    findings_count INTEGER DEFAULT 0,
    resolved_findings INTEGER DEFAULT 0
);

-- 5. Tabel Peraturan & Regulasi
CREATE TABLE IF NOT EXISTS regulations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    regulation_number TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Undang-Undang' | 'Permendikbudristek' | 'SN-Dikti' | 'SK Rektor' | 'Pedoman SPMI'
    year INTEGER NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    issued_by TEXT NOT NULL
);

-- 6. Tabel Kotak Masuk Pesan Publik / Pengaduan
CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    category TEXT NOT NULL, -- 'Pertanyaan Umum' | 'Konsultasi Mutu' | 'Pengaduan Layanan' | 'Permohonan Dokumen' | 'Lainnya'
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'Baru', -- 'Baru' | 'Diproses' | 'Selesai'
    reply_note TEXT
);

-- 7. Tabel Konten Halaman Statis (Tentang Kami, Tupoksi, Beranda, dll)
CREATE TABLE IF NOT EXISTS pages_content (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE, -- 'visi-misi' | 'struktur-organisasi' | 'tupoksi' | 'layanan' | 'tentang-kami' | 'home' | 'contact'
    title TEXT NOT NULL,
    subtitle TEXT,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabel Manajemen Pengguna Admin
CREATE TABLE IF NOT EXISTS users_admin (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL, -- 'superadmin' | 'auditor' | 'fakultas' | 'staff'
    faculty TEXT,
    password_hash TEXT,
    permissions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- =========================================================
-- PERMISSIONS & RLS CONFIGURATION
-- =========================================================
ALTER TABLE accreditations DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE document_access_keys DISABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE regulations DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE pages_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE users_admin DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
