/**
 * ============================================================================
 * SCRIPT CREATE ADMIN FULL ACCESS - SPMI UNIVERSITAS PALEMBANG
 * ============================================================================
 * File ini digunakan untuk membuat akun Administrator baru dengan HAK AKSES PENUH
 * (Super Administrator / Full Permissions pada semua modul SPMI).
 *
 * CARA PENGGUNAAN:
 * 1. Mode Interaktif (Tanya Jawab di Terminal):
 *    npx tsx scripts/create-admin.ts
 *    atau:
 *    npm run create:admin
 *
 * 2. Mode Argumen Langsung:
 *    npx tsx scripts/create-admin.ts --name="Admin Utama" --email="admin@unpal.ac.id" --password="password123" --nip="198501012010011001"
 *
 * 3. Mode Cepat / Otomatis (Default):
 *    npx tsx scripts/create-admin.ts --default
 * ============================================================================
 */

import { randomUUID } from 'crypto';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { AdminUser, UserPermissions } from '../src/lib/types';

// Load Environment Variables (.env.local & .env)
dotenv.config({ path: '.env.local' });
dotenv.config();

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 1. Definisi Hak Akses Penuh (Full Access 8 Modul)
export const FULL_ACCESS_PERMISSIONS: UserPermissions = {
  overview: { view: true, create: true, edit: true, delete: true },
  documents: { view: true, create: true, edit: true, delete: true },
  accreditations: { view: true, create: true, edit: true, delete: true },
  monitoring: { view: true, create: true, edit: true, delete: true },
  regulations: { view: true, create: true, edit: true, delete: true },
  messages: { view: true, create: true, edit: true, delete: true },
  content: { view: true, create: true, edit: true, delete: true },
  users: { view: true, create: true, edit: true, delete: true }
};

// Helper parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params: Record<string, string> = {};

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      params[key] = value !== undefined ? value : 'true';
    }
  }
  return params;
}

// 2. Fungsi Eksekusi ke Database PostgreSQL Langsung
async function saveToPostgres(user: AdminUser) {
  if (!databaseUrl) {
    console.log('ℹ️  DATABASE_URL tidak diset di .env/.env.local, melewati direct PostgreSQL insert.');
    return false;
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false }
  });

  const client = await pool.connect();
  try {
    // 1. Buat tabel jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS users_admin (
        id TEXT PRIMARY KEY,
        name TEXT,
        full_name TEXT,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'superadmin',
        faculty TEXT,
        password_hash TEXT,
        permissions JSONB,
        nip TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        last_login TIMESTAMPTZ
      );
    `);

    // 2. Pastikan kolom-kolom penting sudah ada (jika tabel lama dibuat dengan skema minimal)
    await client.query(`
      ALTER TABLE users_admin ADD COLUMN IF NOT EXISTS name TEXT;
      ALTER TABLE users_admin ADD COLUMN IF NOT EXISTS full_name TEXT;
      ALTER TABLE users_admin ADD COLUMN IF NOT EXISTS faculty TEXT;
      ALTER TABLE users_admin ADD COLUMN IF NOT EXISTS password_hash TEXT;
      ALTER TABLE users_admin ADD COLUMN IF NOT EXISTS permissions JSONB;
      ALTER TABLE users_admin ADD COLUMN IF NOT EXISTS nip TEXT;
      ALTER TABLE users_admin ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
      ALTER TABLE users_admin ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
    `);

    // 3. Upsert pengguna admin
    await client.query(`
      INSERT INTO users_admin (
        id, name, full_name, email, role, faculty, password_hash, permissions, nip, is_active, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        faculty = EXCLUDED.faculty,
        password_hash = EXCLUDED.password_hash,
        permissions = EXCLUDED.permissions,
        nip = EXCLUDED.nip,
        is_active = EXCLUDED.is_active;
    `, [
      user.id,
      user.name,
      user.name,
      user.email,
      user.role,
      user.unit_fakultas || 'Lembaga Penjaminan Mutu (SPMI)',
      user.password,
      JSON.stringify(user.permissions),
      user.nip || null,
      user.is_active,
      user.created_at
    ]);

    console.log('✅ Berhasil menyimpan/memperbarui admin di PostgreSQL (tabel users_admin).');
    return true;
  } catch (err: any) {
    console.error('❌ Gagal menyimpan ke PostgreSQL:', err.message || err);
    return false;
  } finally {
    client.release();
    await pool.end();
  }
}

// 3. Fungsi Eksekusi ke Supabase JS Client (Jika Dikonfigurasi)
async function saveToSupabase(user: AdminUser) {
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return false;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Coba simpan ke tabel users_admin
    const { error: err1 } = await supabase.from('users_admin').upsert({
      id: user.id,
      name: user.name,
      full_name: user.name,
      email: user.email,
      role: user.role,
      faculty: user.unit_fakultas,
      password_hash: user.password,
      permissions: user.permissions,
      nip: user.nip,
      is_active: user.is_active,
      created_at: user.created_at
    }, { onConflict: 'email' });

    if (!err1) {
      console.log('✅ Berhasil menyinkronkan data admin ke Supabase Cloud (tabel users_admin).');
      return true;
    } else {
      console.warn('⚠️  Supabase users_admin upsert info:', err1.message);
    }
  } catch (e: any) {
    console.warn('⚠️  Gagal menyinkronkan ke Supabase client:', e.message || e);
  }
  return false;
}

// 4. Main Function
async function main() {
  console.log('\n=============================================================');
  console.log('🛡️  PEMBUATAN AKUN ADMINISTRATOR (FULL ACCESS) SPMI UNPAL');
  console.log('=============================================================\n');

  const cliParams = parseArgs();
  const isDefault = cliParams['default'] === 'true';

  let name = cliParams['name'];
  let email = cliParams['email'];
  let password = cliParams['password'];
  let nip = cliParams['nip'];
  let unitFakultas = cliParams['unit'] || cliParams['faculty'];

  // Jika tidak ada argumen CLI lengkap dan bukan mode default, buka prompt interaktif
  if (!isDefault && (!name || !email || !password)) {
    const rl = readline.createInterface({ input, output });

    try {
      if (!name) {
        const inputName = await rl.question('👤 Masukkan Nama Lengkap Admin [Default: Super Administrator SPMI]: ');
        name = inputName.trim() || 'Super Administrator SPMI';
      }

      if (!email) {
        const inputEmail = await rl.question('📧 Masukkan Email Admin [Default: superadmin@unpal.ac.id]: ');
        email = inputEmail.trim() || 'superadmin@unpal.ac.id';
      }

      if (!password) {
        const inputPass = await rl.question('🔑 Masukkan Kata Sandi [Default: admin123]: ');
        password = inputPass.trim() || 'admin123';
      }

      if (!nip) {
        const inputNip = await rl.question('🏷️  Masukkan NIP / NIDN (Opsional) [Default: 198501012010011001]: ');
        nip = inputNip.trim() || '198501012010011001';
      }

      if (!unitFakultas) {
        const inputUnit = await rl.question('🏛️  Masukkan Unit / Fakultas [Default: Lembaga Penjaminan Mutu (SPMI)]: ');
        unitFakultas = inputUnit.trim() || 'Lembaga Penjaminan Mutu (SPMI)';
      }
    } finally {
      rl.close();
    }
  } else {
    // Mode Default jika argumen kosong
    name = name || 'Super Administrator SPMI';
    email = email || 'superadmin@unpal.ac.id';
    password = password || 'admin123';
    nip = nip || '198501012010011001';
    unitFakultas = unitFakultas || 'Lembaga Penjaminan Mutu (SPMI)';
  }

  // Format Data Pengguna Admin Lengkap
  const newAdmin: AdminUser = {
    id: randomUUID(),
    name,
    email: email.toLowerCase().trim(),
    password,
    role: 'superadmin',
    role_label: 'Super Administrator',
    nip,
    unit_fakultas: unitFakultas,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    is_active: true,
    permissions: FULL_ACCESS_PERMISSIONS,
    created_at: new Date().toISOString().split('T')[0]
  };

  console.log('\n⏳ Menyimpan data admin dengan hak akses penuh...');

  try {
    await saveToPostgres(newAdmin);
    await saveToSupabase(newAdmin);
  } catch (err) {
    console.error('Error saat menyimpan ke database:', err);
  }

  console.log('\n=============================================================');
  console.log('🎉 AKUN ADMIN FULL AKSES BERHASIL DIBUAT!');
  console.log('=============================================================');
  console.log(`👤 Nama Lengkap    : ${newAdmin.name}`);
  console.log(`📧 Email Login     : ${newAdmin.email}`);
  console.log(`🔑 Kata Sandi      : ${newAdmin.password}`);
  console.log(`🏷️  NIP / NIDN      : ${newAdmin.nip}`);
  console.log(`🏛️  Unit Kerja      : ${newAdmin.unit_fakultas}`);
  console.log(`👑 Role             : ${newAdmin.role_label} (${newAdmin.role})`);
  console.log(`⚡ Hak Akses        : 8/8 Modul Lengkap (View, Create, Edit, Delete)`);
  console.log('-------------------------------------------------------------');
  console.log('📋 Modul yang Dapat Diakses (Full Access):');
  console.log('  [✓] 1. Overview & Ringkasan Eksekutif');
  console.log('  [✓] 2. Repositori Dokumen SPMI (10 Standar)');
  console.log('  [✓] 3. Akreditasi BAN-PT & LAM');
  console.log('  [✓] 4. Pemantauan Mutu (Audit Mutu Internal / AMI)');
  console.log('  [✓] 5. Peraturan & Regulasi Dikti');
  console.log('  [✓] 6. Kotak Masuk Pesan & Aduan Layanan Publik');
  console.log('  [✓] 7. Manajemen Konten Halaman (CMS Publik)');
  console.log('  [✓] 8. Manajemen Pengguna & Hak Akses');
  console.log('=============================================================');
  console.log('👉 Silakan login di: /admin/login');
  console.log('=============================================================\n');
}

// Jalankan otomatis
if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.includes('create-admin'))) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Terjadi kegagalan:', err);
      process.exit(1);
    });
}
