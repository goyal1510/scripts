import "dotenv/config";
import pg from "pg";

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in environment");
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

export async function query(sql, params) {
  const result = await pool.query(sql, params);
  return result;
}

export async function end() {
  await pool.end();
}
