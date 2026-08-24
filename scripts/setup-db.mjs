import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const { Client } = pg;
const databaseUrl = process.env.DATABASE_URL;

async function setup() {
  if (!databaseUrl) {
    console.error('DATABASE_URL is missing in .env.local');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL database!');

    // 1. Create org_members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS org_members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        division TEXT NOT NULL,
        email TEXT,
        photo_url TEXT,
        nip TEXT,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ Table org_members ensured');

    // 2. Ensure pages_content table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pages_content (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        subtitle TEXT,
        content JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ Table pages_content ensured');

    // 3. Ensure document_access_keys table
    await client.query(`
      CREATE TABLE IF NOT EXISTS document_access_keys (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        label TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        expires_at TIMESTAMPTZ,
        max_uses INTEGER,
        used_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_by TEXT,
        note TEXT
      );
    `);
    console.log('✅ Table document_access_keys ensured');

    // 4. Disable RLS and grant all permissions to anon, authenticated, service_role on all tables
    const allTables = [
      'accreditations',
      'documents',
      'document_access_keys',
      'monitoring_data',
      'regulations',
      'contact_messages',
      'pages_content',
      'org_members',
      'users_admin'
    ];

    for (const t of allTables) {
      await client.query(`ALTER TABLE IF EXISTS ${t} DISABLE ROW LEVEL SECURITY;`);
      await client.query(`GRANT ALL ON TABLE ${t} TO anon, authenticated, service_role;`);
    }
    console.log('✅ All 9 tables have RLS disabled and full CRUD granted to anon, authenticated, service_role!');

  } catch (err) {
    console.error('Error setting up tables:', err);
  } finally {
    await client.end();
  }
}

setup();
