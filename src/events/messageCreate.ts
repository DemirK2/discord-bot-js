import { handlePrefixCommand } from "../core/loaders/loadPrefixCommands.js";
import { Event } from "../core/types/Event.js";

const event: Event = {
  name: "messageCreate",
  async execute(client, message) {
    await handlePrefixCommand(client, message);
  },
};

export default event;
