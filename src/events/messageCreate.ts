import { handlePrefixCommand } from "../core/loaders/loadPrefixCommands";
import { Event } from "../core/types/Event";

const event: Event = {
  name: "messageCreate",
  async execute(client, message) {
    await handlePrefixCommand(client, message);
  },
};

export default event;
