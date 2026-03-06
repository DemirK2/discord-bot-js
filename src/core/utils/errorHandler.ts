import { ChatInputCommandInteraction, Message } from "discord.js";

export async function handleCommandError(
  target: ChatInputCommandInteraction | Message,
  error: unknown
): Promise<void> {
  console.error("Command error:", error);

  const replyText = "An unexpected error occurred while running this command.";

  if ("author" in target) {
    if (!target.author.bot) {
      await target.reply(replyText).catch(() => null);
    }
    return;
  }

  if (target.replied || target.deferred) {
    await target
      .followUp({
        content: replyText,
        flags: 64,
      })
      .catch(() => null);
  } else {
    await target
      .reply({
        content: replyText,
        flags: 64,
      })
      .catch(() => null);
  }
}
