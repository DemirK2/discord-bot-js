import { Event } from "../core/types/Event";

const event: Event = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user?.tag}`);
  },
};

export default event;
