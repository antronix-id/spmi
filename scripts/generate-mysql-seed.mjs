import fs from 'fs';
import path from 'path';
import mysql from 'mysql2';

const dump = JSON.parse(fs.readFileSync(path.resolve('scripts', 'exported_db.json'), 'utf-8'));

function escapeVal(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'object') {
    if (val instanceof Date || (typeof val.toISOString === 'function')) {
      return `'${new Date(val).toISOString().slice(0, 19).replace('T', ' ')}'`;
    }
    return mysql.escape(JSON.stringify(val));
  }
  return mysql.escape(String(val));
}

function formatDate(val) {
  if (!val) return 'NULL';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return escapeVal(val);
    return `'${d.toISOString().slice(0, 19).replace('T', ' ')}'`;
  } catch {
    return escapeVal(val);
  }
}

function formatDateOnly(val) {
  if (!val) return 'NULL';
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) {
    return `'${val.trim()}'`;
  }
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return escapeVal(val);
    return `'${d.toISOString().slice(0, 10)}'`;
  } catch {
    return escapeVal(val);
  }
}

let sql = `-- ==============================================================================
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
DROP TABLE IF EXISTS \`accreditations\`;
CREATE TABLE \`accreditations\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`institution_or_program\` VARCHAR(255) NOT NULL,
  \`level\` VARCHAR(32) NOT NULL,
  \`faculty\` VARCHAR(255) DEFAULT NULL,
  \`rating\` VARCHAR(64) NOT NULL,
  \`sk_number\` VARCHAR(255) NOT NULL,
  \`decree_date\` DATE DEFAULT NULL,
  \`expiry_date\` DATE NOT NULL,
  \`status\` VARCHAR(64) NOT NULL,
  \`accreditation_agency\` VARCHAR(64) NOT NULL,
  \`certificate_url\` TEXT DEFAULT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_accreditations_level\` (\`level\`),
  KEY \`idx_accreditations_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

// Accreditations data
if (dump.accreditations && dump.accreditations.length > 0) {
  sql += `-- Data seed accreditations (${dump.accreditations.length} baris)\n`;
  sql += `INSERT INTO \`accreditations\` (\`id\`, \`institution_or_program\`, \`level\`, \`faculty\`, \`rating\`, \`sk_number\`, \`decree_date\`, \`expiry_date\`, \`status\`, \`accreditation_agency\`, \`certificate_url\`, \`created_at\`) VALUES\n`;
  const rows = dump.accreditations.map(r => {
    return `(${escapeVal(r.id)}, ${escapeVal(r.institution_or_program)}, ${escapeVal(r.level)}, ${escapeVal(r.faculty)}, ${escapeVal(r.rating)}, ${escapeVal(r.sk_number)}, ${formatDateOnly(r.decree_date)}, ${formatDateOnly(r.expiry_date)}, ${escapeVal(r.status)}, ${escapeVal(r.accreditation_agency)}, ${escapeVal(r.certificate_url)}, ${formatDate(r.created_at || new Date())})`;
  });
  sql += rows.join(',\n') + ';\n\n';
}

// 2. Documents
sql += `-- ------------------------------------------------------------------------------
-- 2. TABEL: documents (Dokumen Mutu, SPMI, AMI, RTM, dll)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`documents\`;
CREATE TABLE \`documents\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(128) NOT NULL,
  \`standard_aspect\` VARCHAR(128) DEFAULT NULL,
  \`document_code\` VARCHAR(64) DEFAULT NULL,
  \`year\` INT NOT NULL,
  \`description\` TEXT DEFAULT NULL,
  \`file_url\` TEXT NOT NULL,
  \`file_size\` VARCHAR(32) DEFAULT NULL,
  \`download_count\` INT DEFAULT 0,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_documents_category\` (\`category\`),
  KEY \`idx_documents_year\` (\`year\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (dump.documents && dump.documents.length > 0) {
  sql += `-- Data seed documents (${dump.documents.length} baris)\n`;
  sql += `INSERT INTO \`documents\` (\`id\`, \`title\`, \`category\`, \`standard_aspect\`, \`document_code\`, \`year\`, \`description\`, \`file_url\`, \`file_size\`, \`download_count\`, \`updated_at\`) VALUES\n`;
  const rows = dump.documents.map(r => {
    return `(${escapeVal(r.id)}, ${escapeVal(r.title)}, ${escapeVal(r.category)}, ${escapeVal(r.standard_aspect)}, ${escapeVal(r.document_code)}, ${r.year || 2024}, ${escapeVal(r.description)}, ${escapeVal(r.file_url)}, ${escapeVal(r.file_size)}, ${r.download_count || 0}, ${formatDate(r.updated_at || new Date())})`;
  });
  sql += rows.join(',\n') + ';\n\n';
}

// 3. Document Access Keys
sql += `-- ------------------------------------------------------------------------------
-- 3. TABEL: document_access_keys (Kode & Token Akses Dokumen Terproteksi)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`document_access_keys\`;
CREATE TABLE \`document_access_keys\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`code\` VARCHAR(64) NOT NULL,
  \`label\` VARCHAR(255) NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`expires_at\` DATETIME DEFAULT NULL,
  \`max_uses\` INT DEFAULT NULL,
  \`used_count\` INT DEFAULT 0,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`created_by\` VARCHAR(255) DEFAULT NULL,
  \`note\` TEXT DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_code\` (\`code\`),
  KEY \`idx_access_keys_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (dump.document_access_keys && dump.document_access_keys.length > 0) {
  sql += `-- Data seed document_access_keys (${dump.document_access_keys.length} baris)\n`;
  sql += `INSERT INTO \`document_access_keys\` (\`id\`, \`code\`, \`label\`, \`created_at\`, \`expires_at\`, \`max_uses\`, \`used_count\`, \`is_active\`, \`created_by\`, \`note\`) VALUES\n`;
  const rows = dump.document_access_keys.map(r => {
    return `(${escapeVal(r.id)}, ${escapeVal(r.code)}, ${escapeVal(r.label)}, ${formatDate(r.created_at || new Date())}, ${formatDate(r.expires_at)}, ${r.max_uses === null ? 'NULL' : r.max_uses}, ${r.used_count || 0}, ${r.is_active ? 1 : 0}, ${escapeVal(r.created_by)}, ${escapeVal(r.note)})`;
  });
  sql += rows.join(',\n') + ';\n\n';
}

// 4. Monitoring Data
sql += `-- ------------------------------------------------------------------------------
-- 4. TABEL: monitoring_data (Audit Mutu Internal / Ketercapaian Standar)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`monitoring_data\`;
CREATE TABLE \`monitoring_data\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`standard_name\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(128) NOT NULL,
  \`faculty\` VARCHAR(255) NOT NULL,
  \`study_program\` VARCHAR(255) DEFAULT NULL,
  \`target_score\` DECIMAL(5,2) NOT NULL,
  \`actual_score\` DECIMAL(5,2) NOT NULL,
  \`achievement_rate\` DECIMAL(5,2) NOT NULL,
  \`status\` VARCHAR(64) NOT NULL,
  \`audit_period\` VARCHAR(64) NOT NULL,
  \`findings_count\` INT DEFAULT 0,
  \`resolved_findings\` INT DEFAULT 0,
  PRIMARY KEY (\`id\`),
  KEY \`idx_monitoring_period\` (\`audit_period\`),
  KEY \`idx_monitoring_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (dump.monitoring_data && dump.monitoring_data.length > 0) {
  sql += `-- Data seed monitoring_data (${dump.monitoring_data.length} baris)\n`;
  sql += `INSERT INTO \`monitoring_data\` (\`id\`, \`standard_name\`, \`category\`, \`faculty\`, \`study_program\`, \`target_score\`, \`actual_score\`, \`achievement_rate\`, \`status\`, \`audit_period\`, \`findings_count\`, \`resolved_findings\`) VALUES\n`;
  const rows = dump.monitoring_data.map(r => {
    return `(${escapeVal(r.id)}, ${escapeVal(r.standard_name)}, ${escapeVal(r.category)}, ${escapeVal(r.faculty)}, ${escapeVal(r.study_program)}, ${parseFloat(r.target_score) || 0}, ${parseFloat(r.actual_score) || 0}, ${parseFloat(r.achievement_rate) || 0}, ${escapeVal(r.status)}, ${escapeVal(r.audit_period)}, ${r.findings_count || 0}, ${r.resolved_findings || 0})`;
  });
  sql += rows.join(',\n') + ';\n\n';
}

// 5. Regulations
sql += `-- ------------------------------------------------------------------------------
-- 5. TABEL: regulations (Peraturan, Undang-Undang, SK Rektor, dsb.)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`regulations\`;
CREATE TABLE \`regulations\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`regulation_number\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(128) NOT NULL,
  \`year\` INT NOT NULL,
  \`description\` TEXT DEFAULT NULL,
  \`file_url\` TEXT NOT NULL,
  \`issued_by\` VARCHAR(255) NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_regulations_category\` (\`category\`),
  KEY \`idx_regulations_year\` (\`year\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (dump.regulations && dump.regulations.length > 0) {
  sql += `-- Data seed regulations (${dump.regulations.length} baris)\n`;
  sql += `INSERT INTO \`regulations\` (\`id\`, \`title\`, \`regulation_number\`, \`category\`, \`year\`, \`description\`, \`file_url\`, \`issued_by\`) VALUES\n`;
  const rows = dump.regulations.map(r => {
    return `(${escapeVal(r.id)}, ${escapeVal(r.title)}, ${escapeVal(r.regulation_number)}, ${escapeVal(r.category)}, ${r.year || 2024}, ${escapeVal(r.description)}, ${escapeVal(r.file_url)}, ${escapeVal(r.issued_by)})`;
  });
  sql += rows.join(',\n') + ';\n\n';
}

// 6. Contact Messages
sql += `-- ------------------------------------------------------------------------------
-- 6. TABEL: contact_messages (Pesan Masuk Kontak & Pengaduan)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`contact_messages\`;
CREATE TABLE \`contact_messages\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(64) DEFAULT NULL,
  \`category\` VARCHAR(128) NOT NULL,
  \`subject\` VARCHAR(255) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`status\` VARCHAR(64) DEFAULT 'Baru',
  \`reply_note\` TEXT DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_messages_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (dump.contact_messages && dump.contact_messages.length > 0) {
  sql += `-- Data seed contact_messages (${dump.contact_messages.length} baris)\n`;
  sql += `INSERT INTO \`contact_messages\` (\`id\`, \`name\`, \`email\`, \`phone\`, \`category\`, \`subject\`, \`message\`, \`created_at\`, \`status\`, \`reply_note\`) VALUES\n`;
  const rows = dump.contact_messages.map(r => {
    return `(${escapeVal(r.id)}, ${escapeVal(r.name)}, ${escapeVal(r.email)}, ${escapeVal(r.phone)}, ${escapeVal(r.category)}, ${escapeVal(r.subject)}, ${escapeVal(r.message)}, ${formatDate(r.created_at || new Date())}, ${escapeVal(r.status || 'Baru')}, ${escapeVal(r.reply_note)})`;
  });
  sql += rows.join(',\n') + ';\n\n';
}

// 7. Organization Members
sql += `-- ------------------------------------------------------------------------------
-- 7. TABEL: org_members (Struktur Organisasi SPMI)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`org_members\`;
CREATE TABLE \`org_members\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`position\` VARCHAR(255) NOT NULL,
  \`division\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) DEFAULT NULL,
  \`photo_url\` TEXT DEFAULT NULL,
  \`nip\` VARCHAR(64) DEFAULT NULL,
  \`order\` INT DEFAULT 0,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_org_members_order\` (\`order\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (dump.org_members && dump.org_members.length > 0) {
  sql += `-- Data seed org_members (${dump.org_members.length} baris)\n`;
  sql += `INSERT INTO \`org_members\` (\`id\`, \`name\`, \`position\`, \`division\`, \`email\`, \`photo_url\`, \`nip\`, \`order\`, \`created_at\`) VALUES\n`;
  const rows = dump.org_members.map(r => {
    return `(${escapeVal(r.id)}, ${escapeVal(r.name)}, ${escapeVal(r.position)}, ${escapeVal(r.division)}, ${escapeVal(r.email)}, ${escapeVal(r.photo_url)}, ${escapeVal(r.nip)}, ${r.order || 0}, ${formatDate(r.created_at || new Date())})`;
  });
  sql += rows.join(',\n') + ';\n\n';
}

// 8. Pages Content
sql += `-- ------------------------------------------------------------------------------
-- 8. TABEL: pages_content (Konten Beranda, Visi Misi, Tupoksi, Tentang Kami)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`pages_content\`;
CREATE TABLE \`pages_content\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`slug\` VARCHAR(128) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`subtitle\` TEXT DEFAULT NULL,
  \`content\` JSON NOT NULL,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_pages_slug\` (\`slug\`),
  KEY \`idx_pages_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (dump.pages_content && dump.pages_content.length > 0) {
  sql += `-- Data seed pages_content (${dump.pages_content.length} baris)\n`;
  sql += `INSERT INTO \`pages_content\` (\`id\`, \`slug\`, \`title\`, \`subtitle\`, \`content\`, \`updated_at\`) VALUES\n`;
  const rows = dump.pages_content.map(r => {
    return `(${escapeVal(r.id)}, ${escapeVal(r.slug)}, ${escapeVal(r.title)}, ${escapeVal(r.subtitle)}, ${escapeVal(r.content)}, ${formatDate(r.updated_at || new Date())})`;
  });
  sql += rows.join(',\n') + ';\n\n';
}

// 9. Users Admin
sql += `-- ------------------------------------------------------------------------------
-- 9. TABEL: users_admin (Akun Administrator, Auditor & Staff)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS \`users_admin\`;
CREATE TABLE \`users_admin\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`full_name\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(255) DEFAULT NULL,
  \`role\` VARCHAR(64) NOT NULL DEFAULT 'admin_spmi',
  \`faculty\` VARCHAR(255) DEFAULT NULL,
  \`password_hash\` VARCHAR(255) DEFAULT NULL,
  \`permissions\` JSON DEFAULT NULL,
  \`nip\` VARCHAR(64) DEFAULT NULL,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`last_login\` DATETIME DEFAULT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_users_email\` (\`email\`),
  KEY \`idx_users_role\` (\`role\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

if (dump.users_admin && dump.users_admin.length > 0) {
  sql += `-- Data seed users_admin (${dump.users_admin.length} baris)\n`;
  sql += `INSERT INTO \`users_admin\` (\`id\`, \`email\`, \`full_name\`, \`name\`, \`role\`, \`faculty\`, \`password_hash\`, \`permissions\`, \`nip\`, \`is_active\`, \`last_login\`, \`created_at\`) VALUES\n`;
  const rows = dump.users_admin.map(r => {
    return `(${escapeVal(r.id)}, ${escapeVal(r.email)}, ${escapeVal(r.full_name || r.name || '')}, ${escapeVal(r.name || r.full_name || '')}, ${escapeVal(r.role || 'admin_spmi')}, ${escapeVal(r.faculty)}, ${escapeVal(r.password_hash)}, ${escapeVal(r.permissions)}, ${escapeVal(r.nip)}, ${r.is_active === false ? 0 : 1}, ${formatDate(r.last_login)}, ${formatDate(r.created_at || new Date())})`;
  });
  sql += rows.join(',\n') + ';\n\n';
}

sql += `SET FOREIGN_KEY_CHECKS = 1;
-- ==============================================================================
-- MIGRASI DAN SEED SELESAI
-- ==============================================================================
`;

fs.writeFileSync(path.resolve('mysql-schema-and-seed.sql'), sql, 'utf-8');
console.log('MySQL schema and seed SQL generated successfully at: mysql-schema-and-seed.sql');
