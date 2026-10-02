/**
 * ==============================================================================
 * SCRIPT SEED DATABASE MYSQL - SPMI UNIVERSITAS PALEMBANG
 * ==============================================================================
 * Script ini digunakan untuk membuat seluruh tabel dan memasukkan (seed)
 * data aktif SPMI ke database MySQL (baik lokal XAMPP/MySQL maupun cPanel).
 *
 * CARA PENGGUNAAN:
 * 1. Pastikan variabel MySQL sudah diatur di .env.local atau .env:
 *    MYSQL_HOST=localhost
 *    MYSQL_PORT=3306
 *    MYSQL_USER=root
 *    MYSQL_PASSWORD=
 *    MYSQL_DATABASE=spmi_db
 *    (atau DATABASE_URL="mysql://root:@localhost:3306/spmi_db")
 *
 * 2. Jalankan perintah:
 *    node scripts/seed-mysql.mjs
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

async function runSeed() {
  console.log('🚀 Memulai inisialisasi skema dan seed data MySQL...');

  let mysql;
  try {
    mysql = await import('mysql2/promise');
  } catch (err) {
    console.error('\n❌ Module mysql2 belum terpasang.');
    console.error('Silakan jalankan perintah ini terlebih dahulu:');
    console.error('   npm install mysql2\n');
    process.exit(1);
  }

  const sqlPath = path.resolve('mysql-schema-and-seed.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ File SQL tidak ditemukan di: ${sqlPath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  // Konfigurasi koneksi
  const dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;
  let connectionConfig;

  if (dbUrl && dbUrl.startsWith('mysql://')) {
    const url = new URL(dbUrl);
    connectionConfig = {
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.replace(/^\//, ''),
      multipleStatements: true,
    };
  } else {
    connectionConfig = {
      host: process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'spmi_db',
      multipleStatements: true,
    };
  }

  console.log(`🔌 Menghubungkan ke database MySQL: ${connectionConfig.database} @ ${connectionConfig.host}:${connectionConfig.port} (user: ${connectionConfig.user})...`);

  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Berhasil terhubung ke server MySQL!');

    console.log('⏳ Sedang mengeksekusi DDL & Data Seed (9 Tabel)...');
    await connection.query(sqlContent);
    console.log('✅ Seluruh tabel dan data seed berhasil di-import ke MySQL!');

    // Verifikasi jumlah baris per tabel
    const tables = [
      'accreditations',
      'documents',
      'document_access_keys',
      'monitoring_data',
      'regulations',
      'contact_messages',
      'org_members',
      'pages_content',
      'users_admin'
    ];

    console.log('\n📊 HASIL VERIFIKASI DATA MYSQL:');
    console.log('--------------------------------------------------');
    for (const t of tables) {
      try {
        const [rows] = await connection.query(`SELECT COUNT(*) as count FROM \`${t}\``);
        console.log(`- Tabel \`${t.padEnd(22)}\`: ${(rows[0]).count} baris`);
      } catch (tableErr) {
        console.warn(`- Tabel \`${t.padEnd(22)}\`: ⚠️ Gagal memeriksa (${tableErr.message})`);
      }
    }
    console.log('--------------------------------------------------');

    await connection.end();
    console.log('🎉 Migrasi dan Seeding MySQL Selesai dengan Sukses!\n');
  } catch (error) {
    console.error('❌ Gagal melakukan koneksi atau import ke MySQL:', error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`💡 Tip: Buat database terlebih dahulu di phpMyAdmin atau terminal: CREATE DATABASE \`${connectionConfig.database}\`;`);
    }
    process.exit(1);
  }
}

runSeed();
