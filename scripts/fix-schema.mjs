import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const { Client } = pg;
const databaseUrl = process.env.DATABASE_URL;

async function fix() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await client.query(`
      ALTER TABLE documents ALTER COLUMN updated_at SET DEFAULT NOW();
      ALTER TABLE documents ALTER COLUMN updated_at DROP NOT NULL;
    `);
    console.log('✅ documents updated_at set to default now and nullable');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

fix();
