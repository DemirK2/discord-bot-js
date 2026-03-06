import { REST, Routes } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { env } from "../core/config/env";

async function deployCommands(): Promise<void> {
  const commands: any[] = [];

  const basePath = join(process.cwd(), "src", "commands", "slash");
  const categories = readdirSync(basePath);

  for (const category of categories) {
    const categoryPath = join(basePath, category);
    const files = readdirSync(categoryPath).filter((f) => f.endsWith(".ts"));

    for (const file of files) {
      const filePath = join(categoryPath, file);
      const mod = await import(filePath);
      const command = mod.default;

      commands.push(command.data.toJSON());
    }
  }

  const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

  console.log(`Deploying ${commands.length} slash commands...`);

  if (env.DEV_GUILD_ID) {
    console.log(`Deploying to DEV guild: ${env.DEV_GUILD_ID}`);

    await rest.put(
      Routes.applicationGuildCommands(env.CLIENT_ID, env.DEV_GUILD_ID),
      { body: commands }
    );

    console.log("DEV guild commands deployed.");
  }

  console.log("Deploying global commands...");

  await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
    body: commands,
  });

  console.log("Global commands deployed.");
}

deployCommands().catch(console.error);
