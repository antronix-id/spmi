import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function pushToDb() {
  console.log('🚀 Menghubungkan ke database MySQL: spmi-unpal...');
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'spmi-unpal',
      multipleStatements: true
    });

    console.log('✅ Berhasil terhubung ke database `spmi-unpal`!');
    const sql = fs.readFileSync(path.resolve('mysql-schema-and-seed.sql'), 'utf-8');
    
    console.log('⏳ Sedang mengeksekusi DDL & Data Seed ke `spmi-unpal`...');
    await conn.query(sql);
    console.log('✅ Seluruh tabel dan data seed berhasil di-push!');

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

    console.log('\n📊 HASIL VERIFIKASI DATA DI DATABASE `spmi-unpal`:');
    console.log('==================================================');
    for (const t of tables) {
      const [res] = await conn.query(`SELECT count(*) as count FROM \`${t}\``);
      console.log(`- Tabel ${t.padEnd(22)}: ${(res)[0].count} baris`);
    }
    console.log('==================================================');

    await conn.end();
    console.log('🎉 Data berhasil di-push ke database `spmi-unpal`!\n');
  } catch (err) {
    console.error('❌ Gagal push ke database `spmi-unpal`:', err.message);
  }
}

pushToDb();
