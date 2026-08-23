# Panduan Lengkap Deploy Proyek SPMI UNPAL ke cPanel (Node.js & PostgreSQL)

Panduan ini berisi langkah-langkah teknis secara mendetail, sistematis, dan teruji untuk mendeploy aplikasi **Next.js (SPMI Universitas Palembang)** ke hosting **cPanel** menggunakan database **PostgreSQL**, konfigurasi domain/SSL, akses SSH, serta otomatisasi **CI/CD (GitHub Actions)**.

---

## 📑 Daftar Isi
1. [Prasyarat Hosting cPanel](#1-prasyarat-hosting-cpanel)
2. [Konfigurasi Database PostgreSQL di cPanel](#2-konfigurasi-database-postgresql-di-cpanel)
3. [Inisialisasi Skema & Data Database (Auto Push)](#3-inisialisasi-skema--data-database-auto-push)
4. [Konfigurasi "Setup Node.js App" di cPanel](#4-konfigurasi-setup-nodejs-app-di-cpanel)
5. [Build dan Upload Proyek ke cPanel](#5-build-dan-upload-proyek-ke-cpanel)
6. [Konfigurasi Domain, SSL, dan .htaccess](#6-konfigurasi-domain-ssl-dan-htaccess)
7. [Otomatisasi CI/CD dengan GitHub Actions (Auto Deploy)](#7-otomatisasi-cicd-dengan-github-actions-auto-deploy)
8. [Panduan Maintenance & Troubleshooting](#8-panduan-maintenance--troubleshooting)

---

## 1. Prasyarat Hosting cPanel

Pastikan akun hosting cPanel Anda memiliki fitur-fitur berikut:
- **Setup Node.js App** (CloudLinux / cPanel Application Manager) dengan versi Node.js **20.x** atau **18.x**.
- **PostgreSQL Databases** & **phpPgAdmin**.
- **Terminal** atau **SSH Access** aktif.
- **SSL / TLS** (AutoSSL / Let's Encrypt).

---

## 2. Konfigurasi Database PostgreSQL di cPanel

### Langkah 2.1: Membuat Database & User PostgreSQL
1. Login ke **cPanel**.
2. Masuk ke menu **PostgreSQL Databases** (atau **PostgreSQL Database Wizard**).
3. **Buat Database Baru**:
   - Masukkan nama database, contoh: `spmi_db` (nama lengkap menjadi `usernamecpanel_spmi_db`).
4. **Buat User Database**:
   - Masukkan nama user, contoh: `spmi_user` (nama lengkap menjadi `usernamecpanel_spmi_user`).
   - Buat password yang kuat dan catat (contoh: `P@ssw0rdSpmi2026!`).
5. **Hubungkan User ke Database**:
   - Pilih User dan Database yang baru dibuat, klik **Add**.
   - Centang **ALL PRIVILEGES** lalu klik **Make Changes**.

### Langkah 2.2: Catat Parameter Koneksi Database
- **Host**: `localhost` atau `127.0.0.1` (karena web app & DB berada di server cPanel yang sama).
- **Port**: `5432`
- **Database Name**: `usernamecpanel_spmi_db`
- **User**: `usernamecpanel_spmi_user`
- **Password**: `P@ssw0rdSpmi2026!`

Format Connection String URL:
```text
DATABASE_URL="postgresql://usernamecpanel_spmi_user:P@ssw0rdSpmi2026!@localhost:5432/usernamecpanel_spmi_db"
```

---

## 3. Inisialisasi Skema & Data Database (Auto Push)

Anda tidak perlu membuat tabel satu per satu secara manual. File `src/lib/skema_database.ts` telah disiapkan untuk membuat 8 tabel sekaligus dan langsung mengunggah data aktif dari Supabase.

### Cara 1: Menjalankan via Terminal / SSH cPanel (Direkomendasikan)
1. Buka menu **Terminal** di cPanel.
2. Masuk ke direktori proyek aplikasi Anda:
   ```bash
   cd ~/spmi-app
   ```
3. Set environment variable database sementara atau isi di file `.env.production`:
   ```bash
   export DATABASE_URL="postgresql://usernamecpanel_spmi_user:P@ssw0rdSpmi2026!@localhost:5432/usernamecpanel_spmi_db"
   ```
4. Jalankan script push database:
   ```bash
   npm run db:push
   ```
   *Output akan menampilkan status pembuatan 8 tabel dan seluruh data yang berhasil di-push.*

### Cara 2: Import via phpPgAdmin (Alternatif)
Jika tidak menggunakan terminal:
1. Buka file [supabase-schema.sql](file:///c:/Rianpedia_Project/spmi/supabase-schema.sql) di komputer Anda.
2. Buka menu **phpPgAdmin** di cPanel -> pilih database Anda.
3. Masuk ke tab **SQL**, paste seluruh isi `supabase-schema.sql`, lalu klik **Execute**.

---

## 4. Konfigurasi "Setup Node.js App" di cPanel

1. Di cPanel, cari dan klik menu **Setup Node.js App**.
2. Klik tombol **Create Application**.
3. Isi formulir konfigurasi berikut:
   - **Node.js version**: Pilih `20.x` (atau versi LTS terbaru).
   - **Application mode**: `Production`
   - **Application root**: `spmi-app` (folder tempat source code berada di home direktori).
   - **Application URL**: Pilih domain atau subdomain Anda (misal: `spmi.unpal.ac.id` atau `unpal.ac.id`).
   - **Application startup file**: `server.js`
4. **Environment Variables**:
   Tambahkan variabel lingkungan berikut satu per satu:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `DATABASE_URL` = `postgresql://usernamecpanel_spmi_user:P@ssw0rdSpmi2026!@localhost:5432/usernamecpanel_spmi_db`
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://nuqlneeiloedqklrwlgo.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
5. Klik **Create** di pojok kanan atas.
6. Catat baris perintah virtual environment yang muncul di bagian atas halaman (contoh: `source /home/username/nodevenv/spmi-app/20/bin/activate && cd /home/username/spmi-app`).

---

## 5. Build dan Upload Proyek ke cPanel

Karena Next.js telah dikonfigurasikan dengan mode `standalone` pada `next.config.js`, proses deploy sangat ringan dan hemat memori server.

### Langkah 5.1: Build di Lokal
Jalankan di komputer lokal Anda:
```bash
npm run build
```
Setelah proses build selesai, Next.js menghasilkan folder `.next/standalone`.

### Langkah 5.2: Struktur File yang Diupload ke cPanel
Upload file & folder berikut ke dalam folder root aplikasi di cPanel (`/home/username/spmi-app/`):

```text
/home/username/spmi-app/
├── .next/
│   ├── standalone/        <-- Seluruh isi folder standalone
│   └── static/            <-- Copy folder static ke .next/static
├── public/                <-- Folder public (gambar, favicon, logo)
├── src/                   <-- Folder source (opsional untuk db:push)
├── package.json
├── server.js              <-- File runner utama (dibuat otomatis oleh standalone)
└── .env.production / .env
```

> **Catatan Teknis Penting**:
> Folder `.next/standalone` memiliki file `server.js`. Salin seluruh isi dari `.next/standalone` ke root direktori `/home/username/spmi-app/`, lalu pastikan folder `.next/static` disalin ke `/home/username/spmi-app/.next/static` dan folder `public` disalin ke `/home/username/spmi-app/public`.

### Langkah 5.3: Jalankan Aplikasi di cPanel
1. Buka kembali menu **Setup Node.js App** di cPanel.
2. Klik tombol **Run NPM Install** (jika diperlukan).
3. Klik tombol **Restart Application**.

---

## 6. Konfigurasi Domain, SSL, dan .htaccess

Untuk memastikan domain langsung mengarah ke aplikasi Node.js dengan HTTPS otomatis:

### File `.htaccess` pada `public_html` atau Document Root Subdomain:
Buat / edit file `.htaccess` pada folder public domain Anda:

```apache
RewriteEngine On

# 1. Paksa Redirect HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Reverse Proxy ke Aplikasi Node.js Port 3000
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]

# Header Keamanan
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
```

### Pasang SSL (HTTPS Gratis):
1. Masuk ke cPanel -> menu **SSL/TLS Status**.
2. Centang domain / subdomain proyek Anda.
3. Klik **Run AutoSSL** dan tunggu hingga sertifikat aktif (ikon gembok hijau).

---

## 7. Otomatisasi CI/CD dengan GitHub Actions (Auto Deploy)

Dengan CI/CD, setiap kali Anda melakukan `git push` ke branch `main`, GitHub Actions akan otomatis melakukan build dan deploy ke cPanel tanpa upload manual.

### Langkah 7.1: Buat SSH Key di Komputer / cPanel
1. Buka Terminal cPanel -> menu **SSH Access** -> **Manage SSH Keys**.
2. Klik **Generate a New Key**:
   - Key Name: `github_deploy_key`
   - Password: *kosongkan*
   - Key Size: `4096`
3. Klik **Authorize** pada public key yang baru dibuat.
4. Klik **View/Download** pada Private Key -> Copy seluruh teks private key (termasuk `-----BEGIN RSA PRIVATE KEY-----`).

### Langkah 7.2: Tambahkan Secret di GitHub Repository
1. Buka repositori GitHub Anda -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Tambahkan **Repository Secrets** berikut:
   - `CPANEL_HOST`: IP server hosting atau domain (contoh: `spmi.unpal.ac.id` atau IP server).
   - `CPANEL_PORT`: Port SSH (biasanya `22` atau port custom hosting seperti `2222`).
   - `CPANEL_USERNAME`: Username akun cPanel Anda.
   - `CPANEL_SSH_KEY`: Paste isi Private Key SSH tadi.
   - `CPANEL_APP_DIR`: Path folder aplikasi di server (contoh: `/home/usernamecpanel/spmi-app`).

### Langkah 7.3: Buat File Workflow GitHub Actions
Buat file di repositori lokal Anda: `.github/workflows/deploy.yml`

```yaml
name: Deploy Next.js to cPanel

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout Repository
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: 📦 Install Dependencies
        run: npm ci

      - name: 🛠️ Build Next.js (Standalone Mode)
        env:
          NEXT_TELEMETRY_DISABLED: 1
          NODE_ENV: production
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
        run: npm run build

      - name: 🚚 Deploy to cPanel via SSH & Rsync
        uses: easingthemes/ssh-deploy@v5.0.0
        with:
          SSH_PRIVATE_KEY: ${{ secrets.CPANEL_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.CPANEL_HOST }}
          REMOTE_PORT: ${{ secrets.CPANEL_PORT }}
          REMOTE_USER: ${{ secrets.CPANEL_USERNAME }}
          TARGET: ${{ secrets.CPANEL_APP_DIR }}
          SOURCE: ".next/standalone/ .next/static public package.json"
          EXCLUDE: "/node_modules/, /.git/"

      - name: 🔄 Restart Node.js Application on cPanel
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.CPANEL_HOST }}
          port: ${{ secrets.CPANEL_PORT }}
          username: ${{ secrets.CPANEL_USERNAME }}
          key: ${{ secrets.CPANEL_SSH_KEY }}
          script: |
            cd ${{ secrets.CPANEL_APP_DIR }}
            mkdir -p .next/static
            cp -r static/* .next/static/ 2>/dev/null || true
            touch tmp/restart.txt
```

---

## 8. Panduan Maintenance & Troubleshooting

### 1. Cara Restart Aplikasi:
- **Via cPanel**: Buka **Setup Node.js App** -> Klik tombol **Restart**.
- **Via Terminal / SSH**:
  ```bash
  mkdir -p ~/spmi-app/tmp && touch ~/spmi-app/tmp/restart.txt
  ```

### 2. Memeriksa Error Log:
- Jika aplikasi tidak terbuka, periksa log di:
  ```bash
  cat ~/spmi-app/stderr.log
  # atau
  cat ~/spmi-app/stdout.log
  ```

### 3. Masalah Koneksi Database PostgreSQL:
- Pastikan hostname database di cPanel menggunakan `localhost` atau `127.0.0.1`.
- Pastikan User database telah diberikan `ALL PRIVILEGES` ke database yang dituju.
- Jalankan `npm run db:push` untuk memverifikasi koneksi dan data.

---

🎉 **Selamat! Aplikasi SPMI Universitas Palembang kini telah berhasil terdeploy secara profesional di cPanel dengan arsitektur modern, aman, dan terotomatisasi.**
