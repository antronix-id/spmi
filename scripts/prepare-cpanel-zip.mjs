import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const OUTPUT_ZIP = path.join(ROOT_DIR, 'spmi-cpanel-ready.zip');

console.log('====================================================');
console.log('📦 SPMI UNPAL - CPANEL DEPLOYMENT PACKAGER');
console.log('====================================================\n');

// 1. Check build
if (!fs.existsSync(path.join(ROOT_DIR, '.next'))) {
  console.log('⚙️ Direktori .next belum ditemukan, menjalankan build...');
  execSync('npm run build', { stdio: 'inherit' });
} else {
  console.log('✅ Direktori .next ditemukan.');
}

// Clean dev cache & webpack cache to keep zip lightweight
const devCache = path.join(ROOT_DIR, '.next', 'dev');
const webpackCache = path.join(ROOT_DIR, '.next', 'cache');
if (fs.existsSync(devCache)) {
  console.log('🧹 Membersihkan .next/dev cache lokal...');
  fs.rmSync(devCache, { recursive: true, force: true });
}
if (fs.existsSync(webpackCache)) {
  console.log('🧹 Membersihkan .next/cache lokal...');
  fs.rmSync(webpackCache, { recursive: true, force: true });
}

// 2. Remove old zip if exists
if (fs.existsSync(OUTPUT_ZIP)) {
  fs.unlinkSync(OUTPUT_ZIP);
  console.log('🗑️ File zip lama dihapus.');
}

// 3. Temporary list of items to archive
const itemsToInclude = [
  '.next',
  'public',
  'src',
  'package.json',
  'package-lock.json',
  'next.config.js',
  'postcss.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'server.js',
  '.htaccess',
  '.env.cpanel',
  'mysql-schema-and-seed.sql',
  'langkah-deploy-project-ke-cpanel.md'
];

console.log('📁 Mengompres berkas-berkas esensial ke spmi-cpanel-ready.zip...');

try {
  // Use tar -a to create zip, excluding cache folder
  const excludeFlag = '--exclude=".next/cache"';
  const itemsArg = itemsToInclude.join(' ');
  const cmd = `tar -a -c ${excludeFlag} -f "${OUTPUT_ZIP}" ${itemsArg}`;
  
  execSync(cmd, { stdio: 'inherit' });

  if (fs.existsSync(OUTPUT_ZIP)) {
    const stats = fs.statSync(OUTPUT_ZIP);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n🎉 SUKSES! File zip siap diupload ke cPanel:`);
    console.log(`   Lokasi: ${OUTPUT_ZIP}`);
    console.log(`   Ukuran: ${sizeMB} MB`);
    console.log('\nLangkah selanjutnya:');
    console.log('1. Upload spmi-cpanel-ready.zip ke /home/username/spmi-app di cPanel.');
    console.log('2. Ekstrak file zip tersebut di cPanel File Manager.');
    console.log('3. Import mysql-schema-and-seed.sql ke phpMyAdmin.');
    console.log('4. Ikuti panduan lengkap di langkah-deploy-project-ke-cpanel.md');
  }
} catch (error) {
  console.error('❌ Gagal membuat zip dengan tar:', error.message);
}
