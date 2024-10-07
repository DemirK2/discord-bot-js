const discord = require('discord.js');

module.exports = {
    name: 'botban',
    description: 'Ban an user from using the bot',
    options: [
        {
            type: 3,
            name: 'user',
            description: "UserID",
            required: true
        },
        {
            type: 3,
            name: 'reason',
            description: "Reason for the ban",
            required: true
        }
    ],

    perms: 90,
    bypassBotBan: true,

    async run (interaction, client) {
        const args = interaction.options.data;
        const userOldBan = await client.database.get(`users.${args[0].value}.botban`);
        const modEmbed = new discord.EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .addFields(
                { name: `User`, value: `<@${args[0].value}>` },
                { name: `Reason`, value: `\`${args[1].value}\`` }
            )
            .setTimestamp()
        if (userOldBan) {
            await client.database.delete(`users.${args[0].value}.botban`);
            modEmbed.setTitle("User Bot-Unbanned");
            modEmbed.setColor("#FFFFFF");
        } else {
            await client.database.set(`users.${args[0].value}.botban`, true);
            modEmbed.setTitle("User Bot-Banned");
            modEmbed.setColor("#FF0000");
        }
        modEmbed.addFields(
            { name: `Moderator`, value: `<@${interaction.user.id}>`, inline: true },
            { name: `Time`, value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
        )
        client.tools.modLog(client, modEmbed);
        interaction.reply({ content: "Done.", ephemeral: true });
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