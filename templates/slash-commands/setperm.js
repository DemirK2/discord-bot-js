const discord = require('discord.js');

module.exports = {
    name: 'setperm',
    description: 'Set the permission level of an user',
    options: [
        {
            type: 3,
            name: 'user',
            description: "UserID",
            required: true
        },
        {
            type: 4,
            name: 'level',
            description: "Permission Level",
            required: true
        }
    ],

    ownerOnly: true,
    bypassBotBan: true,

    async run (interaction, client) {
        const args = interaction.options.data;
        let userOldPerm = await client.database.get(`users.${args[0].value}.perms`);
        if (!userOldPerm) userOldPerm = 0;
        await client.database.set(`users.${args[0].value}.perms`, args[1].value);
        const embed = new discord.EmbedBuilder()
            .setTitle("Permission Change")
            .setColor("#800080")
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .addFields(
                { name: `User`, value: `<@${args[0].value}>` },
                { name: `Old Perm`, value: `\`${userOldPerm}\``, inline: true },
                { name: `New Perm`, value: `\`${args[1].value}\``, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() })
        const modEmbed = new discord.EmbedBuilder()
            .setTitle("Permission Changed")
            .setColor("#800080")
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .addFields(
                { name: `User`, value: `<@${args[0].value}>`, inline: true },
                { name: `Old Perm`, value: `\`${userOldPerm}\``, inline: true },
                { name: `New Perm`, value: `\`${args[1].value}\``, inline: true },
                { name: `Moderator`, value: `<@${interaction.user.id}>`, inline: true },
                { name: `Time`, value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
            )
            .setTimestamp()
        client.tools.modLog(client, modEmbed);
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