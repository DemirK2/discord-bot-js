import { BotClient } from "../client/BotClient.js";

export interface Event {
  name: string;
  once?: boolean;
  execute: (client: BotClient, ...args: any[]) => Promise<void>;
}
