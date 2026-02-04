import mysql from "mysql2/promise";

const isProduction = process.env.DB_HOST !== undefined;

const pool = mysql.createPool({
  host: isProduction ? process.env.DB_HOST : '127.0.0.1',
  port: isProduction ? process.env.DB_PORT : 3306,
  user: isProduction ? process.env.DB_USER : 'root',
  password: isProduction ? process.env.DB_PASSWORD : '',
  database: isProduction ? process.env.DB_NAME : 'intercorp1',

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,

  // REQUIRED for Railway / cloud MySQL
  ssl: isProduction ? { rejectUnauthorized: false } : undefined
});

// Test connection
pool.getConnection()
  .then(conn => {
    console.log("Connected to:", isProduction ? "RAILWAY DB" : "LOCAL DB");
    conn.release();
  })
  .catch(err => {
    console.error("MySQL Connection Failed:", err.message);
  });

export default pool;
