Berikut adalah ringkasan *Product Requirements Document* (PRD) yang dirancang secara terstruktur dan simpel untuk Sistem Penjaminan Mutu Internal (SPMI) Universitas Palembang.

## Pendahuluan & Arsitektur

Sistem ini bertujuan untuk digitalisasi proses penjaminan mutu agar transparan, mudah diakses, dan efisien. Fokus utamanya adalah menyajikan informasi publik sekaligus menyediakan ruang pengelolaan dokumen mutu.

> **Tumpukan Teknologi:** Next.js (Kerangka Kerja), Tailwind CSS & shadcn/ui (Antarmuka/Styling), serta Supabase & PostgreSQL (Autentikasi, Database, dan Penyimpanan).

---

## Struktur Menu & Halaman

Sistem navigasi dirancang agar intuitif bagi pengunjung situs maupun asesor.

| Menu Utama | Deskripsi Konten & Sub-Menu |
| --- | --- |
| **Beranda** | Banner utama, ringkasan informasi, dan pengumuman terbaru. |
| **Tentang Kami** | Profil mencakup Visi Misi, Fungsi Tugas, Struktur Organisasi, dan Layanan. |
| **Akreditasi** | Tabel status akreditasi program studi dan institusi beserta masa berlakunya. |
| **SPMI** | Memuat halaman **Pemantauan SPMI** (dashboard) dan **Dokumen SPMI** (PDF/Arsip). |
| **Peraturan** | Direktori regulasi, undang-undang, dan SK Rektor terkait penjaminan mutu. |
| **Kontak** | Formulir pertanyaan, informasi lokasi, email, dan nomor telepon. |

---

## Spesifikasi Fitur Utama

Kebutuhan fungsional dasar ini memastikan sistem berjalan sesuai tujuan tanpa terlalu kompleks:

* **Sistem Autentikasi:** Fitur login aman khusus untuk Admin menggunakan Supabase Auth.
* **Manajemen Konten Statis:** Kemampuan Admin mengedit teks pada halaman Visi Misi hingga Struktur Organisasi.
* **Penyimpanan Dokumen SPMI:** Modul untuk mengunggah, melihat (*preview*), dan mengunduh file kebijakan atau manual mutu.
* **Dashboard Pemantauan:** Halaman yang menampilkan indikator pencapaian mutu fakultas atau prodi secara ringkas.
* **Filter Regulasi:** Fitur pencarian cepat dan penyaringan dokumen peraturan berdasarkan tahun terbit.
* **Pesan Terintegrasi:** Formulir kontak yang terhubung langsung dengan *database* sehingga Admin dapat meninjau masukan secara terpusat.

---

## Skema Database (PostgreSQL)

Pengelolaan data akan memanfaatkan tabel-tabel utama berikut di dalam Supabase:

* **users_admin:** Menyimpan peran dan hak akses staf SPMI.
* **pages_content:** Menyimpan teks dinamis untuk halaman profil (tentang kami).
* **accreditations:** Mencatat nama prodi, peringkat akreditasi, dan tanggal kedaluwarsa.
* **documents:** Menyimpan metadata file (URL *bucket* Supabase, kategori dokumen).
* **monitoring_data:** Merekam skor atau status evaluasi mutu per periode.
* **contact_messages:** Menampung data nama, email, dan isi pesan dari pengunjung.

Apakah ada spesifikasi khusus pada bagian **Pemantauan SPMI** yang perlu divisualisasikan dengan grafik statistik, atau cukup berupa tabel ringkasan saja?