import { Interaction } from "discord.js";
import { BotClient } from "../client/BotClient";
import { commandGuard } from "../guards/commandGuard";
import { handleCommandError } from "../utils/errorHandler";

export async function handleSlashCommand(
  client: BotClient,
  interaction: Interaction
): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  const guard = await commandGuard(client, command, interaction);
  if (!guard.allowed) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: guard.reason || "Blocked.",
        flags: 64,
      });
    } else {
      await interaction.reply({
        content: guard.reason || "Blocked.",
        flags: 64,
      });
    }
    return;
  }

  try {
    await command.execute(client, interaction);
  } catch (error) {
    await handleCommandError(interaction, error);
  }
}
