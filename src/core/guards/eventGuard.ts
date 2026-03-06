import { BotClient } from "../client/BotClient";
import { getGuildBanReason } from "../managers/botBanManager";

export interface EventGuardResult {
  allowed: boolean;
  reason?: string;
}

export async function eventGuard(
  client: BotClient,
  eventName: string,
  ...args: any[]
): Promise<EventGuardResult> {
  const firstArg = args[0];

  const guildId = firstArg?.guildId ?? firstArg?.guild?.id ?? null;

  if (guildId) {
    const guildBanReason = await getGuildBanReason(guildId);

    if (guildBanReason) {
      void client;
      void eventName;

      return {
        allowed: false,
        reason: `This server is banned from using this bot. Reason: ${guildBanReason}`,
      };
    }
  }

  void client;
  void eventName;

  return { allowed: true };
}
