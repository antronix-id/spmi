import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import mysql from 'mysql2/promise';

dotenv.config({ path: '.env.local' });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Supabase URL atau Service Role Key tidak ditemukan pada .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// Pastikan semua folder lokal fisik sudah ada
const localFolders = [
  'public/uploads',
  'public/uploads/documents',
  'public/uploads/accreditations',
  'public/uploads/regulations',
  'public/uploads/images/members',
  'public/uploads/images/banners',
  'public/uploads/images/content',
  'public/uploads/messages'
];

localFolders.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

async function downloadFile(url, targetPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ⚠️ Gagal mengunduh URL (${res.status}): ${url}`);
      return false;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, buffer);
    return true;
  } catch (err) {
    console.warn(`  ⚠️ Error saat mengunduh file dari ${url}:`, err.message);
    return false;
  }
}

async function listFilesRecursively(subfolder = '') {
  let allFiles = [];
  const { data, error } = await supabase.storage.from('spmi-files').list(subfolder, { limit: 100 });

  if (error || !data) {
    console.warn(`Gagal membaca folder "${subfolder}":`, error?.message);
    return allFiles;
  }

  for (const item of data) {
    const itemPath = subfolder ? `${subfolder}/${item.name}` : item.name;
    if (item.id) {
      // Ini adalah file
      allFiles.push(itemPath);
    } else {
      // Ini adalah direktori, lakukan rekursi
      const subFiles = await listFilesRecursively(itemPath);
      allFiles = allFiles.concat(subFiles);
    }
  }

  return allFiles;
}

async function main() {
  console.log('🚀 Memulai proses pengunduhan seluruh berkas dari Supabase Storage ke lokal...');

  // 1. Dapatkan semua file di bucket spmi-files
  const storageFiles = await listFilesRecursively('');
  console.log(`📦 Ditemukan ${storageFiles.length} file di Supabase Storage:`);

  const urlMap = new Map(); // Simpan pemetaan URL Supabase -> URL Lokal /uploads/...

  for (const relativePath of storageFiles) {
    const { data: publicUrlData } = supabase.storage.from('spmi-files').getPublicUrl(relativePath);
    const supabasePublicUrl = publicUrlData.publicUrl;

    // Tentukan direktori penyimpanan lokal berdasarkan path
    let localSubDir = 'documents';
    if (relativePath.startsWith('documents/')) {
      localSubDir = 'documents';
    } else if (relativePath.startsWith('uploads/')) {
      const fileName = relativePath.replace('uploads/', '');
      if (fileName.includes('sertifikat') || fileName.includes('akreditasi')) {
        localSubDir = 'accreditations';
      } else if (fileName.includes('peraturan') || fileName.includes('permendikbud') || fileName.includes('sk')) {
        localSubDir = 'regulations';
      } else if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.webp')) {
        localSubDir = 'images/content';
      } else {
        localSubDir = 'documents';
      }
    }

    const filename = path.basename(relativePath);
    const localRelativeUrl = `/uploads/${localSubDir}/${filename}`;
    const localPhysicalPath = path.resolve('public', 'uploads', localSubDir, filename);

    console.log(`⬇️ Mengunduh: ${relativePath} -> public/uploads/${localSubDir}/${filename}`);
    
    // Gunakan download langsung dari SDK Supabase
    const { data: fileData, error: downloadError } = await supabase.storage.from('spmi-files').download(relativePath);
    if (!downloadError && fileData) {
      const buffer = Buffer.from(await fileData.arrayBuffer());
      fs.writeFileSync(localPhysicalPath, buffer);
      console.log(`  ✅ Berhasil disimpan (${(buffer.length / 1024).toFixed(1)} KB)`);
      urlMap.set(supabasePublicUrl, localRelativeUrl);
    } else {
      console.warn(`  ⚠️ Gagal download via SDK, mencoba HTTP fetch...`);
      const ok = await downloadFile(supabasePublicUrl, localPhysicalPath);
      if (ok) urlMap.set(supabasePublicUrl, localRelativeUrl);
    }
  }

  // 2. Baca database MySQL spmi-unpal dan unduh file apa pun yang belum terunduh, lalu perbarui URL di database
  console.log('\n🔄 Membaca database MySQL `spmi-unpal` untuk memverifikasi URL file...');
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'spmi-unpal'
  });

  // A. Tabel documents
  const [docs] = await conn.query('SELECT id, file_url FROM documents');
  for (const doc of docs) {
    if (doc.file_url && doc.file_url.includes('supabase.co')) {
      const filename = path.basename(new URL(doc.file_url).pathname);
      const localUrl = `/uploads/documents/${filename}`;
      const localPath = path.resolve('public', 'uploads', 'documents', filename);

      if (!fs.existsSync(localPath)) {
        console.log(`⬇️ Mengunduh dokumen DB: ${filename}`);
        await downloadFile(doc.file_url, localPath);
      }
      await conn.query('UPDATE documents SET file_url = ? WHERE id = ?', [localUrl, doc.id]);
      urlMap.set(doc.file_url, localUrl);
    }
  }

  // B. Tabel accreditations
  const [accs] = await conn.query('SELECT id, certificate_url FROM accreditations');
  for (const acc of accs) {
    if (acc.certificate_url && acc.certificate_url.includes('supabase.co')) {
      const filename = path.basename(new URL(acc.certificate_url).pathname);
      const localUrl = `/uploads/accreditations/${filename}`;
      const localPath = path.resolve('public', 'uploads', 'accreditations', filename);

      if (!fs.existsSync(localPath)) {
        console.log(`⬇️ Mengunduh sertifikat akreditasi DB: ${filename}`);
        await downloadFile(acc.certificate_url, localPath);
      }
      await conn.query('UPDATE accreditations SET certificate_url = ? WHERE id = ?', [localUrl, acc.id]);
      urlMap.set(acc.certificate_url, localUrl);
    }
  }

  // C. Tabel regulations
  const [regs] = await conn.query('SELECT id, file_url FROM regulations');
  for (const reg of regs) {
    if (reg.file_url && reg.file_url.includes('supabase.co')) {
      const filename = path.basename(new URL(reg.file_url).pathname);
      const localUrl = `/uploads/regulations/${filename}`;
      const localPath = path.resolve('public', 'uploads', 'regulations', filename);

      if (!fs.existsSync(localPath)) {
        console.log(`⬇️ Mengunduh peraturan DB: ${filename}`);
        await downloadFile(reg.file_url, localPath);
      }
      await conn.query('UPDATE regulations SET file_url = ? WHERE id = ?', [localUrl, reg.id]);
      urlMap.set(reg.file_url, localUrl);
    }
  }

  // D. Tabel org_members
  const [orgs] = await conn.query('SELECT id, photo_url FROM org_members');
  for (const org of orgs) {
    if (org.photo_url && org.photo_url.includes('supabase.co')) {
      const filename = path.basename(new URL(org.photo_url).pathname);
      const localUrl = `/uploads/images/members/${filename}`;
      const localPath = path.resolve('public', 'uploads', 'images', 'members', filename);

      if (!fs.existsSync(localPath)) {
        console.log(`⬇️ Mengunduh foto pengurus DB: ${filename}`);
        await downloadFile(org.photo_url, localPath);
      }
      await conn.query('UPDATE org_members SET photo_url = ? WHERE id = ?', [localUrl, org.id]);
      urlMap.set(org.photo_url, localUrl);
    }
  }

  // E. Tabel pages_content
  const [pages] = await conn.query('SELECT id, content FROM pages_content');
  for (const page of pages) {
    let contentStr = typeof page.content === 'object' ? JSON.stringify(page.content) : page.content;
    let modified = false;

    // Cari URL Supabase di dalam JSON content
    const matches = contentStr.match(/https:\/\/[^"\s]+\.supabase\.co\/storage\/v1\/object\/public\/spmi-files\/[^"\s]+/g);
    if (matches) {
      for (const sbUrl of matches) {
        const filename = path.basename(new URL(sbUrl).pathname);
        const localUrl = `/uploads/images/banners/${filename}`;
        const localPath = path.resolve('public', 'uploads', 'images', 'banners', filename);

        if (!fs.existsSync(localPath)) {
          console.log(`⬇️ Mengunduh gambar slider/banner DB: ${filename}`);
          await downloadFile(sbUrl, localPath);
        }
        contentStr = contentStr.replace(new RegExp(sbUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), localUrl);
        modified = true;
      }
    }

    if (modified) {
      const updatedContent = JSON.parse(contentStr);
      await conn.query('UPDATE pages_content SET content = ? WHERE id = ?', [JSON.stringify(updatedContent), page.id]);
      console.log(`✅ URL gambar pada halaman \`${page.id}\` berhasil diubah ke folder lokal.`);
    }
  }

  await conn.end();

  console.log('\n🎉 PROSES PENGUNDUHAN DAN PERBAIKAN URL SELESAI!');
  console.log('--------------------------------------------------');
  console.log(`- Seluruh berkas telah tersimpan fisik di \`public/uploads/\``);
  console.log(`- Seluruh URL database \`spmi-unpal\` kini menggunakan \`/uploads/...\` (Lokal Disk)\n`);
}

main();
