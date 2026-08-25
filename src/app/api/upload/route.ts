import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

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

    // Validate MIME type / extension
    const fileName = file.name;
    const isPdf = fileName.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    
    // Create a safe, unique filename
    const timestamp = Date.now();
    const cleanBaseName = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const ext = path.extname(fileName) || (isPdf ? '.pdf' : '');
    const uniqueFileName = `${timestamp}_${cleanBaseName}${ext}`;
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Calculate file size string
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeInMB} MB`;

    // 1. Coba upload ke Supabase Storage jika dikonfigurasi
    if (supabaseUrl && serviceRoleKey && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = createClient(supabaseUrl, serviceRoleKey);
        const storagePath = `${folder}/${uniqueFileName}`;

        let { data, error } = await supabase.storage
          .from('spmi-files')
          .upload(storagePath, buffer, {
            contentType: file.type || 'application/octet-stream',
            cacheControl: '3600',
            upsert: true
          });

        // If bucket does not exist, try creating bucket and retry upload
        if (error && (error.message?.toLowerCase().includes('not found') || (error as any).statusCode === 404)) {
          try {
            await supabase.storage.createBucket('spmi-files', { public: true });
            const retry = await supabase.storage
              .from('spmi-files')
              .upload(storagePath, buffer, {
                contentType: file.type || 'application/octet-stream',
                cacheControl: '3600',
                upsert: true
              });
            data = retry.data;
            error = retry.error;
          } catch (createErr) {
            console.warn('Gagal auto-create bucket Supabase:', createErr);
          }
        }

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('spmi-files')
            .getPublicUrl(storagePath);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            fileName: fileName,
            storedFileName: uniqueFileName,
            size: sizeStr,
            uploadedAt: new Date().toISOString(),
          });
        } else if (error) {
          console.warn('Supabase storage upload error:', error.message);
        }
      } catch (sbErr) {
        console.warn('Gagal upload ke Supabase Storage, mencoba penyimpanan lokal...', sbErr);
      }
    }

    // 2. Fallback: Simpan ke disk lokal (public/uploads)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, uniqueFileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${uniqueFileName}`;

      return NextResponse.json({
        success: true,
        url: publicUrl,
        fileName: fileName,
        storedFileName: uniqueFileName,
        size: sizeStr,
        uploadedAt: new Date().toISOString(),
      });
    } catch (fsErr: any) {
      console.warn('Error saat menyimpan ke disk lokal, mencoba fallback base64:', fsErr);

      // 3. Fallback terakhir untuk gambar: Base64 Data URL (dijamin tampil di semua browser)
      if (file.type.startsWith('image/')) {
        const mimeType = file.type || 'image/jpeg';
        const base64Data = buffer.toString('base64');
        const dataUrl = `data:${mimeType};base64,${base64Data}`;
        return NextResponse.json({
          success: true,
          url: dataUrl,
          fileName: fileName,
          storedFileName: uniqueFileName,
          size: sizeStr,
          uploadedAt: new Date().toISOString(),
        });
      }

      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan berkas ke server: ' + (fsErr?.message || '') },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memproses unggahan berkas: ' + (error?.message || '') },
      { status: 500 }
    );
  }
}
