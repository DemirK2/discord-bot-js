const discord = require('discord.js');

module.exports = {
    name: 'template',
    description: 'This is a slash command template',
    options: [
        {
            type: 3,
            name: 'string',
            description: "String Field",
            required: true
        },
        {
            type: 4,
            name: 'integer',
            description: "Integer Field",
            required: true
        },
        {
            type: 5,
            name: 'boolean',
            description: "Boolean Field",
            required: false
        },
        {
            type: 6,
            name: 'user',
            description: "User Field",
            required: false
        },
        {
            type: 7,
            name: 'channel',
            description: "Channel Field",
            required: false
        },
        {
            type: 8,
            name: 'role',
            description: "Role Field",
            required: false
        }
    ],

    ownerOnly: true,
    perms: 10,
    bypassBotBan: true,
    guildOnly: true,
    guildOwnerOnly: true,
    guildRoles: ["owner", "admin"],
    ignoreGuildOwnerRoles: true,
    ignoreGuildAdminRoles: true,
    guildPerms: 6,
    requireToS: true,
    cooldown: 15,

    async run (interaction, client) {
        const args = interaction.options.data;
        client.tools.log(1, args[0].value);
        interaction.reply({ content: "Hello!" });
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