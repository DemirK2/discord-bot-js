import mariadb from "mariadb";
import { env } from "../config/env.js";

export const pool = env.DATABASE_ENABLED
  ? mariadb.createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      connectionLimit: 5,
    })
  : null;

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  if (!pool) {
    throw new Error("Database is disabled. Set DATABASE_ENABLED=true to use it.");
  }

  let conn;

  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, params);
    return result;
  } finally {
    if (conn) conn.release();
  }
}
