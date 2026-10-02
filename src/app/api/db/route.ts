import { NextRequest, NextResponse } from 'next/server';
import { getMysqlPool } from '@/lib/mysql';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Sanitize table name to prevent SQL injection
const ALLOWED_TABLES = [
  'accreditations',
  'documents',
  'document_access_keys',
  'monitoring_data',
  'regulations',
  'contact_messages',
  'org_members',
  'pages_content',
  'users_admin'
];

const DEFAULT_ORDERS: Record<string, string> = {
  accreditations: 'ORDER BY `level` ASC',
  documents: 'ORDER BY `year` DESC, `updated_at` DESC',
  monitoring_data: 'ORDER BY `audit_period` DESC',
  regulations: 'ORDER BY `year` DESC',
  contact_messages: 'ORDER BY `created_at` DESC',
  org_members: 'ORDER BY `order` ASC, `created_at` ASC',
  document_access_keys: 'ORDER BY `created_at` DESC',
  pages_content: 'ORDER BY `updated_at` DESC',
  users_admin: 'ORDER BY `created_at` DESC'
};

// GET: Fetch records from a table
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    if (!table) {
      return NextResponse.json({ error: 'Parameter table wajib disertakan' }, { status: 400 });
    }

    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: 'Tabel tidak diizinkan' }, { status: 403 });
    }

    const pool = getMysqlPool();
    if (!pool) {
      return NextResponse.json({ error: 'Koneksi MySQL belum dikonfigurasi' }, { status: 500 });
    }

    const whereConditions: string[] = [];
    const params: any[] = [];

    if (slug) {
      whereConditions.push('`slug` = ?');
      params.push(slug);
    }
    if (id) {
      whereConditions.push('`id` = ?');
      params.push(id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const orderClause = whereConditions.length > 0 ? '' : (DEFAULT_ORDERS[table] || '');
    const query = `SELECT * FROM \`${table}\` ${whereClause} ${orderClause}`.trim();
    
    const [rows] = await pool.query(query, params);

    // Normalisasi data (boolean dan JSON parsing jika string)
    const data = (rows as any[]).map(row => {
      const formatted = { ...row };
      if ('is_active' in formatted) {
        formatted.is_active = Boolean(formatted.is_active);
      }
      // Parse field JSON jika belum berformat objek
      if ('content' in formatted && typeof formatted.content === 'string') {
        try {
          formatted.content = JSON.parse(formatted.content);
        } catch {}
      }
      if ('permissions' in formatted && typeof formatted.permissions === 'string') {
        try {
          formatted.permissions = JSON.parse(formatted.permissions);
        } catch {}
      }
      return formatted;
    });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('MySQL GET error:', err);
    return NextResponse.json({ error: err.message || 'Database query failed' }, { status: 500 });
  }
}

// POST: Insert, Upsert, or Delete record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { table, item, action, id } = body;

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: 'Tabel tidak diizinkan atau tidak valid' }, { status: 403 });
    }

    const pool = getMysqlPool();
    if (!pool) {
      return NextResponse.json({ error: 'Koneksi MySQL belum dikonfigurasi' }, { status: 500 });
    }

    // Action: DELETE
    if (action === 'delete') {
      if (!id) {
        return NextResponse.json({ error: 'ID wajib disertakan untuk action delete' }, { status: 400 });
      }
      await pool.query(`DELETE FROM \`${table}\` WHERE \`id\` = ?`, [id]);
      return NextResponse.json({ success: true });
    }

    // Action: INSERT or UPSERT
    if (!item || typeof item !== 'object') {
      return NextResponse.json({ error: 'Data item wajib disertakan' }, { status: 400 });
    }

    const keys = Object.keys(item);
    if (keys.length === 0) {
      return NextResponse.json({ error: 'Item tidak memiliki kolom' }, { status: 400 });
    }

    const columns = keys.map(k => `\`${k}\``).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const updateSets = keys
      .filter(k => k !== 'id')
      .map(k => `\`${k}\` = VALUES(\`${k}\`)`)
      .join(', ');

    const values = keys.map(k => {
      const val = item[k];
      if (val === undefined || val === null) return null;
      if (typeof val === 'boolean') return val ? 1 : 0;
      if (typeof val === 'object') {
        if (val instanceof Date) return val.toISOString().slice(0, 19).replace('T', ' ');
        return JSON.stringify(val);
      }
      return val;
    });

    const query = `
      INSERT INTO \`${table}\` (${columns})
      VALUES (${placeholders})
      ON DUPLICATE KEY UPDATE
        ${updateSets || '`id` = VALUES(`id`)'}
    `;

    await pool.query(query, values);
    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    console.error('MySQL POST error:', err);
    return NextResponse.json({ error: err.message || 'Database write failed' }, { status: 500 });
  }
}
