import pg from 'pg';
 
const pool = new pg.Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export default pool;