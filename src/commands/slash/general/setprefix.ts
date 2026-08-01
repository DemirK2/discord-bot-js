import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../core/types/Command.js";
import { env } from "../../../core/config/env.js";
import { setPrefix } from "../../../core/managers/prefixManager.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("setprefix")
    .setDescription("Set the server prefix")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("prefix")
        .setDescription("New prefix")
        .setRequired(true)
        .setMaxLength(10)
    ),

  guildOnly: true,
  permissions: [PermissionFlagsBits.Administrator],

  async execute(client, interaction) {
    if (!env.DATABASE_ENABLED) {
      await interaction.reply({
        content:
          "Custom server prefixes require the database to be enabled. Using the default prefix.",
        flags: 64,
      });
      return;
    }

    const prefix = interaction.options.getString("prefix", true);
    const guildId = interaction.guildId;

    if (!guildId) {
      await interaction.reply({
        content: "This command can only be used in a server.",
        flags: 64,
      });
      return;
    }

    await setPrefix(guildId, prefix);

    void client;

    await interaction.reply(`Prefix set to: \`${prefix}\``);
  },
};

export default command;
