import { query } from "../database/db";

const prefixCache = new Map<string, string | null>();

export async function getPrefix(guildId: string): Promise<string | null> {
  if (prefixCache.has(guildId)) {
    return prefixCache.get(guildId) ?? null;
  }

  const rows: any = await query(
    "SELECT prefix FROM guild_prefixes WHERE guild_id = ? LIMIT 1",
    [guildId]
  );

  if (!rows || rows.length === 0) {
    prefixCache.set(guildId, null);
    return null;
  }

  const prefix = rows[0].prefix as string;
  prefixCache.set(guildId, prefix);

  return prefix;
}

export async function setPrefix(
  guildId: string,
  prefix: string
): Promise<void> {
  await query(
    `
    INSERT INTO guild_prefixes (guild_id, prefix)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE prefix = VALUES(prefix)
    `,
    [guildId, prefix]
  );

  prefixCache.set(guildId, prefix);
}

export function deletePrefixCache(guildId: string): void {
  prefixCache.delete(guildId);
}

export function clearPrefixCache(): void {
  prefixCache.clear();
}
