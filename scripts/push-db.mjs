import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const { Client } = pg;

const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Connecting to PostgreSQL database:', databaseUrl ? 'URL Present' : 'MISSING');

async function main() {
  if (!databaseUrl) {
    console.error('DATABASE_URL is missing in .env.local');
    process.exit(1);
  }

  // 1. Connect to PostgreSQL
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Successfully connected to Supabase PostgreSQL database!');

    // 2. Read seed.sql
    const sqlPath = path.resolve('supabase', 'seed.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing database schema and seed SQL...');
    await client.query(sqlContent);
    console.log('Schema & seed SQL executed successfully!');

    // 3. Verify row counts in tables
    const tables = [
      'accreditations',
      'documents',
      'monitoring_data',
      'regulations',
      'contact_messages',
      'users_admin',
      'pages_content'
    ];

    console.log('\n--- VERIFIKASI TABEL & JUMLAH DATA ---');
    for (const table of tables) {
      try {
        const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`- Tabel "${table}": ${res.rows[0].count} baris`);
      } catch (err) {
        console.error(`- Gagal memeriksa tabel "${table}":`, err.message);
      }
    }

    // 4. Ensure Storage Bucket exists using Supabase JS client
    if (supabaseUrl && serviceRoleKey) {
      console.log('\n--- MEMERIKSA SUPABASE STORAGE BUCKET ---');
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
      
      const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
      if (!listError) {
        const exists = buckets.some(b => b.name === 'spmi-files');
        if (!exists) {
          console.log('Membuat bucket storage "spmi-files"...');
          const { error: createError } = await supabaseAdmin.storage.createBucket('spmi-files', {
            public: true,
            fileSizeLimit: 52428800 // 50MB
          });
          if (!createError) {
            console.log('Bucket "spmi-files" berhasil dibuat dan diset Public!');
          } else {
            console.warn('Peringatan saat membuat bucket:', createError.message);
          }
        } else {
          console.log('Bucket storage "spmi-files" sudah ada (Aktif).');
        }
      } else {
        console.warn('Gagal membaca daftar bucket:', listError.message);
      }
    }

    console.log('\n Semua tabel dan data seed berhasil dipush ke Supabase Anda!');
  } catch (error) {
    console.error('Terjadi error saat push database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
