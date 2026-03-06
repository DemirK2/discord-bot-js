const cooldowns = new Map<string, number>();

export function getCooldownRemaining(
  userId: string,
  commandName: string,
  cooldownSeconds: number
): number {
  const key = `${userId}:${commandName}`;
  const now = Date.now();

  if (!cooldowns.has(key)) {
    cooldowns.set(key, now);
    return 0;
  }

  const lastUsed = cooldowns.get(key)!;
  const expires = lastUsed + cooldownSeconds * 1000;

  if (now >= expires) {
    cooldowns.set(key, now);
    return 0;
  }

  return Math.ceil((expires - now) / 1000);
}

export function clearCooldowns(): void {
  cooldowns.clear();
}
