import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../core/types/Command";
import {
  getUserBotPermissionLevel,
  setUserBotPermissionLevel,
} from "../../../core/managers/botPermissionManager";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("botperm")
    .setDescription("Show or change a user's bot permission level")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("Target user ID")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("permlevel")
        .setDescription("New permission level")
        .setRequired(false)
    ),

  botOwnerOnly: true,

  async execute(client, interaction) {
    const userId = interaction.options.getString("userid", true);
    const permLevel = interaction.options.getInteger("permlevel", false);

    if (permLevel === null) {
      const currentLevel = await getUserBotPermissionLevel(userId);

      await interaction.reply({
        content: `User \`${userId}\` has bot permission level \`${currentLevel}\`.`,
        flags: 64,
      });
      return;
    }

    await setUserBotPermissionLevel(userId, permLevel);

    void client;

    await interaction.reply({
      content: `User \`${userId}\` bot permission level has been set to \`${permLevel}\`.`,
      flags: 64,
    });
  },
};

export default command;
