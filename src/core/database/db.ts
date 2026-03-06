import mariadb from "mariadb";
import { env } from "../config/env";

export const pool = mariadb.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  connectionLimit: 5,
});

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  let conn;

  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } finally {
    if (conn) conn.release();
  }
}
