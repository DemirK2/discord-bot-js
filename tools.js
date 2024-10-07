const fs = require('node:fs');

module.exports = {
    async log (type, content) {
        if (!type) return;
        if (!content) return;
        const date = new Date();
        const time = date.toLocaleString();
        const text = `${time} | ${content}`;
        switch (type) {
            default:
                console.log(text);
                break;
            /*
            1: Log
            2: Error
            3: Warning
            4: Command
            5: Button, selection, etc.
            6: Event
            7: Start
            8: Bot Moderation
            9: Server Moderation
            10: Device
            11: User: Terms of Service & Privacy Policy
            */
        };
        if (!fs.existsSync(`./logs`)) fs.mkdirSync(`./logs`);
        if (!fs.existsSync(`./logs/${date.getFullYear()}`)) fs.mkdirSync(`./logs/${date.getFullYear()}`);
        if (!fs.existsSync(`./logs/${date.getFullYear()}/${date.getMonth() + 1}`)) fs.mkdirSync(`./logs/${date.getFullYear()}/${date.getMonth() + 1}`);
        fs.appendFileSync(`./logs/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.txt`, `${text}\n`);
        return;
    },
    async modLog (client, embed) {
        if (client) {
            if (embed) {
                const modLogs = require('./settings.json').modLogs;
                if (modLogs) {
                    const modLogsGuild = require('./data/guilds.json').modLogsGuild;
                    const modGuild = await client.guilds.fetch(modLogsGuild).catch(err => {});
                    if (modGuild) {
                        const modLogsChannel = require('./data/channels.json').modLogsChannel;
                        const modChannel = await modGuild.channels.fetch(modLogsChannel).catch(err => {});
                        if (modChannel) {
                            modChannel.send({ embeds: [embed] });
                        } else {
                            client.tools.log(2, `modLogsChannel was not found!`);
                        }
                    } else {
                    client.tools.log(2, `modLogsGuild was not found!`);
                    }
                } else {
                    return;
                }
            } else {
                client.tools.log(2, `embed was not defined while trying to modLog.`);
            }
        } else {
            this.log(2, `client was not defined while trying to modLog.`);
        }
    },
    async randomNumber (minimum, maximum) {
        if (!minimum) return;
        if (!maximum) return;
        return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
    }
};