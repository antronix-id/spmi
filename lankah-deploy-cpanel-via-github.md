# 🚀 Panduan Lengkap Deploy SPMI UNPAL ke cPanel via GitHub

Dokumen ini memuat panduan langkah-demi-langkah yang sangat mendetail, jelas, dan mudah dipahami untuk mendeploy aplikasi **SPMI Universitas Palembang (Next.js & MySQL)** langsung dari repository **GitHub** ke server hosting **cPanel**.

Dengan metode ini, setiap kali Anda memperbarui kode di GitHub (`git push origin main`), aplikasi di cPanel dapat diperbarui secara cepat dan otomatis tanpa perlu mengunggah berkas zip secara manual lagi.

---

## 📌 Data Konfigurasi Server & Proyek Anda

Simpan data penting berikut sebagai referensi konfigurasi:
* **Repository GitHub**: `https://github.com/antronix-id/spmi.git`
* **Branch Utama**: `main`
* **URL / Host Server cPanel**: `cpanel.unpal.ac.id` (atau domain institusi Anda)
* **Username cPanel**: `unpx1994`
* **Direktori Aplikasi di cPanel**: `/home/unpx1994/spmi-app`
* **Database MySQL**: `unpx1994_spmi-unpal`
* **User Database**: `unpx1994_jemiarian`
* **Password Database**: `Spmiunpal!23.`

---

## 📑 Daftar Isi Panduan
1. [Metode 1: cPanel Git™ Version Control (Paling Mudah & Direkomendasikan)](#-metode-1-cpanel-git-version-control-paling-mudah--direkomendasikan)
   - [Langkah 1: Push Kode Lokal Terkini ke GitHub](#langkah-1-push-kode-lokal-terkini-ke-github)
   - [Langkah 2: Clone Repo di Menu Git™ Version Control cPanel](#langkah-2-clone-repo-di-menu-git-version-control-cpanel)
   - [Langkah 3: Konfigurasi File .env di Server cPanel](#langkah-3-konfigurasi-file-env-di-server-cpanel)
   - [Langkah 4: Konfigurasi di Menu "Setup Node.js App"](#langkah-4-konfigurasi-di-menu-setup-nodejs-app)
   - [Langkah 5: Pasang Webhook untuk Auto-Deploy Otomatis](#langkah-5-pasang-webhook-untuk-auto-deploy-otomatis)
2. [Metode 2: GitHub Actions CI/CD (Otomatis via Server Cloud GitHub)](#-metode-2-github-actions-cicd-otomatis-via-server-cloud-github)
3. [Panduan Pemeliharaan & Troubleshooting](#-panduan-pemeliharaan--troubleshooting)

---

## 🌟 Metode 1: cPanel Git™ Version Control (Paling Mudah & Direkomendasikan)

Metode ini menggunakan fitur resmi bawaan cPanel untuk menarik (*pull*) berkas langsung dari repository GitHub Anda ke direktori `/home/unpx1994/spmi-app`.

### Langkah 1: Push Kode Lokal Terkini ke GitHub
Pastikan seluruh perubahan terkini (termasuk migrasi database MySQL, folder upload lokal, `server.js`, dan `.cpanel.yml`) sudah terunggah ke branch `main` GitHub.

Jalankan perintah ini di Terminal VS Code komputer Anda:
```bash
git add .
git commit -m "feat: migrasi mysql, local storage uploads, cpanel startup, dan konfigurasi auto-deploy"
git push origin main
```

---

### Langkah 2: Clone Repo di Menu Git™ Version Control cPanel

1. Login ke dashboard **cPanel** Anda (`https://cpanel.unpal.ac.id`).
2. Gulir ke bagian **Files** (atau cari via kolom pencarian) lalu klik **Git™ Version Control**.
3. Klik tombol biru **Create** di sudut kanan atas.
4. Isi formulir pembuatan repository dengan data berikut:
   * **Clone a repository**: Pastikan tombol toggle dalam posisi **ON (Aktif)**.
   * **Clone URL**:  
     ```text
     https://github.com/antronix-id/spmi.git
     ```
   * **Repository Path**:  
     Ketik: `spmi-app`  
     *(cPanel akan otomatis menempatkannya pada jalur path: `/home/unpx1994/spmi-app`)*.
   * **Repository Name**:  
     Ketik: `spmi`
5. Klik tombol **Create** di bagian bawah.
6. Tunggu proses kloning berlangsung (sekitar 10–30 detik hingga muncul notifikasi sukses). Seluruh berkas proyek kini sudah berada di cPanel Anda!

---

### Langkah 3: Konfigurasi File .env di Server cPanel

File `.env` sengaja diabaikan oleh Git demi keamanan password database Anda. Oleh karena itu, kita perlu membuat file `.env` satu kali di cPanel:

1. Di cPanel, buka menu **File Manager**.
2. Masuk ke folder aplikasi Anda: `/home/unpx1994/spmi-app/`.
3. Klik tombol **+ File** (Buat Berkas Baru) di kiri atas.
4. Beri nama file: **`.env`** (diawali tanda titik).
   *(Jika file `.env.cpanel` sudah ada di folder tersebut, Anda cukup menyalin isinya atau me-rename-nya menjadi `.env`)*.
5. Klik kanan pada file `.env` ➔ pilih **Edit**.
6. Masukkan konfigurasi produksi berikut:

```env
# RUNTIME PRODUCTION
NODE_ENV="production"
PORT=3000
NEXT_TELEMETRY_DISABLED=1

# DOMAIN WEBSITE RESMI ANDA
NEXT_PUBLIC_APP_URL="https://spmi.unpal.ac.id"

# KONEKSI DATABASE MYSQL CPANEL
MYSQL_HOST="localhost"
MYSQL_PORT=3306
MYSQL_USER="unpx1994_jemiarian"
MYSQL_PASSWORD="Spmiunpal!23."
MYSQL_DATABASE="unpx1994_spmi-unpal"

MYSQL_URL="mysql://unpx1994_jemiarian:Spmiunpal!23.@localhost:3306/unpx1994_spmi-unpal"
DATABASE_URL="mysql://unpx1994_jemiarian:Spmiunpal!23.@localhost:3306/unpx1994_spmi-unpal"

# BRANDING INSTITUSI
NEXT_PUBLIC_INSTITUTION_NAME="Universitas Palembang"
NEXT_PUBLIC_APP_NAME="SPMI UNPAL"
NEXT_PUBLIC_CONTACT_EMAIL="spmi@unpal.ac.id"
NEXT_PUBLIC_CONTACT_PHONE="(0711) 512345"
NEXT_PUBLIC_CONTACT_WHATSAPP="+62 812-7389-9900"
```
7. Klik **Save Changes** (Simpan Perubahan).

---

### Langkah 4: Konfigurasi di Menu "Setup Node.js App"

1. Kembali ke menu utama cPanel ➔ cari dan klik **Setup Node.js App** (di bawah kategori *Software*).
2. Klik tombol **Create Application**.
3. Isi parameter aplikasi sebagai berikut:
   * **Node.js version**: Pilih versi **`20.x`** (direkomendasikan).
   * **Application mode**: Pilih **`Production`**.
   * **Application root**: Ketik **`spmi-app`**.
   * **Application URL**: Pilih domain atau subdomain Anda (misalnya: `spmi.unpal.ac.id`).
   * **Application startup file**: Ketik **`server.js`** *(file ini sudah disediakan khusus untuk cPanel)*.
4. Klik tombol **Create** di kanan atas.
5. Setelah aplikasi terbuat:
   * Klik tombol **Run NPM Install** untuk memasang seluruh pustaka dependensi.
   * Buka menu **Terminal** di cPanel (atau jalankan perintah virtualenv cPanel), masuk ke folder `spmi-app`, lalu jalankan build satu kali:
     ```bash
     npm run build
     ```
   * Klik tombol **Restart Application**.
6. Buka domain Anda di browser untuk melihat website SPMI UNPAL sudah aktif!

---

### Langkah 5: Pasang Webhook untuk Auto-Deploy Otomatis

Agar setiap kali Anda melakukan `git push` dari laptop, cPanel **langsung otomatis memperbarui kode** tanpa perlu login cPanel:

1. Buka menu **Git™ Version Control** di cPanel.
2. Di baris repository `spmi`, klik tombol **Manage**.
3. Buka tab **Pull or Deploy**.
4. Di bagian bawah tab tersebut, Anda akan menemukan bagian **Webhook**.
5. Salin URL Webhook yang tertera (contoh formatnya):
   ```text
   https://cpanel.unpal.ac.id:2083/cpanelgit/webhook?id=xxxxxxxxx...
   ```
6. Sekarang, buka repository Anda di GitHub melalui browser:  
   👉 `https://github.com/antronix-id/spmi/settings/hooks`
7. Klik tombol **Add webhook** (di sudut kanan atas).
8. Isi kolom formulir webhook:
   * **Payload URL**: Tempelkan (*paste*) URL Webhook dari cPanel tadi.
   * **Content type**: Pilih **`application/json`**.
   * **Which events would you like to trigger this webhook?**: Pilih **Just the push event**.
   * Centang **Active**.
9. Klik tombol **Add webhook**.

🎉 **Selamat!** Sistem auto-deploy Anda kini sudah aktif 100%!  
Setiap kali Anda mengetik `git push origin main` di laptop, GitHub akan memanggil webhook cPanel, dan cPanel akan secara otomatis menarik pembaruan kode terbaru ke server Anda.

---

## 🚀 Metode 2: GitHub Actions CI/CD (Otomatis via Server Cloud GitHub)

Jika server cPanel Anda memiliki RAM terbatas, Anda bisa memanfaatkan **GitHub Actions** di mana proses build (`npm run build`) dilakukan di komputer server GitHub, lalu berkas yang sudah jadi dikirimkan ke cPanel via FTP.

Kami telah menyiapkan berkas konfigurasi siap pakai di:  
👉 **[`.github/workflows/deploy.yml`](file:///c:/Rianpedia_Project/spmi/.github/workflows/deploy.yml)**

### Langkah-langkah Setup:

1. Buka repository Anda di GitHub ➔ masuk ke menu **Settings**.
2. Pada panel menu sebelah kiri, klik **Secrets and variables** ➔ pilih **Actions**.
3. Klik tombol **New repository secret** untuk menambahkan 3 variabel rahasia:
   * **Nama Secret**: `FTP_SERVER`  
     **Nilai**: `cpanel.unpal.ac.id` (atau IP shared hosting server cPanel Anda)
   * **Nama Secret**: `FTP_USERNAME`  
     **Nilai**: `unpx1994` (username akun cPanel Anda)
   * **Nama Secret**: `FTP_PASSWORD`  
     **Nilai**: Password akun cPanel Anda
4. Selesai!
5. Sekarang, setiap kali ada commit baru yang di-push ke branch `main`, buka tab **Actions** di GitHub untuk melihat proses build dan deploy berlangsung secara otomatis.

---

## 🛠️ Panduan Pemeliharaan & Troubleshooting

### 1. Bagaimana cara me-restart aplikasi secara manual tanpa login cPanel?
Aplikasi menggunakan Phusion Passenger. Anda dapat memerintahkan cPanel untuk me-restart aplikasi cukup dengan memperbarui berkas `tmp/restart.txt`:
```bash
# Jika melalui Terminal cPanel / SSH:
touch /home/unpx1994/spmi-app/tmp/restart.txt
```
Passenger akan mendeteksi perubahan tanggal berkas tersebut dan otomatis memuat ulang aplikasi dengan *zero downtime*.

### 2. Memastikan Izin Folder Upload (Permissions)
Folder penyimpanan berkas dokumen PDF dan gambar berada di `public/uploads/`.
Pastikan izin folder tersebut adalah **755**:
* Buka **File Manager** cPanel.
* Masuk ke `/home/unpx1994/spmi-app/public/`.
* Klik kanan folder **uploads** ➔ pilih **Change Permissions** ➔ pastikan nilainya adalah **0755** (User: Read/Write/Execute, Group & World: Read/Execute).

### 3. Muncul Halaman "503 Service Unavailable"?
Jika website menampilkan pesan 503 setelah update:
1. Masuk ke **Setup Node.js App** di cPanel.
2. Klik tombol **Stop Application**, tunggu 5 detik, lalu klik **Start Application**.
3. Periksa file log error di folder aplikasi:
   `/home/unpx1994/spmi-app/stderr.log` untuk melihat rincian penyebab error.

### 4. Database tidak terhubung?
Pastikan file `.env` di cPanel sudah memuat kredensial yang tepat:
* Host: `localhost` (karena database dan aplikasi berada di satu server yang sama)
* Port: `3306`
* Database: `unpx1994_spmi-unpal`
* User: `unpx1994_jemiarian`
