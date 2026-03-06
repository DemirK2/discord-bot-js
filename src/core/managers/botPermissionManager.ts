import { query } from "../database/db";

const permissionCache = new Map<string, number>();

export async function getUserBotPermissionLevel(
  userId: string
): Promise<number> {
  if (permissionCache.has(userId)) {
    return permissionCache.get(userId)!;
  }

  const rows: any = await query(
    "SELECT permission_level FROM user_bot_permissions WHERE user_id = ? LIMIT 1",
    [userId]
  );

  if (!rows || rows.length === 0) {
    permissionCache.set(userId, 0);
    return 0;
  }

  const level = Number(rows[0].permission_level) || 0;

  permissionCache.set(userId, level);

  return level;
}

export async function setUserBotPermissionLevel(
  userId: string,
  level: number
): Promise<void> {
  await query(
    `
    INSERT INTO user_bot_permissions (user_id, permission_level)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE permission_level = VALUES(permission_level)
    `,
    [userId, level]
  );

  permissionCache.set(userId, level);
}

export async function removeUserBotPermissionLevel(
  userId: string
): Promise<void> {
  await query("DELETE FROM user_bot_permissions WHERE user_id = ?", [userId]);
  permissionCache.delete(userId);
}

export function clearBotPermissionCache(): void {
  permissionCache.clear();
}
