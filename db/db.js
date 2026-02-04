import mysql from "mysql2/promise";

// Use Render environment variables (or fallbacks) for DB config
const pool = mysql.createPool({
  host:  '127.0.0.1',
  port: 3306,
  user:  'root',
  password: '',
  database: 'intercorp1',
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

