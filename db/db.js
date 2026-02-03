// import mysql from "mysql2/promise";

// // Use Render environment variables (or fallbacks) for DB config
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: Number(process.env.DB_PORT) || 3306,
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'intercorp1',
//   waitForConnections: true,
//   connectionLimit: 5,
//   queueLimit: 0,
//   enableKeepAlive: true,       
//   keepAliveInitialDelay: 10000,

//   connectTimeout: 30000        // prevent early drop
// });

// // Test connection
// pool
//   .getConnection()
//   .then((conn) => {
//     console.log("Successfully connected to MySQL database");
//     conn.release();
//   })
//   .catch((err) => {
//     console.error("Error connecting to MySQL database:", err.message);
//   });

// export default pool;



import mysql from "mysql2/promise";

let pool;

function createPool() {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
    queueLimit: 0,

    // Keepalive and timeouts to make connections more stable on the cloud
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    connectTimeout: 30000,
    acquireTimeout: 30000
  });

  console.log("🔄 MySQL pool created");

  // Test connection immediately and log outcome
  pool.getConnection()
    .then(conn => {
      console.log('Successfully connected to MySQL database');
      conn.release();
    })
    .catch(err => {
      console.error('Error connecting to MySQL database:', err.message || err);
    });
}

createPool();

const recoverableErrors = new Set([
  "PROTOCOL_CONNECTION_LOST",
  "ECONNRESET",
  "ETIMEDOUT",
  "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"
]);

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function execute(query, params = []) {
  // Try a few times with backoff for transient connection issues
  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Obtain a fresh connection from the pool for each query to avoid using a closed socket
      const conn = await pool.getConnection();
      try {
        const res = await conn.execute(query, params);
        conn.release();
        return res;
      } catch (innerErr) {
        conn.release();
        throw innerErr;
      }
    } catch (err) {
      // If error is recoverable, attempt to recreate pool and retry
      if (err && err.code && recoverableErrors.has(err.code) && attempt < maxAttempts) {
        console.error(`♻️ MySQL transient error (${err.code}) on attempt ${attempt}. Recreating pool and retrying...`);
        try {
          // Recreate pool and wait a bit before retrying
          createPool();
        } catch (createErr) {
          console.error('Error recreating pool:', createErr);
        }
        // Exponential backoff
        await sleep(200 * attempt);
        continue;
      }

      // For non-recoverable or last attempt, rethrow so server can handle it
      console.error('MySQL execute error:', err);
      throw err;
    }
  }
}

export default { execute };
