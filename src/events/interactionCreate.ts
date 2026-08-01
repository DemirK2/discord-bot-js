import { handleSlashCommand } from "../core/loaders/loadSlashCommands.js";
import { Event } from "../core/types/Event.js";

const event: Event = {
  name: "interactionCreate",
  async execute(client, interaction) {
    await handleSlashCommand(client, interaction);
  },
};

export default event;
