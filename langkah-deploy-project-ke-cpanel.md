# Panduan Lengkap Deploy Proyek SPMI UNPAL ke cPanel (Node.js & MySQL)

Panduan ini berisi langkah-langkah teknis secara mendetail, sistematis, dan teruji untuk mendeploy aplikasi **Next.js (SPMI Universitas Palembang)** ke hosting **cPanel** menggunakan database **MySQL / MariaDB**, penyimpanan file lokal (`public/uploads`), konfigurasi domain/SSL, serta manajemen proses Node.js.

---

## 📑 Daftar Isi
1. [Prasyarat Hosting cPanel](#1-prasyarat-hosting-cpanel)
2. [Konfigurasi Database MySQL di cPanel](#2-konfigurasi-database-mysql-di-cpanel)
3. [Import Skema & Data Seed ke MySQL cPanel](#3-import-skema--data-seed-ke-mysql-cpanel)
4. [Konfigurasi "Setup Node.js App" di cPanel](#4-konfigurasi-setup-nodejs-app-di-cpanel)
5. [Build dan Upload Berkas Proyek ke cPanel](#5-build-dan-upload-berkas-proyek-ke-cpanel)
6. [Konfigurasi File Manager & Direktori Upload](#6-konfigurasi-file-manager--direktori-upload)
7. [Konfigurasi Domain, SSL, dan .htaccess](#7-konfigurasi-domain-ssl-dan-htaccess)
8. [Panduan Maintenance & Troubleshooting](#8-panduan-maintenance--troubleshooting)

---

## 1. Prasyarat Hosting cPanel

Pastikan akun hosting cPanel Anda memiliki fitur-fitur berikut:
- **Setup Node.js App** (CloudLinux / cPanel Application Manager) dengan versi Node.js **20.x** (atau minimal 18.x).
- **MySQL Databases** & **phpMyAdmin**.
- **File Manager** (atau akses Terminal / SSH / FTP).
- **SSL / TLS** (AutoSSL / Let's Encrypt).

---

## 2. Konfigurasi Database MySQL di cPanel

### Langkah 2.1: Membuat Database & User MySQL
1. Login ke **cPanel**.
2. Masuk ke menu **MySQL Databases** (atau **MySQL Database Wizard**).
3. **Buat Database Baru**:
   - Masukkan nama database, contoh: `spmi` (nama lengkap otomatis menjadi `usernamecpanel_spmi`).
4. **Buat User Database**:
   - Masukkan nama user, contoh: `spmi_user` (nama lengkap menjadi `usernamecpanel_spmi_user`).
   - Buat password yang kuat dan catat (contoh: `P@ssw0rdSpmi2026!`).
5. **Hubungkan User ke Database**:
   - Pilih User dan Database yang baru dibuat, klik **Add**.
   - Centang **ALL PRIVILEGES** lalu klik **Make Changes**.

### Langkah 2.2: Catat Parameter Koneksi Database
- **Host**: `localhost` atau `127.0.0.1` (karena web app & DB berada di server cPanel yang sama).
- **Port**: `3306`
- **Database Name**: `usernamecpanel_spmi`
- **User**: `usernamecpanel_spmi_user`
- **Password**: `P@ssw0rdSpmi2026!`

Format Connection String URL:
```text
DATABASE_URL="mysql://usernamecpanel_spmi_user:P@ssw0rdSpmi2026!@localhost:3306/usernamecpanel_spmi"
```

---

## 3. Import Skema & Data Seed ke MySQL cPanel

Tersedia file SQL yang memuat seluruh DDL (9 tabel) dan data riil: **`mysql-schema-and-seed.sql`**.

### Cara 1: Import via phpMyAdmin (Paling Mudah)
1. Di cPanel, buka menu **phpMyAdmin**.
2. Pada panel sebelah kiri, klik nama database Anda (contoh: `usernamecpanel_spmi`).
3. Klik tab **Import** di menu bagian atas.
4. Klik tombol **Choose File** / **Pilih Berkas**, lalu pilih file **`mysql-schema-and-seed.sql`** dari komputer Anda.
5. Gulir ke bawah dan klik tombol **Import** (atau **Kirim / Go**).
6. Tunggu hingga muncul notifikasi hijau bertuliskan *"Import has been successfully finished"*.
7. Pastikan seluruh 9 tabel (`accreditations`, `documents`, `document_access_keys`, `monitoring_data`, `regulations`, `contact_messages`, `org_members`, `pages_content`, `users_admin`) telah terisi.

### Cara 2: Menjalankan via Terminal / SSH cPanel
Jika Anda memiliki akses Terminal cPanel:
```bash
mysql -u usernamecpanel_spmi_user -p usernamecpanel_spmi < mysql-schema-and-seed.sql
```

---

## 4. Konfigurasi "Setup Node.js App" di cPanel

1. Di cPanel, cari dan klik menu **Setup Node.js App**.
2. Klik tombol **Create Application**.
3. Isi formulir konfigurasi berikut:
   - **Node.js version**: Pilih `20.x` (disarankan).
   - **Application mode**: `Production`
   - **Application root**: `spmi-app` (folder tempat source code berada di home direktori `/home/username/spmi-app`).
   - **Application URL**: Pilih domain atau subdomain Anda (misal: `spmi.unpal.ac.id`).
   - **Application startup file**: `server.js` (file ini sudah tersedia di root proyek).
4. **Environment Variables**:
   Tambahkan variabel lingkungan berikut di bagian **Environment variables** (atau gunakan file `.env`):
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `MYSQL_HOST` = `localhost`
   - `MYSQL_PORT` = `3306`
   - `MYSQL_USER` = `usernamecpanel_spmi_user`
   - `MYSQL_PASSWORD` = `P@ssw0rdSpmi2026!`
   - `MYSQL_DATABASE` = `usernamecpanel_spmi`
   - `DATABASE_URL` = `mysql://usernamecpanel_spmi_user:P@ssw0rdSpmi2026!@localhost:3306/usernamecpanel_spmi`
   - `NEXT_PUBLIC_APP_URL` = `https://spmi.unpal.ac.id`
5. Klik **Create** di pojok kanan atas.
6. Catat baris perintah virtual environment yang muncul di bagian atas halaman (contoh: `source /home/username/nodevenv/spmi-app/20/bin/activate && cd /home/username/spmi-app`).

---

## 5. Build dan Upload Berkas Proyek ke cPanel

Proyek telah dioptimalkan dengan Next.js mode **standalone** dan startup script `server.js`.

### Langkah 5.1: Build & Kemas Otomatis (1-Click Packaging)
Kami telah menyediakan perintah otomatis untuk mem-build dan mengompres berkas-berkas esensial menjadi zip siap upload:
```bash
npm run package:cpanel
```
Perintah ini otomatis menghasilkan berkas:
👉 **`spmi-cpanel-ready.zip`** di folder root proyek (ukuran ~108 MB, sudah mencakup seluruh berkas dokumen & gambar di `public/uploads`, skema SQL, serta build `.next` yang telah dibersihkan dari cache).

### Langkah 5.2: Upload & Ekstrak di cPanel
1. Buka **File Manager** cPanel.
2. Masuk ke direktori aplikasi Anda: `/home/username/spmi-app/`.
3. Klik tombol **Upload** di bagian atas, lalu pilih file **`spmi-cpanel-ready.zip`**.
4. Setelah selesai diupload, klik kanan berkas `spmi-cpanel-ready.zip` di cPanel File Manager lalu pilih **Extract**.
5. Salin isi berkas `.env.cpanel` menjadi file bernama `.env` di folder `/home/username/spmi-app/`, lalu sesuaikan kredensial database cPanel Anda.

Struktur berkas di cPanel Anda akan menjadi seperti berikut:
```text
/home/username/spmi-app/
├── .next/
├── public/
│   └── uploads/             <-- Seluruh dokumen & gambar PDF/PNG lokal
├── src/                     <-- Source code aplikasi
├── package.json
├── package-lock.json
├── next.config.js
├── server.js                <-- Startup file resmi cPanel
├── .htaccess                <-- File reverse proxy cPanel
└── .env                     <-- Salinan konfigurasi dari .env.cpanel
```

### Langkah 5.3: Instalasi Dependensi di cPanel
1. Buka menu **Setup Node.js App** di cPanel.
2. Klik nama aplikasi Anda.
3. Klik tombol **Run NPM Install** (atau buka menu **Terminal** cPanel dan jalankan `npm install --omit=dev`).
4. Klik tombol **Restart Application**.

---

## 6. Konfigurasi File Manager & Direktori Upload

Aplikasi SPMI UNPAL menyimpan berkas secara lokal di folder `public/uploads/`.
1. Pastikan folder `/home/username/spmi-app/public/uploads` memiliki permission **755** agar file dapat dibaca oleh publik dan ditulis oleh aplikasi Node.js.
2. File pengaman `public/uploads/.htaccess` telah otomatis melindungi direktori ini dari eksekusi script berbahaya (`.php`, `.exe`).

---

## 7. Konfigurasi Domain, SSL, dan .htaccess

Pastikan file `.htaccess` di root direktori domain Anda (atau di `public_html`) memiliki konfigurasi reverse proxy:

```apache
# =========================================================
# HTACCESS REVERSE PROXY NEXT.JS CPANEL
# =========================================================

RewriteEngine On

# 1. Paksa Redirect HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Reverse Proxy ke Aplikasi Node.js Port 3000
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]

# 3. Header Keamanan
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
```

Pastikan SSL (Let's Encrypt / AutoSSL) aktif pada domain/subdomain Anda melalui menu **SSL/TLS Status** di cPanel.

---

## 8. Panduan Maintenance & Troubleshooting

| Gejala Error | Kemungkinan Penyebab | Solusi |
|:---|:---|:---|
| **503 Service Unavailable** | Node.js app belum berjalan / crash | Buka menu *Setup Node.js App* -> klik *Restart Application*. Periksa log error di menu terminal. |
| **500 Internal Server Error** | Kredensial MySQL salah atau port DB terblokir | Pastikan user database memiliki ALL PRIVILEGES pada database, cek kecocokan password di `.env`. |
| **File PDF / Gambar 404** | Folder `public/uploads` belum ter-copy | Pastikan folder `public/uploads` dan seluruh subfoldernya sudah diekstrak ke cPanel. |
| **Gagal Login Admin** | Akun belum masuk ke database | Pastikan file `mysql-schema-and-seed.sql` sudah di-import lengkap ke MySQL phpMyAdmin. |
| **Perubahan Kode Tidak Tampil** | Cache Next.js / Server belum direstart | Jalankan `npm run build` ulang, lalu klik *Restart* di menu *Setup Node.js App*. |
