import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'intercorp1',
    multipleStatements: true
  };

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf8');

    // Split statements by semicolon, but be careful with nested semicolons (e.g. in triggers or functions)
    // However, for most simple schemas multipleStatements: true handles the whole string.
    await connection.query(schema);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit(0);
  }
}

initDB();
