import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.IS_PROD === 'true' ? { rejectUnauthorized: false } : false,
});

export default pool;
