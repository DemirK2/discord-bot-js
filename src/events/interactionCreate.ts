import { handleSlashCommand } from "../core/loaders/loadSlashCommands";
import { Event } from "../core/types/Event";

const event: Event = {
  name: "interactionCreate",
  async execute(client, interaction) {
    await handleSlashCommand(client, interaction);
  },
};

export default event;
