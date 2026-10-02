import fs from 'fs';
import path from 'path';

const folders = [
  'public/uploads/documents/kebijakan',
  'public/uploads/documents/manual',
  'public/uploads/documents/standar',
  'public/uploads/documents/formulir',
  'public/uploads/documents/ami',
  'public/uploads/documents/rtm',
  'public/uploads/accreditations/prodi',
  'public/uploads/accreditations/institusi',
  'public/uploads/regulations/sk-rektor',
  'public/uploads/regulations/permendikbud',
  'public/uploads/regulations/banpt-lam',
  'public/uploads/images/members',
  'public/uploads/images/banners',
  'public/uploads/images/content',
  'public/uploads/messages'
];

console.log('🚀 Membentuk struktur direktori penyimpanan upload...');

folders.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Direktori dibuat: ${dir}`);
  } else {
    console.log(`ℹ️ Direktori sudah ada: ${dir}`);
  }
});

// Buat file .htaccess pengaman di public/uploads
const htaccessPath = path.resolve('public/uploads/.htaccess');
const htaccessContent = `# Mencegah eksekusi script PHP atau executable di folder uploads
<FilesMatch "\\.(php|php3|php4|php5|phtml|pl|py|jsp|asp|sh|cgi)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>
Options -Indexes
`;

fs.writeFileSync(htaccessPath, htaccessContent, 'utf-8');
console.log('🛡️ File pengaman .htaccess berhasil dibuat di public/uploads/.htaccess');

console.log('\n🎉 Seluruh direktori upload fisik berhasil disiapkan!');
