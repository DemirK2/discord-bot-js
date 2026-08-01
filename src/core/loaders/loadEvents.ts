import { BotClient } from "../client/BotClient.js";
import { eventGuard } from "../guards/eventGuard.js";
import { Event } from "../types/Event.js";
import { handleEventError } from "../utils/eventErrorHandler.js";

export function registerEvent(client: BotClient, event: Event): void {
  const wrapped = async (...args: any[]): Promise<void> => {
    try {
      const guard = await eventGuard(client, event.name, ...args);
      if (!guard.allowed) return;

      await event.execute(client, ...args);
    } catch (error) {
      await handleEventError(event.name, error);
    }
  };

  if (event.once) {
    client.once(event.name, wrapped);
  } else {
    client.on(event.name, wrapped);
  }
}
