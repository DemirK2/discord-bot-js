import { query } from "./db.js";

export async function initDatabase(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS guild_prefixes (
      guild_id VARCHAR(32) PRIMARY KEY,
      prefix VARCHAR(10) NOT NULL
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS bot_banned_users (
      user_id VARCHAR(32) PRIMARY KEY,
      reason TEXT
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS bot_banned_guilds (
      guild_id VARCHAR(32) PRIMARY KEY,
      reason TEXT
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_bot_permissions (
      user_id VARCHAR(32) PRIMARY KEY,
      permission_level INT NOT NULL DEFAULT 0
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS accepted_bot_terms (
      user_id VARCHAR(32) PRIMARY KEY,
      accepted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Database tables initialized.");
}
