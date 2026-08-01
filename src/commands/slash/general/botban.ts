import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../core/types/Command.js";
import { env } from "../../../core/config/env.js";
import {
  banUser,
  getUserBanReason,
  unbanUser,
} from "../../../core/managers/botBanManager.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("botban")
    .setDescription("Show, ban, or unban a user from using the bot")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("Target user ID")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Ban reason")
        .setRequired(false)
    ),

  botOwnerOnly: true,

  async execute(client, interaction) {
    if (!env.DATABASE_ENABLED) {
      await interaction.reply({
        content: "This command requires the database to be enabled.",
        flags: 64,
      });
      return;
    }

    const userId = interaction.options.getString("userid", true);
    const reason = interaction.options.getString("reason", false);

    const currentBanReason = await getUserBanReason(userId);

    if (!reason) {
      if (currentBanReason) {
        await interaction.reply({
          content: `User \`${userId}\` is bot-banned. Reason: ${currentBanReason}`,
          flags: 64,
        });
      } else {
        await interaction.reply({
          content: `User \`${userId}\` is not bot-banned.`,
          flags: 64,
        });
      }
      return;
    }

    if (currentBanReason) {
      await unbanUser(userId);

      await interaction.reply({
        content: `User \`${userId}\` has been unbanned from the bot.`,
        flags: 64,
      });
      return;
    }

    await banUser(userId, reason);

    void client;

    await interaction.reply({
      content: `User \`${userId}\` has been bot-banned. Reason: ${reason}`,
      flags: 64,
    });
  },
};

export default command;
