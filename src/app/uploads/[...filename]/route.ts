import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MIME_MAP: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> | { filename: string[] } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const filenameParts = resolvedParams.filename || [];
    const sanitizedPath = filenameParts.map(p => p.replace(/\.\./g, '')).join('/');

    const possiblePaths = [
      path.join(process.cwd(), 'public', 'uploads', sanitizedPath),
      path.join(process.cwd(), 'uploads', sanitizedPath),
    ];

    let filePath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(/*turbopackIgnore: true*/ p) && fs.statSync(/*turbopackIgnore: true*/ p).isFile()) {
        filePath = p;
        break;
      }
    }

    if (!filePath) {
      return new NextResponse('File tidak ditemukan di server.', { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
