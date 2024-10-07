const discord = require('discord.js');

module.exports = {
    name: 'deletealldata',
    description: 'Deletes all data',

    ownerOnly: true,
    bypassBotBan: true,

    async run (interaction, client) {
        const buttonID = `continue-${interaction.user.id}-${Date.now() + 15000}`;
        const embed = new discord.EmbedBuilder()
            .setTitle("!!! Delete All Data !!!")
            .setColor("#FF0000")
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setDescription("You are about to delete all data from the bot!!!\nThis action cannot be undone if you do not have a backup of the following file:\n`data/quickdb.sqlite`")
        const continueButton = new discord.ButtonBuilder()
            .setCustomId(buttonID)
            .setLabel('Continue')
            .setStyle(discord.ButtonStyle.Danger)
        const row = new discord.ActionRowBuilder().addComponents(continueButton);
        interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    },

    async runInteraction (interaction, client) {
        if (interaction.componentType) {
            switch (interaction.componentType) {
                case 2:
                    const buttonID = interaction.customId;
                    // Button
                    const buttonIDs = buttonID.split('-');
                    if (buttonIDs[0] == "continue") {
                        if (buttonIDs[1] == interaction.user.id) {
                            if (Date.now() < buttonIDs[2]) {
                                await client.database.deleteAll();
                                client.tools.log(1, `'${interaction.user.tag}' [${interaction.user.id}] has deleted all data.`);
                                interaction.reply({ content: "Successfully deleted all data.", ephemeral: true });
                            } else {
                                interaction.reply({ content: "You took too long to respond, please use the command again.", ephemeral: true });
                            }
                        } else {
                            client.tools.log(2, `Something went wrong with "${this.name}" (Slash Command)'s extra interaction: 'button'.`);
                            interaction.reply({ content: "Something went wrong!", ephemeral: true });
                        }
                    } else {
                        client.tools.log(2, `Something went wrong with "${this.name}" (Slash Command)'s extra interaction: 'button'.`);
                        interaction.reply({ content: "Something went wrong!", ephemeral: true });
                    }
                    //
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