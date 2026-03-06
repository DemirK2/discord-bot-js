import { query } from "../database/db";

const termsCache = new Map<string, boolean>();

export async function hasAcceptedBotTerms(userId: string): Promise<boolean> {
  if (termsCache.has(userId)) {
    return termsCache.get(userId)!;
  }

  const rows: any = await query(
    "SELECT user_id FROM accepted_bot_terms WHERE user_id = ? LIMIT 1",
    [userId]
  );

  const accepted = !!rows && rows.length > 0;

  termsCache.set(userId, accepted);

  return accepted;
}

export async function acceptBotTerms(userId: string): Promise<void> {
  await query(
    `
    INSERT INTO accepted_bot_terms (user_id)
    VALUES (?)
    ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)
    `,
    [userId]
  );

  termsCache.set(userId, true);
}

export async function revokeBotTerms(userId: string): Promise<void> {
  await query("DELETE FROM accepted_bot_terms WHERE user_id = ?", [userId]);
  termsCache.set(userId, false);
}

export function clearBotTermsCache(): void {
  termsCache.clear();
}
