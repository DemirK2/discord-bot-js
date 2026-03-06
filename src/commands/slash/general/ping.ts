import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../core/types/Command";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  async execute(client, interaction) {
    void client;
    await interaction.reply("Pong!");
  },
};

export default command;
