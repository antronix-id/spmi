/**
 * ==============================================================================
 * DIRECT REMOTE MYSQL PUSH SCRIPT - CPANEL SERVER
 * ==============================================================================
 * Menjalankan push skema dan seluruh data ke server cPanel MySQL langsung.
 * ==============================================================================
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const host = process.argv[2] || process.env.CPANEL_MYSQL_HOST || '103.247.10.56';
const port = Number(process.env.CPANEL_MYSQL_PORT) || 3306;
const user = 'unpx1994_jemiarian';
const password = 'Spmiunpal!23.';
const database = 'unpx1994_spmi-unpal';

console.log('====================================================');
console.log('🚀 PUSH DATA LANGSUNG KE CPANEL MYSQL SERVER');
console.log('====================================================');
console.log(`🌐 Target Host    : ${host}:${port}`);
console.log(`👤 Target User    : ${user}`);
console.log(`🗄️ Target Database: ${database}`);
console.log('----------------------------------------------------');

async function push() {
  const sqlPath = path.resolve('mysql-schema-and-seed.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ File SQL tidak ditemukan di: ${sqlPath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  console.log(`📡 Menghubungkan ke ${host}:${port}...`);
  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      multipleStatements: true,
      connectTimeout: 8000
    });
    console.log('✅ Berhasil terhubung ke database server!');
  } catch (err) {
    console.error('\n❌ Gagal terhubung ke MySQL server:', err.message);
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
      console.log('\n💡 CATATAN PENTING CPANEL:');
      console.log('Port 3306 pada cPanel diblokir oleh firewall hosting untuk koneksi eksternal.');
      console.log('Untuk mengizinkan koneksi langsung dari komputer Anda:');
      console.log('1. Buka cPanel -> menu "Remote MySQL" (atau "MySQL Jarak Jauh").');
      console.log('2. Pada kolom "Host (% wildcard is allowed)", masukkan tanda "%" (tanpa tanda kutip) atau IP publik Anda.');
      console.log('3. Klik tombol "Add Host".');
      console.log('4. Jalankan kembali perintah ini: node scripts/push-to-cpanel-db.mjs\n');
    }
    process.exit(1);
  }

  try {
    console.log('⏳ Mengirimkan seluruh skema tabel (9 tabel) dan data seed...');
    await connection.query(sqlContent);
    console.log('🎉 PUSH SELESAI DENGAN SUKSES!');
    
    // Verifikasi jumlah data
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`\n📋 Daftar tabel yang terisi di ${database}:`);
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [countResult] = await connection.query(`SELECT COUNT(*) as cnt FROM \`${tableName}\``);
      console.log(`   - ${tableName.padEnd(25)} : ${countResult[0].cnt} baris`);
    }
    
    console.log('\n✅ Seluruh tabel dan data telah aktif di cPanel phpMyAdmin!');
  } catch (err) {
    console.error('❌ Gagal mengeksekusi SQL:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

push();
