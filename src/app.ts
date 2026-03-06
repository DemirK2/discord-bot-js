import "dotenv/config";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { BotClient } from "./core/client/BotClient";
import { env } from "./core/config/env";
import { initDatabase } from "./core/database/init";
import { registerEvent } from "./core/loaders/loadEvents";
import { Event } from "./core/types/Event";
import { PrefixCommand, SlashCommand } from "./core/types/Command";

const client = new BotClient();

async function loadSlashCommands(): Promise<void> {
  const basePath = join(process.cwd(), "src", "commands", "slash");
  const categories = readdirSync(basePath);

  for (const category of categories) {
    const categoryPath = join(basePath, category);
    const files = readdirSync(categoryPath).filter((file) =>
      file.endsWith(".ts")
    );

    for (const file of files) {
      const filePath = join(categoryPath, file);
      const mod = await import(filePath);
      const command = mod.default as SlashCommand;

      client.slashCommands.set(command.data.name, command);
    }
  }
}

async function loadPrefixCommands(): Promise<void> {
  const basePath = join(process.cwd(), "src", "commands", "prefix");
  const categories = readdirSync(basePath);

  for (const category of categories) {
    const categoryPath = join(basePath, category);
    const files = readdirSync(categoryPath).filter((file) =>
      file.endsWith(".ts")
    );

    for (const file of files) {
      const filePath = join(categoryPath, file);
      const mod = await import(filePath);
      const command = mod.default as PrefixCommand;

      client.prefixCommands.set(command.name, command);
    }
  }
}

async function loadEvents(): Promise<void> {
  const basePath = join(process.cwd(), "src", "events");
  const files = readdirSync(basePath).filter((file) => file.endsWith(".ts"));

  for (const file of files) {
    const filePath = join(basePath, file);
    const mod = await import(filePath);
    const event = mod.default as Event;

    registerEvent(client, event);
  }
}

async function start(): Promise<void> {
  await initDatabase();

  await loadSlashCommands();
  await loadPrefixCommands();
  await loadEvents();

  await client.login(env.DISCORD_TOKEN);
}

start().catch((error) => {
  console.error("Bot failed to start:", error);
});
