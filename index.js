const discord = require('discord.js');
const fs = require('node:fs');
const QuickDB = require('quick.db');

const intents = [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.GuildModeration,
    discord.GatewayIntentBits.GuildEmojisAndStickers,
    discord.GatewayIntentBits.GuildIntegrations,
    discord.GatewayIntentBits.GuildWebhooks,
    discord.GatewayIntentBits.GuildInvites,
    discord.GatewayIntentBits.GuildVoiceStates,
    discord.GatewayIntentBits.GuildPresences,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.GuildMessageTyping,
    discord.GatewayIntentBits.DirectMessages,
    discord.GatewayIntentBits.DirectMessageReactions,
    discord.GatewayIntentBits.DirectMessageTyping,
    discord.GatewayIntentBits.MessageContent,
    discord.GatewayIntentBits.GuildScheduledEvents,
    discord.GatewayIntentBits.AutoModerationConfiguration,
    discord.GatewayIntentBits.AutoModerationExecution,
    discord.GatewayIntentBits.GuildMessagePolls,
    discord.GatewayIntentBits.DirectMessagePolls
];

const client = new discord.Client({ intents: intents });

client.config = require('./config.json');
client.tools = require('./tools');
client.database = new QuickDB.QuickDB({ filePath: './data/quickdb.sqlite' });

client.slashcommands = new discord.Collection();
client.usercommands = new discord.Collection();
client.messagecommands = new discord.Collection();

const slashCommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));
const userCommandFiles = fs.readdirSync('./commands/user').filter(file => file.endsWith('.js'));
const messageCommandFiles = fs.readdirSync('./commands/message').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of slashCommandFiles) {
    const slashCommand = require(`./commands/slash/${file}`);
    client.slashcommands.set(slashCommand.name, slashCommand);
};

for (const file of userCommandFiles) {
    const userCommand = require(`./commands/user/${file}`);
    client.usercommands.set(userCommand.name, userCommand);
};

for (const file of messageCommandFiles) {
    const messageCommand = require(`./commands/message/${file}`);
    client.messagecommands.set(messageCommand.name, messageCommand);
};

if (client.config.prefix.length > 0) {
    client.prefixcommands = new discord.Collection();
    const prefixCommandFiles = fs.readdirSync('./commands/prefix').filter(file => file.endsWith('.js'));
    for (const file of prefixCommandFiles) {
        const prefixCommand = require(`./commands/prefix/${file}`);
        client.prefixcommands.set(prefixCommand.name, prefixCommand);
    };
}

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.run(...args, client));
    } else {
        client.on(event.name, (...args) => event.run(...args, client));
    }
};

client.login(client.config.botToken);