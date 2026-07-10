import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/edis_dashboard',
});

export default pool;
