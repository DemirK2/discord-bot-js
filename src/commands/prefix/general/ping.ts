import { PrefixCommand } from "../../../core/types/Command";

const command: PrefixCommand = {
  name: "ping",
  aliases: ["p"],

  async execute(client, message, args) {
    void client;
    void args;
    await message.reply("Pong!");
  },
};

export default command;
