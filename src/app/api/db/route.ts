import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Singleton PostgreSQL connection pool for Next.js API Route
let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || '';
    if (!connectionString) return null;
    
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false }
    });
  }
  return pool;
}

// GET: Fetch records from a table
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table');

    if (!table) {
      return NextResponse.json({ error: 'Parameter table wajib disertakan' }, { status: 400 });
    }

    const p = getPool();
    if (!p) {
      return NextResponse.json({ error: 'DATABASE_URL belum dikonfigurasi' }, { status: 500 });
    }

    // Sanitize table name to prevent SQL injection
    const allowedTables = [
      'accreditations',
      'documents',
      'document_access_keys',
      'monitoring_data',
      'regulations',
      'contact_messages',
      'pages_content',
      'users_admin'
    ];

    if (!allowedTables.includes(table)) {
      return NextResponse.json({ error: 'Tabel tidak diizinkan' }, { status: 403 });
    }

    const result = await p.query(`SELECT * FROM "${table}"`);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (err: any) {
    console.error('Database GET error:', err);
    return NextResponse.json({ error: err.message || 'Database query failed' }, { status: 500 });
  }
}

// POST: Insert or Upsert record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { table, item, action, id } = body;

    const p = getPool();
    if (!p) {
      return NextResponse.json({ error: 'DATABASE_URL belum dikonfigurasi' }, { status: 500 });
    }

    const allowedTables = [
      'accreditations',
      'documents',
      'document_access_keys',
      'monitoring_data',
      'regulations',
      'contact_messages',
      'pages_content',
      'users_admin'
    ];

    if (!allowedTables.includes(table)) {
      return NextResponse.json({ error: 'Tabel tidak diizinkan' }, { status: 403 });
    }

    if (action === 'delete') {
      await p.query(`DELETE FROM "${table}" WHERE id = $1`, [id]);
      return NextResponse.json({ success: true });
    }

    // Dynamic Upsert for PostgreSQL
    const keys = Object.keys(item);
    const values = Object.values(item);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const updateSets = keys.map(k => `"${k}" = EXCLUDED."${k}"`).join(', ');

    const query = `
      INSERT INTO "${table}" (${columns})
      VALUES (${placeholders})
      ON CONFLICT (id) DO UPDATE SET
        ${updateSets}
    `;

    await p.query(query, values);
    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    console.error('Database POST error:', err);
    return NextResponse.json({ error: err.message || 'Database write failed' }, { status: 500 });
  }
}
