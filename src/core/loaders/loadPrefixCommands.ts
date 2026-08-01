import { Message } from "discord.js";
import { BotClient } from "../client/BotClient.js";
import { env } from "../config/env.js";
import { commandGuard } from "../guards/commandGuard.js";
import { getPrefix } from "../managers/prefixManager.js";
import { handleCommandError } from "../utils/errorHandler.js";

async function getGuildPrefix(guildId: string | null): Promise<string | null> {
  if (!guildId) return null;

  if (!env.DATABASE_ENABLED) return env.PREFIX_DEFAULT;

  const prefix = await getPrefix(guildId);

  if (!prefix) {
    return env.PREFIX_DEFAULT;
  }

  return prefix;
}

export async function handlePrefixCommand(
  client: BotClient,
  message: Message
): Promise<void> {
  if (message.author.bot) return;

  const prefix = await getGuildPrefix(message.guild?.id ?? null);
  if (!prefix) return;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const command =
    client.prefixCommands.get(commandName) ||
    client.prefixCommands.find((cmd) => cmd.aliases?.includes(commandName));

  if (!command) return;

  const guard = await commandGuard(client, command, message);
  if (!guard.allowed) {
    await message.reply(guard.reason || "Blocked.");
    return;
  }

  try {
    await command.execute(client, message, args);
  } catch (error) {
    await handleCommandError(message, error);
  }
}
