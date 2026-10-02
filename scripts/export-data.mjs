import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const { Client } = pg;

async function dumpDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    const tableNamesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tables = tableNamesRes.rows.map(r => r.table_name);
    console.log('Public tables found:', tables);

    const dump = {};
    for (const t of tables) {
      const res = await client.query(`SELECT * FROM "${t}"`);
      dump[t] = res.rows;
      console.log(`Table ${t}: ${res.rows.length} rows`);
    }

    const outputPath = path.resolve('scripts', 'exported_db.json');
    fs.writeFileSync(outputPath, JSON.stringify(dump, null, 2), 'utf-8');
    console.log('Database dump saved to:', outputPath);
  } catch (err) {
    console.error('Error dumping database:', err);
  } finally {
    await client.end();
  }
}

dumpDb();
