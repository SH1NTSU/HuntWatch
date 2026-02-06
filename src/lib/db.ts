import { Pool } from "pg";

// For serverless environments like Vercel, we need to handle connection pooling differently
let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      // Serverless-friendly settings
      max: 1, // Limit connections in serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected database pool error:', err);
      pool = null; // Reset pool on error
    });
  }
  return pool;
}

export default getPool();
