# Panduan Lengkap Implementasi Google Drive API sebagai Storage Dokumen SPMI

Dokumen ini berisi panduan teknis langkah demi langkah untuk mengintegrasikan **Google Drive (Akun Kampus/Institusi)** sebagai media penyimpanan file dokumen (`.pdf`) dan gambar (`.jpg`, `.png`, dll.) pada sistem SPMI, sementara database metadata tetap tersimpan di Supabase.

---

## 📌 Arsitektur & Cara Kerja

```
[ Frontend SPMI (React/Vite) ]
       │
       ├─── 1. Upload File Fisik (.pdf / .png) ───► [ Google Drive API / Apps Script ]
       │                                                      │
       │◄── 2. Response: File ID & Direct URL ────────────────┘
       │
       └─── 3. Simpan Metadata (Judul, No, URL) ──► [ Supabase Database ]
```

Terdapat **2 metode utama** yang bisa dipilih:
* **Metode A (Rekomendasi Terbaik & Termudah untuk Frontend SPA):** Menggunakan **Google Apps Script Web App** sebagai bridge upload langsung ke folder Google Drive kampus tanpa perlu backend server tambahan.
* **Metode B (Enterprise / Backend):** Menggunakan **Service Account Google Cloud Console** melalui Supabase Edge Functions atau Backend API.

---

## 🚀 METODE A: Menggunakan Google Apps Script (Paling Praktis & Cepat)

Metode ini tidak memerlukan backend terpisah dan sangat aman karena Google Apps Script bertindak sebagai *serverless endpoint* milik akun Google kampus Anda.

### Langkah 1: Siapkan Folder di Google Drive Kampus
1. Buka [Google Drive](https://drive.google.com) menggunakan akun Google Kampus/Institusi.
2. Buat folder baru, misalnya bernama: `SPMI_STORAGE_DOKUMEN`.
3. Buka folder tersebut, lalu salin **Folder ID** dari URL browser:
   * URL: `https://drive.google.com/drive/folders/1a2B3c4D5e6F7g8H9iJ0kLmNoPqRsTuVw`
   * Folder ID adalah: `1a2B3c4D5e6F7g8H9iJ0kLmNoPqRsTuVw` (Simpan ID ini).
4. Klik kanan folder -> **Bagikan (Share)** -> Ubah akses umum menjadi:
   * **"Siapa saja yang memiliki link"** -> Pilih **"Pelihat" (Viewer)** agar dokumen yang diunggah bisa dibaca/diunduh oleh pengguna sistem SPMI.

---

### Langkah 2: Buat Google Apps Script Endpoint
1. Buka [script.google.com](https://script.google.com).
2. Klik **Proyek Baru (New Project)**, beri nama misalnya: `SPMI Drive Uploader API`.
3. Hapus kode bawaan di editor, lalu ganti dengan kode Google Apps Script berikut:

```javascript
// Ganti dengan Folder ID dari Langkah 1
const FOLDER_ID = "MASUKKAN_FOLDER_ID_GOOGLE_DRIVE_ANDA_DISINI";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(30000); // Cegah race condition

  try {
    const data = JSON.parse(e.postData.contents);
    const fileName = data.filename || "dokumen_" + new Date().getTime();
    const mimeType = data.mimeType || "application/pdf";
    const base64Data = data.base64; // Data file dalam format Base64

    if (!base64Data) {
      return responseJSON({ success: false, message: "File data (base64) tidak ditemukan" }, 400);
    }

    // Decode base64 menjadi blob file
    const decodedBytes = Utilities.base64Decode(base64Data);
    const blob = Utilities.newBlob(decodedBytes, mimeType, fileName);

    // Ambil target folder
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const file = folder.createFile(blob);

    // Set permission agar file bisa dilihat lewat link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();
    const webViewLink = file.getUrl();
    // Direct link untuk preview/download langsung
    const directDownloadUrl = "https://lh3.googleusercontent.com/d/" + fileId;
    const directPreviewUrl = "https://drive.google.com/file/d/" + fileId + "/preview";

    return responseJSON({
      success: true,
      data: {
        fileId: fileId,
        fileName: file.getName(),
        mimeType: mimeType,
        size: file.getSize(),
        url: webViewLink,
        directDownloadUrl: directDownloadUrl,
        previewUrl: directPreviewUrl
      }
    });

  } catch (error) {
    return responseJSON({ success: false, error: error.toString() }, 500);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return responseJSON({ status: "running", service: "SPMI Google Drive Storage API" });
}

function responseJSON(payload, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

### Langkah 3: Deploy Script sebagai Web App
1. Di halaman Apps Script, klik tombol **Deploy (Terapkan)** di kanan atas -> pilih **Deployment baru (New deployment)**.
2. Klik ikon gerigi (Select type) -> pilih **Aplikasi Web (Web App)**.
3. Konfigurasi form:
   * **Deskripsi:** `SPMI Production Uploader v1`
   * **Jalankan sebagai (Execute as):** `Saya (email-anda@kampus.ac.id)` *(Penting! agar file masuk ke kuota akun kampus Anda)*.
   * **Siapa yang memiliki akses (Who has access):** `Siapa saja (Anyone)` *(Penting! agar frontend SPMI bisa mengirimkan payload POST)*.
4. Klik **Deploy**.
5. Berikan izin otorisasi akses Google Drive jika diminta (*Review Permissions -> Pilih akun -> Advanced -> Go to ... (unsafe) -> Allow*).
6. Salin **URL Aplikasi Web (Web App URL)** yang dihasilkan.
   * Contoh: `https://script.google.com/macros/s/AKfycbx.../exec`

---

### Langkah 4: Konfigurasi di Proyek SPMI (.env & Helper)

#### 1. Tambahkan ke file `.env`
Buka file `.env` di proyek SPMI Anda dan tambahkan:
```env
VITE_GDRIVE_UPLOAD_URL="https://script.google.com/macros/s/AKfycbx.../exec"
```

#### 2. Buat File Helper Upload: `src/lib/gdriveStorage.ts`
Buat file baru di [`src/lib/gdriveStorage.ts`](file:///c:/Rianpedia_Project/spmi/src/lib/gdriveStorage.ts):

```typescript
export interface GDriveUploadResult {
  fileId: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  directDownloadUrl: string;
  previewUrl: string;
}

/**
 * Mengubah File Object browser ke string Base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Ambil string setelah koma (data:application/pdf;base64,...)
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Upload file dokumen/gambar ke Google Drive via Apps Script Web App
 */
export async function uploadToGoogleDrive(file: File): Promise<GDriveUploadResult> {
  const gdriveUrl = import.meta.env.VITE_GDRIVE_UPLOAD_URL;
  if (!gdriveUrl) {
    throw new Error('VITE_GDRIVE_UPLOAD_URL belum disetting di file .env');
  }

  // 1. Konversi file ke base64
  const base64Data = await fileToBase64(file);

  const payload = {
    filename: file.name,
    mimeType: file.type || 'application/pdf',
    base64: base64Data
  };

  // 2. Request POST ke Google Apps Script
  const response = await fetch(gdriveUrl, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'text/plain;charset=utf-8', // Apps script require plain text to avoid preflight CORS
    },
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || result.error || 'Gagal mengunggah file ke Google Drive');
  }

  return result.data;
}
```

---

### Langkah 5: Contoh Penggunaan saat Form Upload Disimpan

Ketika admin/auditor mengunggah dokumen SPMI di form:

```typescript
import { uploadToGoogleDrive } from '@/lib/gdriveStorage';
import { supabase } from '@/lib/supabase';

async function handleSimpanDokumen(file: File, formValues: any) {
  try {
    // 1. Upload file fisik ke Google Drive
    console.log('Mengunggah ke Google Drive...');
    const driveResult = await uploadToGoogleDrive(file);

    // 2. Simpan metadata & link Google Drive ke tabel Supabase
    const { data, error } = await supabase
      .from('dokumen_spmi')
      .insert({
        kode_dokumen: formValues.kode_dokumen,
        nama_dokumen: formValues.nama_dokumen,
        kategori: formValues.kategori,
        versi: formValues.versi,
        tahun: formValues.tahun,
        file_url: driveResult.url,              // Link web view
        file_preview_url: driveResult.previewUrl, // Link iframe preview
        file_id: driveResult.fileId,            // ID Google Drive
        file_size: driveResult.size,
        mime_type: driveResult.mimeType,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    alert('Dokumen berhasil diunggah ke Google Drive & tersimpan di database!');
  } catch (err: any) {
    console.error('Upload error:', err);
    alert(`Gagal: ${err.message}`);
  }
}
```

---

## 🏢 METODE B: Menggunakan Google Cloud Service Account (Enterprise/Backend)

Jika Anda ingin menggunakan API resmi Google Cloud Platform (GCP) dengan Service Account:

### 1. Buat Service Account di Google Cloud Console
1. Buka [Google Cloud Console](https://console.cloud.google.com).
2. Buat Project Baru: `SPMI-Kampus-Storage`.
3. Aktifkan API: Buka **APIs & Services** -> **Library** -> Cari **Google Drive API** -> Klik **Enable**.
4. Buka **APIs & Services** -> **Credentials** -> Klik **Create Credentials** -> **Service Account**.
5. Beri nama service account (contoh: `spmi-storage-bot`), lalu klik **Done**.
6. Klik pada email service account yang baru dibuat -> Buka tab **Keys** -> **Add Key** -> **Create new key** -> Pilih **JSON**.
7. File `.json` kredensial akan terunduh (simpan file ini dengan aman).

### 2. Beri Akses Folder Drive ke Service Account
1. Buka file `.json` tadi, salin `client_email` (contoh: `spmi-storage-bot@spmi-kampus-storage.iam.gserviceaccount.com`).
2. Buka folder target di Google Drive Anda.
3. Klik kanan -> **Bagikan (Share)** -> Masukkan email Service Account tersebut sebagai **Editor**.

### 3. Implementasi di Backend / Supabase Edge Function
*Gunakan package `@googleapis/drive` atau library `googleapis` pada backend Node.js atau Supabase Edge Function untuk menerima stream file dan menyimpannya menggunakan JWT authentication Service Account.*

---

## 📊 Perbandingan Singkat

| Fitur | Metode A (Apps Script) | Metode B (Service Account) |
| :--- | :--- | :--- |
| **Kompleksitas Setup** | Sangat Mudah (5 - 10 Menit) | Menengah (Perlu GCP & Backend) |
| **Biaya Server Backend** | **Rp 0** (Serverless Google) | Membutuhkan Backend/Edge Function |
| **Kapasitas Penyimpanan** | Sesuai Kuota Akun Google Kampus | Sesuai Kuota Akun Google Kampus |
| **Dukungan Frontend SPA** | Langsung dari React/Vite | Harus lewat Backend Proxy |
| **Kecepatan Implementasi** | ⚡ Sangat Cepat | ⏳ Butuh konfigurasi API key & IAM |

---

## 🔒 Tips Keamanan & Rekomendasi Tambahan

1. **Gunakan Google Shared Drive (Drive Bersama):**
   * Sangat disarankan menyimpan folder di **Drive Bersama (Shared Drive)** institusi kampus, bukan Drive pribadi staf/admin, agar file tidak hilang jika staf berganti.
2. **Iframe Preview PDF:**
   * Anda bisa langsung menampilkan dokumen PDF di tampilan aplikasi SPMI menggunakan `driveResult.previewUrl` di dalam tag `<iframe>`:
   ```jsx
   <iframe 
     src={dokumen.file_preview_url} 
     width="100%" 
     height="600px" 
     allow="autoplay"
   />
   ```
3. **Batas Ukuran Upload Apps Script:**
   * Batas payload request ke Apps Script adalah **~50 MB per file**. Untuk dokumen SPMI (PDF & Foto bukti audit) ukuran ini biasanya sudah sangat mencukupi.
