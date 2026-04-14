import pg, { Pool } from 'pg';

export const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

pool.query("SELECT NOW()")
  .then(res => {
    console.log("✅ Conexión exitosa:", res.rows[0]);
  })
  .catch(err => {
    console.error("❌ Error:", err);
  });