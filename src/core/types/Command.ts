import {
  ChatInputCommandInteraction,
  Message,
  PermissionResolvable,
  SlashCommandBuilder,
} from "discord.js";
import { BotClient } from "../client/BotClient";

export interface BaseCommandOptions {
  cooldown?: number;
  guildOwnerOnly?: boolean;
  botOwnerOnly?: boolean;
  guildOnly?: boolean;
  dmOnly?: boolean;
  permissions?: PermissionResolvable[];
  botPermissions?: number;
  botTerms?: boolean;
}

export interface SlashCommand extends BaseCommandOptions {
  data: SlashCommandBuilder;
  execute: (
    client: BotClient,
    interaction: ChatInputCommandInteraction
  ) => Promise<void>;
}

export interface PrefixCommand extends BaseCommandOptions {
  name: string;
  aliases?: string[];
  execute: (
    client: BotClient,
    message: Message,
    args: string[]
  ) => Promise<void>;
}

export type Command = SlashCommand | PrefixCommand;
