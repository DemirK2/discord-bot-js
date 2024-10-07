const discord = require('discord.js');

module.exports = {
    name: 'accepttos',
    description: 'Accept the Terms of Service and Privacy Policy of this bot',

    cooldown: 60,

    async run (interaction, client) {
        const supportLink = ""; // Leave empty to not add a link button
        const terms = "";
        const cooldown = (this.cooldown - 5) * 1000;
        const buttonID = `accept-${interaction.user.id}-${Date.now() + cooldown}`;
        const embed = new discord.EmbedBuilder()
            .setTitle("Terms of Service / Privacy Policy")
            .setColor("#00FF00")
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL() })
        const acceptButton = new discord.ButtonBuilder()
            .setCustomId(buttonID)
            .setLabel('Accept')
            .setStyle(discord.ButtonStyle.Primary)
        if (terms) {
            embed.setDescription(terms);
            if (supportLink) {
                const supportButton = new discord.ButtonBuilder()
                    .setURL(supportLink)
                    .setLabel('Support')
                    .setStyle(discord.ButtonStyle.Link)
                const row = new discord.ActionRowBuilder().addComponents(acceptButton, supportButton);
                interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            } else {
                const row = new discord.ActionRowBuilder().addComponents(acceptButton);
                interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
            }
        } else {
            client.tools.log(2, `terms was left empty in "${this.name}" (Slash Command).`);
            interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
        }
    },

    async runInteraction (interaction, client) {
        if (interaction.componentType) {
            switch (interaction.componentType) {
                case 2:
                    const buttonID = interaction.customId;
                    // Button
                    const buttonIDs = buttonID.split('-');
                    if (buttonIDs[0] == "accept") {
                        if (buttonIDs[1] == interaction.user.id) {
                            if (Date.now() < buttonIDs[2]) {
                                const userAccepted = await client.database.get(`users.${interaction.user.id}.tos`);
                                if (!userAccepted) {
                                    await client.database.set(`users.${interaction.user.id}.tos`, true);
                                    client.tools.log(11, `'${interaction.user.tag}' [${interaction.user.id}] has accepted the Terms of Service and Privacy Policy.`);
                                    interaction.reply({ content: "Thank you for accepting the Terms of Service and Privacy Policy.\nYou can now access the commands that required acceptance of the Terms of Service and Privacy Policy.", ephemeral: true });
                                } else {
                                    interaction.reply({ content: "It appears you've already accepted the Terms of Service and Privacy Policy.\nIf you'd like to opt-out, please reach out to a staff member.", ephemeral: true });
                                }
                            } else {
                                interaction.reply({ content: "You took too long to respond, please use the command again.", ephemeral: true });
                            }
                        } else {
                            client.tools.log(2, `Something went wrong with "${this.name}" (Slash Command)'s extra interaction: 'button'.`);
                            interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
                        }
                    } else {
                        client.tools.log(2, `Something went wrong with "${this.name}" (Slash Command)'s extra interaction: 'button'.`);
                        interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
                    }
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