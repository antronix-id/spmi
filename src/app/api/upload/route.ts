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

    // 1. Coba upload ke Supabase Storage jika dikonfigurasi (Direkomendasikan untuk Vercel)
    if (supabaseUrl && serviceRoleKey && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = createClient(supabaseUrl, serviceRoleKey);
        const storagePath = `${folder}/${uniqueFileName}`;

        const { data, error } = await supabase.storage
          .from('spmi-files')
          .upload(storagePath, buffer, {
            contentType: file.type || 'application/octet-stream',
            cacheControl: '3600',
            upsert: true
          });

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
        }
      } catch (sbErr) {
        console.warn('Gagal upload ke Supabase Storage, mencoba penyimpanan lokal...', sbErr);
      }
    }

    // 2. Fallback: Simpan ke folder public/uploads (Local Development / Server Tradisional)
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
      console.error('Error saat menyimpan ke disk lokal:', fsErr);
      return NextResponse.json(
        { success: false, error: 'Gagal menyimpan berkas ke server.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memproses unggahan berkas.' },
      { status: 500 }
    );
  }
}
