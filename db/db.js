import mysql from "mysql2/promise";

// Use Render environment variables (or fallbacks) for DB config
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'intercorp1',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  enableKeepAlive: true,       
  keepAliveInitialDelay: 10000,

  connectTimeout: 30000        // prevent early drop
});

// Test connection
pool
  .getConnection()
  .then((conn) => {
    console.log("Successfully connected to MySQL database");
    conn.release();
  })
  .catch((err) => {
    console.error("Error connecting to MySQL database:", err.message);
  });

export default pool;


