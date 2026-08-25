/**
 * ============================================================================
 * SKEMA DATABASE POSTGRESQL & PUSH DATA OTOMATIS (SUPABASE & CPANEL POSTGRESQL)
 * ============================================================================
 * File ini digunakan untuk membuat struktur tabel (DDL) dan langsung mengunggah
 * (push) seluruh data aktif SPMI ke database PostgreSQL (baik di Supabase maupun cPanel).
 *
 * CARA MENJALANKAN:
 * 1. Di lokal / terminal:
 *    npx tsx src/lib/skema_database.ts
 *    atau:
 *    npm run db:push
 *
 * 2. Di cPanel Node.js Terminal / SSH:
 *    node -r dotenv/config src/lib/skema_database.ts
 * ============================================================================
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import {
  accreditationsSeed,
  documentsSeed,
  monitoringDataSeed,
  regulationsSeed,
  contactMessagesSeed,
  pageContentSeed,
  adminUsersSeed,
  orgMembersSeed
} from './seeds/seed-data';

// Load environment variables from .env.local or .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

export async function getDbPool() {
  if (!connectionString) {
    throw new Error('DATABASE_URL tidak ditemukan pada file environment (.env.local atau .env)');
  }
  return new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false }
  });
}

/**
 * Script DDL Pembuatan Seluruh Tabel Database
 */
export const CREATE_TABLES_SQL = `
-- 1. Tabel Akreditasi Program Studi & Institusi
CREATE TABLE IF NOT EXISTS accreditations (
    id TEXT PRIMARY KEY,
    institution_or_program TEXT NOT NULL,
    level TEXT NOT NULL,
    faculty TEXT,
    rating TEXT NOT NULL,
    sk_number TEXT NOT NULL,
    decree_date DATE,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL,
    accreditation_agency TEXT NOT NULL,
    certificate_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Dokumen SPMI
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    standard_aspect TEXT,
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
    status TEXT NOT NULL,
    audit_period TEXT NOT NULL,
    findings_count INTEGER DEFAULT 0,
    resolved_findings INTEGER DEFAULT 0
);

-- 5. Tabel Peraturan & Regulasi
CREATE TABLE IF NOT EXISTS regulations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    regulation_number TEXT NOT NULL,
    category TEXT NOT NULL,
    year INTEGER NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    issued_by TEXT NOT NULL
);

-- 6. Tabel Kotak Masuk Pesan Publik
CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'Baru',
    reply_note TEXT
);

-- 7. Tabel Konten Halaman Publik (Visi Misi, Tupoksi, dll)
CREATE TABLE IF NOT EXISTS pages_content (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
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
    role TEXT NOT NULL,
    faculty TEXT,
    password_hash TEXT,
    permissions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);
`;

/**
 * Fungsi Utama: Membuat Tabel & Melakukan Push Data Otomatis
 */
export async function pushDatabaseSchemaAndData() {
  console.log('===========================================================');
  console.log('🚀 MEMULAI PROSES INISIALISASI & PUSH DATABASE POSTGRESQL');
  console.log('===========================================================');
  
  const pool = await getDbPool();
  const client = await pool.connect();

  try {
    console.log('📡 Menghubungkan ke database PostgreSQL...');
    
    // 1. Eksekusi Pembuatan Struktur Tabel
    console.log('🛠️  Membuat seluruh tabel skema jika belum ada...');
    await client.query(CREATE_TABLES_SQL);
    console.log('✅ Struktur 8 tabel berhasil dibuat/diverifikasi.');

    // 2. Push Data Akreditasi (accreditations)
    console.log('\n📦 Melakukan push data Akreditasi...');
    for (const item of accreditationsSeed) {
      await client.query(`
        INSERT INTO accreditations (
          id, institution_or_program, level, faculty, rating, 
          sk_number, decree_date, expiry_date, status, accreditation_agency, certificate_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING;
      `, [
        item.id,
        item.institution_or_program,
        item.level,
        item.faculty || null,
        item.rating,
        item.sk_number,
        item.decree_date || null,
        item.expiry_date,
        item.status,
        item.accreditation_agency,
        item.certificate_url || '#'
      ]);
    }
    console.log(`✅ Data Akreditasi diproses (tanpa menimpa data yang sudah ada).`);

    // 3. Push Data Dokumen SPMI (documents)
    console.log('\n📦 Melakukan push data Dokumen SPMI...');
    for (const item of documentsSeed) {
      await client.query(`
        INSERT INTO documents (
          id, title, category, standard_aspect, document_code, 
          year, description, file_url, file_size, download_count, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING;
      `, [
        item.id,
        item.title,
        item.category,
        item.standard_aspect || null,
        item.document_code,
        item.year,
        item.description,
        item.file_url,
        item.file_size || '2.5 MB',
        item.download_count || 0,
        item.updated_at || new Date().toISOString()
      ]);
    }
    console.log(`✅ Data Dokumen SPMI diproses (tanpa menimpa data yang sudah ada).`);

    // 4. Push Default Access Keys
    console.log('\n📦 Melakukan push data Kunci Akses Dokumen...');
    const defaultKeys = [
      {
        id: 'key_1',
        code: 'SPMI-UNPAL-2024',
        label: 'Akses Standar Universitas (Umum)',
        is_active: true,
        created_by: 'Super Admin',
        note: 'Kode akses utama universitas untuk pengujian dan sivitas akademika'
      },
      {
        id: 'key_2',
        code: 'SPMI-ASESOR-2024',
        label: 'Asesor Akreditasi BAN-PT & LAM',
        is_active: true,
        created_by: 'Super Admin',
        note: 'Diberikan khusus untuk tim Asesor dan Auditor Eksternal'
      }
    ];

    for (const k of defaultKeys) {
      await client.query(`
        INSERT INTO document_access_keys (id, code, label, is_active, created_by, note)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (code) DO NOTHING;
      `, [k.id, k.code, k.label, k.is_active, k.created_by, k.note]);
    }
    console.log(`✅ Kunci Akses diproses (tanpa menimpa data yang sudah ada).`);

    // 5. Push Data Monitoring Data (monitoring_data)
    console.log('\n📦 Melakukan push data Pemantauan Mutu (AMI)...');
    for (const item of monitoringDataSeed) {
      await client.query(`
        INSERT INTO monitoring_data (
          id, standard_name, category, faculty, study_program,
          target_score, actual_score, achievement_rate, status, audit_period,
          findings_count, resolved_findings
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING;
      `, [
        item.id,
        item.standard_name,
        item.category,
        item.faculty,
        item.study_program || null,
        item.target_score,
        item.actual_score,
        item.achievement_rate,
        item.status,
        item.audit_period,
        item.findings_count || 0,
        item.resolved_findings || 0
      ]);
    }
    console.log(`✅ Data Pemantauan Mutu diproses (tanpa menimpa data yang sudah ada).`);

    // 6. Push Data Regulasi (regulations)
    console.log('\n📦 Melakukan push data Peraturan & Regulasi...');
    for (const item of regulationsSeed) {
      await client.query(`
        INSERT INTO regulations (
          id, title, regulation_number, category, year, description, file_url, issued_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING;
      `, [
        item.id,
        item.title,
        item.regulation_number,
        item.category,
        item.year,
        item.description,
        item.file_url,
        item.issued_by
      ]);
    }
    console.log(`✅ Data Regulasi diproses (tanpa menimpa data yang sudah ada).`);

    // 7. Push Data Pesan Kontak (contact_messages)
    console.log('\n📦 Melakukan push data Kotak Masuk Pesan...');
    for (const item of contactMessagesSeed) {
      await client.query(`
        INSERT INTO contact_messages (
          id, name, email, phone, category, subject, message, created_at, status, reply_note
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING;
      `, [
        item.id,
        item.name,
        item.email,
        item.phone || null,
        item.category,
        item.subject,
        item.message,
        item.created_at || new Date().toISOString(),
        item.status || 'Baru',
        item.reply_note || null
      ]);
    }
    console.log(`✅ Data Pesan Kontak diproses (tanpa menimpa data yang sudah ada).`);

    // 8. Push Data Konten Statis (pages_content)
    console.log('\n📦 Melakukan push data Konten Halaman Statis...');
    for (const item of pageContentSeed) {
      await client.query(`
        INSERT INTO pages_content (id, slug, title, subtitle, content, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (slug) DO NOTHING;
      `, [
        item.id,
        item.slug,
        item.title,
        item.subtitle || null,
        JSON.stringify(item.content),
        item.updated_at || new Date().toISOString()
      ]);
    }
    console.log(`✅ Data Konten Halaman diproses (tanpa menimpa data yang sudah ada).`);

    // 9. Push Data Anggota Organisasi (org_members)
    console.log('\n📦 Melakukan push data Struktur Organisasi...');
    for (const member of orgMembersSeed) {
      await client.query(`
        INSERT INTO org_members (id, name, position, division, email, photo_url, nip, "order")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING;
      `, [
        member.id,
        member.name,
        member.position,
        member.division,
        member.email || null,
        member.photo_url || null,
        member.nip || null,
        member.order || 0
      ]);
    }
    console.log(`✅ Data Anggota Organisasi diproses (tanpa menimpa data yang sudah ada).`);

    // 10. Push Data Pengguna Admin (users_admin)
    console.log('\n📦 Melakukan push data Pengguna Admin...');
    for (const item of adminUsersSeed) {
      await client.query(`
        INSERT INTO users_admin (id, name, email, role, faculty, permissions, created_at, last_login)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (email) DO NOTHING;
      `, [
        item.id,
        item.name,
        item.email,
        item.role,
        item.unit_fakultas || null,
        JSON.stringify(item.permissions),
        item.created_at || new Date().toISOString(),
        new Date().toISOString()
      ]);
    }
    console.log(`✅ Data Pengguna Admin diproses (tanpa menimpa data yang sudah ada).`);

    console.log('\n===========================================================');
    console.log('🎉 SEMUA TABEL DAN DATA POSTGRESQL BERHASIL DI-PUSH 100%!');
    console.log('===========================================================');
  } catch (err) {
    console.error('❌ Terjadi kesalahan saat push database:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Auto-run if executed directly
if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.includes('skema_database'))) {
  pushDatabaseSchemaAndData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
