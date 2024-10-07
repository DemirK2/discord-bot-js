const discord = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async run(client) {
        client.tools.log(7, `${client.user.tag} [${client.user.id}] is now running.`);
        async function log (client) {
            const readyWarnings = require('../settings.json').readyWarnings;
            if (readyWarnings) {
                const readyWarningsGuild = require('../data/guilds.json').readyWarningsGuild;
                if (readyWarningsGuild) {
                    const readyGuild = await client.guilds.fetch(readyWarningsGuild).catch(err => {});
                    if (readyGuild) {
                        const readyWarningsChannel = require('../data/channels.json').readyWarningsChannel;
                        if (readyWarningsChannel) {
                            const readyChannel = await readyGuild.channels.fetch(readyWarningsChannel).catch(err => {});
                            if (readyChannel) {
                                const readyEmbed = new discord.EmbedBuilder()
                                    .setTitle("Bot Started")
                                    .setColor("#00FF00")
                                    .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
                                    .addFields(
                                        { name: `User`, value: `<@${client.user.id}>`, inline: true },
                                        { name: `Time`, value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                                    )
                                    .setTimestamp()
                                    .setFooter({ text: readyGuild.name, iconURL: readyGuild.iconURL() })
                                readyChannel.send({ embeds: [readyEmbed] });
                            } else {
                                client.tools.log(2, `readyWarningsChannel was not found!`);
                            }
                        } else {
                            client.tools.log(2, `readyWarningsChannel was left empty!`);
                        }
                    } else {
                        client.tools.log(2, `readyWarningsGuild was not found!`);
                    }
                } else {
                    client.tools.log(2, `readyWarningsGuild was left empty!`);
                }
            }
            const modLogs = require('../settings.json').modLogs;
            if (modLogs) {
                const modLogsGuild = require('../data/guilds.json').modLogsGuild;
                if (modLogsGuild) {
                    const modGuild = await client.guilds.fetch(modLogsGuild).catch(err => {});
                    if (modGuild) {
                        const modLogsChannel = require('../data/channels.json').modLogsChannel;
                        if (modLogsChannel) {
                            const modChannel = await modGuild.channels.fetch(modLogsChannel).catch(err => {});
                            if (!modChannel) client.tools.log(2, `modLogsChannel was not found!`);
                        } else {
                            client.tools.log(2, `modLogsChannel was left empty!`);
                        }
                    } else {
                        client.tools.log(2, `modLogsGuild was not found!`);
                    }
                } else {
                    client.tools.log(2, `modLogsGuild was left empty!`);
                }
            }
        };
        log(client);
        async function registerCommands (client) {
            await client.application.commands.set(client.slashcommands);
        };
        registerCommands(client);
        async function fetch (client) {
        };
        fetch(client);
        async function checkDatabase (client) {
        };
        checkDatabase(client);
        async function setActivity (client) {
            /*
            client.user.setPresence({
            activities: [{
            name: "asd",
            type: discord.ActivityType.Watching
            }],
            status: 'dnd'
            });
            */
            const activitySet = require('../settings.json').activity.set;
            if (activitySet) {
                let activityStatus = require('../settings.json').activity.status;
                if (activityStatus) {
                    activityStatus = activityStatus.toLowerCase();
                    let activityStatusCheck = false;
                    switch (activityStatus) {
                        case "online":
                            activityStatusCheck = true;
                            break;
                        case "offline":
                            activityStatusCheck = true;
                            break;
                        case "idle":
                            activityStatusCheck = true;
                            break;
                        case "dnd":
                            activityStatusCheck = true;
                            break;
                    }
                    if (activityStatusCheck) {
                        let activityType = require('../settings.json').activity.type;
                        if (activityType) {
                            activityType = activityType.toLowerCase();
                            let activityTypeID;
                            switch (activityType) {
                                case "playing":
                                    activityTypeID = 0;
                                    break;
                                case "streaming":
                                    activityTypeID = 1;
                                    break;
                                case "listening":
                                    activityTypeID = 2;
                                    break;
                                case "watching":
                                    activityTypeID = 3;
                                    break;
                                case "custom":
                                    activityTypeID = 4;
                                    break;
                                case "competing":
                                    activityTypeID = 5;
                                    break;
                            }
                            if (activityTypeID || activityTypeID == 0) {
                                const activityContent = require('../settings.json').activity.content;
                                if (activityContent) {
                                    if (activityTypeID == discord.ActivityType.Streaming) {
                                        const activityStreamURL = require('../settings.json').activity.streamURL;
                                        if (activityStreamURL) {
                                            client.user.setPresence({
                                                activities: [{
                                                    name: activityContent,
                                                    type: activityTypeID,
                                                    url: activityStreamURL
                                                }],
                                                status: activityStatus
                                            });
                                        } else {
                                            client.tools.log(2, `activity.streamURL was left empty.`);
                                        }
                                    } else {
                                        client.user.setPresence({
                                            activities: [{
                                                name: activityContent,
                                                type: activityTypeID
                                            }],
                                            status: activityStatus
                                        });
                                    }
                                } else {
                                    client.tools.log(2, `activity.content was left empty.`);
                                }
                            } else {
                                client.tools.log(2, `activity.type was set to an unknown type.`);
                            }
                        } else {
                            client.tools.log(2, `activity.type was left empty.`);
                        }
                    } else {
                        client.tools.log(2, `activity.status was set to an unknown type.`);
                    }
                } else {
                    client.tools.log(2, `activity.status was left empty.`);
                }
            }
        };
        setActivity(client);
    }
};