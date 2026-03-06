# Discord Bot JS

> ⚠️ **This repository is a template.**  
> Before running the bot you must configure the `.env` file with your own values.

![Node.js](https://img.shields.io/badge/node-20+-green)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![Database](https://img.shields.io/badge/database-MariaDB-orange)
![Docker](https://img.shields.io/badge/docker-supported-blue)

A modular **Discord bot template** built with:

- Node.js
- TypeScript
- discord.js
- MariaDB
- Docker / Portainer support

This template is designed to be reused for **multiple bots**.

---

# Features

- Slash commands
- Prefix commands
- MariaDB database
- Automatic database initialization
- Per-guild prefix system
- Cooldown system
- Bot owner system
- Guild owner checks
- Discord permission checks
- Custom bot permission levels
- Bot terms system
- Bot user ban system
- Docker / Portainer support
- Modular architecture

---

# Project Structure

```
src
│
├── app.ts
│
├── core
│   ├── client
│   ├── config
│   ├── database
│   ├── guards
│   ├── loaders
│   ├── managers
│   ├── types
│   └── utils
│
├── commands
│   ├── prefix
│   └── slash
│
├── events
│
└── deploy
```

---

# Quick Start

Run the bot quickly:

```
git clone https://github.com/DemirK2/discord-bot-js.git
cd discord-bot-js
npm install
```

Copy the environment file:

```
.env.example → .env
```

Edit `.env`.

Then run:

```
npm run deploy
npm run dev
```

Your bot should now be online.

---

# Installation

The bot can run in three ways:

- Local Node.js
- Docker
- Portainer

---

# Installation Without Docker (Local)

Clone the repository:

```
git clone https://github.com/DemirK2/discord-bot-js.git
cd discord-bot-js
```

Install dependencies:

```
npm install
```

Copy environment file:

```
.env.example → .env
```

Example `.env`:

```
DISCORD_TOKEN=
CLIENT_ID=
DEV_GUILD_ID=
BOT_OWNER_IDS=

PREFIX_DEFAULT=!

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=
```

Start the bot:

```
npm run dev
```

Production:

```
npm run build
npm start
```

Deploy commands:

```
npm run deploy
```

---

# Installation With Docker

Clone the repository:

```
git clone https://github.com/DemirK2/discord-bot-js.git
cd discord-bot-js
```

Copy environment file:

```
.env.example → .env
```

Edit `.env`:

```
DISCORD_TOKEN=
CLIENT_ID=
DEV_GUILD_ID=
BOT_OWNER_IDS=

PREFIX_DEFAULT=!

DB_USER=
DB_PASSWORD=
DB_NAME=

MARIADB_ROOT_PASSWORD=
```

Start containers:

```
docker compose up -d --build
```

This will start:

- the bot
- the MariaDB database

---

# Installation With Portainer

1. Open **Portainer**
2. Create a new **Stack**
3. Paste the contents of `docker-compose.yml`
4. Add environment variables:

```
DISCORD_TOKEN
CLIENT_ID
DEV_GUILD_ID
BOT_OWNER_IDS
DB_USER
DB_PASSWORD
DB_NAME
MARIADB_ROOT_PASSWORD
```

5. Deploy the stack.

---

# Inviting the Bot

To invite the bot to your server:

Get your **Client ID** from the Discord Developer Portal.

Invite link format:

```
https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot%20applications.commands&permissions=8
```

Replace `CLIENT_ID` with your actual client ID.

---

# Creating a Slash Command

Create a file in:

```
src/commands/slash/general/
```

Example:

```
template.ts
```

Example command:

```ts
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { SlashCommand } from "../../../core/types/Command";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("template")
    .setDescription("Example slash command"),

  cooldown: 5,

  guildOnly: true,

  permissions: [PermissionFlagsBits.Administrator],

  botPermissions: 5,

  async execute(client, interaction) {
    await interaction.reply({
      content: "Template command executed.",
      ephemeral: true
    });
  },
};

export default command;
```

---

# Creating a Prefix Command

Create a file in:

```
src/commands/prefix/general/
```

Example:

```
template.ts
```

Example command:

```ts
import { PrefixCommand } from "../../../core/types/Command";

const command: PrefixCommand = {
  name: "template",

  cooldown: 5,

  guildOnly: true,

  botPermissions: 5,

  async execute(client, message) {
    await message.reply("Template prefix command executed.");
  },
};

export default command;
```

---

# Creating an Event

Create a file in:

```
src/events/
```

Example:

```
guildCreate.ts
```

Example event:

```ts
import { Event } from "../core/types/Event";

const event: Event = {
  name: "guildCreate",

  async execute(client, guild) {
    console.log(`Joined new guild: ${guild.name}`);
  },
};

export default event;
```

---

# Using the Database

Database connection is handled automatically.

Access it via:

```
src/core/database/db.ts
```

Example query:

```ts
import { db } from "../../core/database/db";

await db.query(
  "INSERT INTO example_table (user_id) VALUES (?)",
  [userId]
);
```

---

# Bot Permission System

Users can have custom permission levels.

| Level | Meaning |
|------|--------|
| 0 | normal user |
| 3 | moderator |
| 5 | admin |
| 10 | bot owner |

Example restriction:

```
botPermissions: 5
```

User must have permission level **5 or higher**.

---

# Bot Ban System

Users can be banned from using the bot.

Commands:

```
/botban userID
```

Check ban status.

```
/botban userID reason
```

Toggle ban/unban.

---

# Cooldown System

Commands can define cooldowns.

Example:

```
cooldown: 10
```

Users must wait **10 seconds** before using the command again.

---

# Command Restrictions

Commands support several restrictions.

Example:

```ts
guildOnly: true
dmOnly: true
guildOwnerOnly: true
botOwnerOnly: true
permissions: [PermissionFlagsBits.Administrator]
botPermissions: 5
botTerms: true
```

---

# Available Restrictions

| Option | Description |
|------|-------------|
| cooldown | command cooldown |
| guildOnly | server only |
| dmOnly | DM only |
| guildOwnerOnly | only server owner |
| botOwnerOnly | only bot owners |
| permissions | Discord permissions |
| botPermissions | custom permission level |
| botTerms | requires terms acceptance |

---

# Troubleshooting

## Slash commands not appearing

Run:

```
npm run deploy
```

If using `DEV_GUILD_ID`, commands appear instantly in that server.

Global commands may take up to **1 hour**.

---

## Bot not starting

Check your `.env` file and verify:

```
DISCORD_TOKEN
CLIENT_ID
```

---

## Database errors

Make sure MariaDB is running and check:

```
DB_USER
DB_PASSWORD
DB_NAME
```

---

# Creating a New Bot From This Template

Click **Use this template** on GitHub and create a new repository.

Clone your new bot:

```
git clone https://github.com/YOUR_USERNAME/YOUR_NEW_BOT.git
```

---

# Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a branch
3. Make your changes
4. Open a pull request

---

# Support

If you encounter issues:

1. Check the **Troubleshooting** section
2. Search existing issues
3. Create a new issue if needed

Include:

- Node.js version
- OS
- Error message
- Steps to reproduce

---

# License

MIT
