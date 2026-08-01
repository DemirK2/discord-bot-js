import { Event } from "../core/types/Event.js";

const event: Event = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user?.tag}`);
  },
};

export default event;
