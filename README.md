# SPMI Universitas Palembang - Frontend Application

Portal resmi Sistem Penjaminan Mutu Internal (SPMI) Universitas Palembang yang dibangun dengan **Next.js 14**, **TypeScript**, **Tailwind CSS**, dan **Supabase**.

## Fitur Utama Sesuai PRD

1. **Beranda (`/`)**: Hero section komitmen mutu, metrik capaian prodi & dokumen, siklus PPEPP interaktif, berita & agenda mutu terkini, serta akses dokumen populer.
2. **Tentang Kami (`/tentang-kami`)**: Visi, Misi & Tujuan, Tugas Pokok & Fungsi (Tupoksi), Struktur Organisasi interaktif, dan Maklumat Pelayanan SPMI.
3. **Akreditasi (`/akreditasi`)**: Tabel status akreditasi institusi & seluruh program studi dengan filter jenjang, peringkat, pencarian cepat nomor SK, masa berlaku, dan unduh sertifikat.
4. **Layanan SPMI**:
   - **Pemantauan SPMI (`/spmi/pemantauan`)**: Dashboard evaluasi & visualisasi grafik ketercapaian 9 Kriteria Standar Pendidikan Tinggi, Indikator Kinerja Utama (IKU), dan progres tindak lanjut temuan AMI Siklus XI.
   - **Dokumen SPMI (`/spmi/dokumen`)**: Repositori kebijakan mutu, manual mutu, standar SPMI, formulir AMI, dan laporan RTM dengan pencarian, filter kategori/tahun, dan modal *preview* PDF.
5. **Peraturan (`/peraturan`)**: Direktori regulasi (UU No. 12/2012, Permendikbudristek No. 53/2023, SN-Dikti, SK Rektor) dengan filter tahun dan kategori.
6. **Kontak & Layanan Aduan (`/kontak`)**: Formulir konsultasi & aduan mutu interaktif terintegrasi database, kontak resmi, alamat kampus, jam kerja, dan FAQ.
7. **Portal Admin (`/admin`)**:
   - **Login Admin (`/admin/login`)**: Autentikasi aman khusus staf SPMI.
   - **Admin Dashboard (`/admin/dashboard`)**: Pengelolaan dokumen SPMI, pembaruan status akreditasi, dan peninjauan kotak masuk pesan pengunjung (`contact_messages`).

## Cara Menjalankan Aplikasi

1. **Instalasi Dependensi:**
   ```bash
   npm install
   ```

2. **Menjalankan Server Pengembangan (Dev Server):**
   ```bash
   npm run dev
   ```
   Akses aplikasi di browser pada: `http://localhost:3000`

3. **Membangun Versi Produksi:**
   ```bash
   npm run build
   npm start
   ```

4. **Konfigurasi Supabase (Opsional):**
   Salin berkas `.env.example` menjadi `.env.local` dan masukkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` Anda. Sistem dilengkapi dengan mock data fallback cerdas yang bekerja secara otomatis tanpa konfigurasi database eksternal.
