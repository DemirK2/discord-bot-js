import "dotenv/config";
import { readdirSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { BotClient } from "./core/client/BotClient.js";
import { env } from "./core/config/env.js";
import { initDatabase } from "./core/database/init.js";
import { registerEvent } from "./core/loaders/loadEvents.js";
import { Event } from "./core/types/Event.js";
import { PrefixCommand, SlashCommand } from "./core/types/Command.js";

const client = new BotClient();
const runtimeDirectory = dirname(fileURLToPath(import.meta.url));
const runtimeExtension = extname(fileURLToPath(import.meta.url));

function getCategoryFiles(basePath: string): string[] {
  return readdirSync(basePath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) =>
      readdirSync(join(basePath, entry.name))
        .filter((file) => file.endsWith(runtimeExtension))
        .map((file) => join(basePath, entry.name, file))
    );
}

async function loadSlashCommands(): Promise<void> {
  const basePath = join(runtimeDirectory, "commands", "slash");

  for (const filePath of getCategoryFiles(basePath)) {
    const mod = await import(pathToFileURL(filePath).href);
    const command = mod.default as SlashCommand;
    client.slashCommands.set(command.data.name, command);
  }
}

async function loadPrefixCommands(): Promise<void> {
  const basePath = join(runtimeDirectory, "commands", "prefix");

  for (const filePath of getCategoryFiles(basePath)) {
    const mod = await import(pathToFileURL(filePath).href);
    const command = mod.default as PrefixCommand;
    client.prefixCommands.set(command.name, command);
  }
}

async function loadEvents(): Promise<void> {
  const basePath = join(runtimeDirectory, "events");
  const files = readdirSync(basePath).filter((file) =>
    file.endsWith(runtimeExtension)
  );

  for (const file of files) {
    const filePath = join(basePath, file);
    const mod = await import(pathToFileURL(filePath).href);
    const event = mod.default as Event;

    registerEvent(client, event);
  }
}

async function start(): Promise<void> {
  if (env.DATABASE_ENABLED) {
    await initDatabase();
  } else {
    console.log("Database disabled; database-backed features are unavailable.");
  }

  await loadSlashCommands();
  await loadPrefixCommands();
  await loadEvents();

  await client.login(env.DISCORD_TOKEN);
}

start().catch((error) => {
  console.error("Bot failed to start:", error);
});
