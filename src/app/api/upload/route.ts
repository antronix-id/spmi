import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Pemetaan subfolder resmi
const ALLOWED_SUBFOLDERS: Record<string, string> = {
  documents: 'documents',
  accreditations: 'accreditations',
  regulations: 'regulations',
  members: 'images/members',
  banners: 'images/banners',
  content: 'images/content',
  messages: 'messages',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folderParam = (formData.get('folder') as string) || 'documents';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada berkas yang diunggah.' },
        { status: 400 }
      );
    }

    // Validasi batas maksimal ukuran file 6 MB
    const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6 MB
    if (file.size > MAX_FILE_SIZE) {
      const currentSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { 
          success: false, 
          error: `Ukuran berkas (${currentSizeMB} MB) melebihi batas maksimal 6 MB.` 
        },
        { status: 400 }
      );
    }

    // Validate MIME type & Extension
    const fileName = file.name;
    const isPdf = fileName.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    
    // Tentukan subfolder target di public/uploads
    const subFolder = ALLOWED_SUBFOLDERS[folderParam] || folderParam || 'documents';
    const targetDir = path.join(process.cwd(), 'public', 'uploads', subFolder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Buat nama file unik yang aman (Timestamp + Sanitized Original Name)
    const timestamp = Date.now();
    const cleanBaseName = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const ext = path.extname(fileName) || (isPdf ? '.pdf' : '');
    const uniqueFileName = `${timestamp}_${cleanBaseName}${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Simpan fisik berkas ke disk server lokal / Laragon / cPanel
    const filePath = path.join(targetDir, uniqueFileName);
    fs.writeFileSync(filePath, buffer);

    // Hitung ukuran file formatted
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeInMB} MB`;

    // URL Publik yang dapat diakses langsung oleh browser
    const publicUrl = `/uploads/${subFolder}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      storedFileName: uniqueFileName,
      size: sizeStr,
      uploadedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memproses unggahan berkas: ' + (error?.message || '') },
      { status: 500 }
    );
  }
}
