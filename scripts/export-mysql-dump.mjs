import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function updateDump() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'spmi-unpal'
  });

  const tables = [
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

  const dump = {};
  for (const t of tables) {
    const [rows] = await conn.query(`SELECT * FROM \`${t}\``);
    dump[t] = rows;
  }

  fs.writeFileSync(path.resolve('scripts', 'exported_db.json'), JSON.stringify(dump, null, 2), 'utf-8');
  console.log('✅ Updated `exported_db.json` with local `/uploads/` URLs!');
  await conn.end();
}

updateDump();
