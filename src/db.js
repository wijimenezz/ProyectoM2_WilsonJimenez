import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Error conectando a DB:", err.message);
  } else {
    client.query("SELECT current_database()", (err, result) => {
      release();
      console.log("✅ Conectado a DB:", result.rows[0].current_database);
    });
  }
});
