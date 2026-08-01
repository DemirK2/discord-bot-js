import {
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { SlashCommand } from "../../../core/types/Command.js";
import { env } from "../../../core/config/env.js";
import {
  acceptBotTerms,
  hasAcceptedBotTerms,
} from "../../../core/managers/botTermsManager.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("terms")
    .setDescription("View or accept the bot terms")
    .addSubcommand((sub) =>
      sub.setName("view").setDescription("View the bot terms")
    )
    .addSubcommand((sub) =>
      sub
        .setName("accept")
        .setDescription("Accept the bot terms")
    ),

  async execute(client, interaction) {
    const sub = interaction.options.getSubcommand(true);

    const userId = interaction.user.id;

    if (sub === "accept") {
      if (!env.DATABASE_ENABLED) {
        await interaction.reply({
          content: "Accepting terms requires the database to be enabled.",
          flags: 64,
        });
        return;
      }

      const accepted = await hasAcceptedBotTerms(userId);

      if (accepted) {
        await interaction.reply({
          content: "You have already accepted the bot terms.",
          ephemeral: true,
        });
        return;
      }

      await acceptBotTerms(userId);

      await interaction.reply({
        content: "You have accepted the bot terms.",
        ephemeral: true,
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Bot Terms of Service")
      .setDescription(
        [
          "By using this bot you agree to the following terms:",
          "",
          "• Do not abuse or spam commands",
          "• Do not attempt to break the bot",
          "• Do not use the bot for illegal activities",
          "• The bot owner may restrict access at any time",
          "",
          "Use `/terms accept` to accept these terms.",
        ].join("\n")
      )
      .setColor(0x5865f2);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });

    void client;
  },
};

export default command;
