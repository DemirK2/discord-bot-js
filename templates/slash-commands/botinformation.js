const discord = require('discord.js');

module.exports = {
    name: 'botinformation',
    description: 'Displays information about the bot',

    ownerOnly: true,
    bypassBotBan: true,

    async run (interaction, client) {
        const uptime = process.uptime();
        const uptimeDays = Math.floor((uptime % 31536000) / 86400);
        const uptimeHours = Math.floor((uptime % 86400) / 3600);
        const uptimeMinutes = Math.floor((uptime % 3600) / 60);
        const uptimeSeconds = Math.round(uptime % 60);
        const botUptime = (uptimeDays > 0 ? uptimeDays + " days, " : "") + (uptimeHours > 0 ? uptimeHours + " hours, " : "") + (uptimeMinutes > 0 ? uptimeMinutes + " minutes, " : "") + (uptimeSeconds > 0 ? uptimeSeconds + " seconds" : "");
        let commands = client.slashcommands.size + client.usercommands.size + client.messagecommands.size;
        if (client.prefixcommands) commands = commands + client.prefixcommands.size;
        const embed = new discord.EmbedBuilder()
            .setTitle("Bot Information")
            .setColor("#00FF00")
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
            .addFields(
                { name: `Bot`, value: `<@${client.user.id}>`, inline: true },
                { name: `Time`, value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
                { name: `Ping (ms)`, value: `\`${Math.floor(client.ws.ping)}\``, inline: true },
                { name: `Uptime`, value: `${botUptime}`, inline: true },
                { name: `CPU (seconds)`, value: `\`${(process.cpuUsage().user / 1000000).toFixed(2)}\``, inline: true },
                { name: `Memory (mb)`, value: `\`${Math.floor((process.memoryUsage().heapUsed / 1024) / 1024)}\``, inline: true },
                { name: `Commands`, value: `\`${commands}\``, inline: true },
                { name: `Servers`, value: `\`${client.guilds.cache.size}\``, inline: true },
                { name: `Members`, value: `\`${client.users.cache.size}\``, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL() })
        interaction.reply({ embeds: [embed], ephemeral: true });
    },

    async runInteraction (interaction, client) {
        if (interaction.componentType) {
            switch (interaction.componentType) {
                case 2:
                    const buttonID = interaction.customId;
                    // Button
                    break;
                case 3:
                    const selectMenuSelection = interaction.values[0];
                    // Select Menu
                    break;
                default:
                    client.tools.log(2, `"${this.name}" (Slash Command) tried to run a secondary interaction that does not exist.`);
                    return interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
                    break;
            }
        } else {
            if (interaction.isModalSubmit()) {
                const modalInputs = [];
                interaction.fields.components.forEach((component) => {
                    component.components.forEach((field) => {
                        const value = interaction.fields.getTextInputValue(field.customId);
                        modalInputs.push(value);
                    });
                });
                // Modal
            } else {
                client.tools.log(2, `"${this.name}" (Slash Command) tried to run a secondary interaction that does not exist.`);
                return interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
            }
        }
    }
};