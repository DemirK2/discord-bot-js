import { query } from "../database/db.js";

const bannedUserCache = new Map<string, string | null>();
const bannedGuildCache = new Map<string, string | null>();

export async function getUserBanReason(userId: string): Promise<string | null> {
  if (bannedUserCache.has(userId)) {
    return bannedUserCache.get(userId) ?? null;
  }

  const rows: any = await query(
    "SELECT reason FROM bot_banned_users WHERE user_id = ? LIMIT 1",
    [userId]
  );

  if (!rows || rows.length === 0) {
    bannedUserCache.set(userId, null);
    return null;
  }

  const reason = rows[0].reason
    ? String(rows[0].reason)
    : "No reason provided.";

  bannedUserCache.set(userId, reason);

  return reason;
}

export async function getGuildBanReason(
  guildId: string
): Promise<string | null> {
  if (bannedGuildCache.has(guildId)) {
    return bannedGuildCache.get(guildId) ?? null;
  }

  const rows: any = await query(
    "SELECT reason FROM bot_banned_guilds WHERE guild_id = ? LIMIT 1",
    [guildId]
  );

  if (!rows || rows.length === 0) {
    bannedGuildCache.set(guildId, null);
    return null;
  }

  const reason = rows[0].reason
    ? String(rows[0].reason)
    : "No reason provided.";

  bannedGuildCache.set(guildId, reason);

  return reason;
}

export async function banUser(
  userId: string,
  reason: string | null = null
): Promise<void> {
  await query(
    `
    INSERT INTO bot_banned_users (user_id, reason)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE reason = VALUES(reason)
    `,
    [userId, reason]
  );

  bannedUserCache.set(userId, reason ?? "No reason provided.");
}

export async function unbanUser(userId: string): Promise<void> {
  await query("DELETE FROM bot_banned_users WHERE user_id = ?", [userId]);
  bannedUserCache.delete(userId);
}

export async function banGuild(
  guildId: string,
  reason: string | null = null
): Promise<void> {
  await query(
    `
    INSERT INTO bot_banned_guilds (guild_id, reason)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE reason = VALUES(reason)
    `,
    [guildId, reason]
  );

  bannedGuildCache.set(guildId, reason ?? "No reason provided.");
}

export async function unbanGuild(guildId: string): Promise<void> {
  await query("DELETE FROM bot_banned_guilds WHERE guild_id = ?", [guildId]);
  bannedGuildCache.delete(guildId);
}

export function clearBotBanCaches(): void {
  bannedUserCache.clear();
  bannedGuildCache.clear();
}
