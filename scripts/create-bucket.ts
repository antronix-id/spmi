/**
 * ============================================================================
 * SCRIPT SUPABASE STORAGE: CREATE BUCKET & SYNC UPLOADS
 * ============================================================================
 * File ini digunakan untuk:
 * 1. Membuat Storage Bucket 'spmi-files' di Supabase (Public Access).
 * 2. Mengunggah seluruh file dokumen & gambar dari folder local 'public/uploads'
 *    ke bucket Supabase Storage agar tetap aktif dan dapat diakses di Vercel / Production.
 *
 * CARA MENJALANKAN:
 * 1. Di Terminal:
 *    npx tsx scripts/create-bucket.ts
 *    atau:
 *    npm run storage:sync
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load Environment Variables (.env.local, .env.vercel, & .env)
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.vercel' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const BUCKET_NAME = 'spmi-files';

// MIME Types Mapping
const MIME_MAP: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.zip': 'application/zip'
};

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_MAP[ext] || 'application/octet-stream';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function main() {
  console.log('\n=============================================================');
  console.log('🪣 SUPABASE STORAGE: CREATE BUCKET & SYNC FILE UPLOADS');
  console.log('=============================================================\n');

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan pada .env/.env.local/.env.vercel.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // ---------------------------------------------------------------------------
  // LANGKAH 1: MEMERIKSA & MEMBUAT STORAGE BUCKET
  // ---------------------------------------------------------------------------
  console.log(`📡 Memeriksa status bucket "${BUCKET_NAME}" di Supabase...`);

  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.warn('⚠️  Peringatan saat memeriksa bucket:', listError.message);
    }

    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

    if (!bucketExists) {
      console.log(`📦 Bucket "${BUCKET_NAME}" belum ada. Membuat bucket baru...`);
      const { data: newBucket, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 52428800 // 50 MB
      });

      if (createError) {
        console.error(`❌ Gagal membuat bucket "${BUCKET_NAME}":`, createError.message);
        console.log('ℹ️  Tips: Pastikan SUPABASE_SERVICE_ROLE_KEY memiliki izin admin storage.');
      } else {
        console.log(`✅ Bucket "${BUCKET_NAME}" berhasil dibuat dengan status: PUBLIC (50MB Max).`);
      }
    } else {
      console.log(`✅ Bucket "${BUCKET_NAME}" sudah ada dan aktif.`);
      
      // Update bucket agar pasti berstatus Public
      await supabase.storage.updateBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 52428800
      }).catch(() => {});
    }
  } catch (err: any) {
    console.error('❌ Terjadi kesalahan koneksi Supabase Storage:', err.message || err);
  }

  // ---------------------------------------------------------------------------
  // LANGKAH 2: MEMBACA SELURUH FILE DI PUBLIC/UPLOADS
  // ---------------------------------------------------------------------------
  const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(uploadsDir)) {
    console.log(`⚠️ Folder "${uploadsDir}" tidak ditemukan. Membuat folder...`);
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Folder dibuat (kosong).');
    return;
  }

  const files = fs.readdirSync(uploadsDir).filter(file => {
    return fs.statSync(path.join(uploadsDir, file)).isFile();
  });

  if (files.length === 0) {
    console.log('\nℹ️  Folder public/uploads kosong. Tidak ada file yang perlu disinkronkan.');
    return;
  }

  console.log(`\n📂 Ditemukan ${files.length} file di folder "public/uploads/".`);
  console.log('⏳ Memulai sinkronisasi / upload file ke Supabase Storage...\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(uploadsDir, fileName);
    const fileStats = fs.statSync(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getMimeType(filePath);

    const storagePath = `uploads/${fileName}`; // Path di dalam bucket

    try {
      // Upload ke bucket 'spmi-files' dengan upsert: true
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType,
          cacheControl: '3600',
          upsert: true
        });

      // Juga upload ke root bucket untuk kompatibilitas tautan langsung
      await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
          contentType,
          cacheControl: '3600',
          upsert: true
        }).catch(() => {});

      if (error) {
        console.error(`❌ [${i + 1}/${files.length}] Gagal: ${fileName} - ${error.message}`);
        failCount++;
      } else {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(storagePath);

        console.log(`✅ [${i + 1}/${files.length}] Berhasil: ${fileName} (${formatBytes(fileStats.size)})`);
        console.log(`   🔗 URL Publik: ${publicUrlData.publicUrl}`);
        successCount++;
      }
    } catch (uploadErr: any) {
      console.error(`❌ [${i + 1}/${files.length}] Error: ${fileName} -`, uploadErr.message || uploadErr);
      failCount++;
    }
  }

  console.log('\n=============================================================');
  console.log('🎉 SINKRONISASI BUCKET & FILE SUPABASE SELESAI');
  console.log('=============================================================');
  console.log(`📦 Nama Bucket       : ${BUCKET_NAME} (Public)`);
  console.log(`✅ Berhasil Diunggah : ${successCount} file`);
  if (failCount > 0) {
    console.log(`❌ Gagal Diunggah    : ${failCount} file`);
  }
  console.log('=============================================================');
  console.log('💡 File-file ini sekarang aman & dapat diakses publik saat');
  console.log('   website di-deploy ke Vercel!');
  console.log('=============================================================\n');
}

// Auto-run if executed directly
if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.includes('create-bucket'))) {
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}
