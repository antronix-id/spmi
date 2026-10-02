import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getMysqlPool(): mysql.Pool | null {
  if (!pool) {
    const dbUrl = process.env.MYSQL_URL || process.env.DATABASE_URL || '';

    if (dbUrl && dbUrl.startsWith('mysql://')) {
      try {
        const url = new URL(dbUrl);
        pool = mysql.createPool({
          host: url.hostname || 'localhost',
          port: Number(url.port) || 3306,
          user: decodeURIComponent(url.username || 'root'),
          password: decodeURIComponent(url.password || ''),
          database: url.pathname.replace(/^\//, '') || 'spmi_db',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          charset: 'utf8mb4',
          dateStrings: true,
        });
      } catch (err) {
        console.error('Failed to parse MySQL DATABASE_URL:', err);
      }
    } else {
      pool = mysql.createPool({
        host: process.env.MYSQL_HOST || 'localhost',
        port: Number(process.env.MYSQL_PORT) || 3306,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'spmi_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4',
        dateStrings: true,
      });
    }
  }

  return pool;
}
