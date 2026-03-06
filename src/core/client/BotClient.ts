import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import { PrefixCommand, SlashCommand } from "../types/Command";

export class BotClient extends Client {
  public slashCommands = new Collection<string, SlashCommand>();
  public prefixCommands = new Collection<string, PrefixCommand>();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [Partials.Channel],
    });
  }
}
