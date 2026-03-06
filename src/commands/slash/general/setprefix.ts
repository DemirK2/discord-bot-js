import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../core/types/Command";
import { setPrefix } from "../../../core/managers/prefixManager";

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
