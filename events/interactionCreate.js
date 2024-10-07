const discord = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async run(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.slashcommands.find(cmd => cmd.name == interaction.commandName);
            if (!command) {
                if (interaction.isRepliable()) {
                    interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
                    return client.tools.log(2, `"${command.name}" (Slash Command) was not in collection.`);
                } else {
                    return client.tools.log(2, `"${command.name}" (Slash Command) was not in collection.`);
                }
            }
            if (command.ownerOnly) {
                if (interaction.user.id != client.config.ownerID) return interaction.reply({ content: "This command can only be used by the owner of the bot.", ephemeral: true });
            }
            if (command.perms) {
                let userPerms = await client.database.get(`users.${interaction.user.id}.perms`);
                if (!userPerms) userPerms = 0;
                if (command.perms > userPerms) return interaction.reply({ content: "This command can only be used by the staff of the bot.", ephemeral: true });
            }
            if (!command.bypassBotBan) {
                const userBotBan = await client.database.get(`users.${interaction.user.id}.botban`);
                if (userBotBan) {
                    return interaction.reply({ content: "You are banned from using the bot!\nContact us for more information.", ephemeral: true });
                }
            }
            if (command.guildOnly) {
                if (!interaction.inGuild()) return interaction.reply({ content: "This command can only be used in servers.", ephemeral: true });
            }
            if (command.guildOwnerOnly) {
                if (!interaction.inGuild()) {
                    interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
                    return client.tools.log(2, `"${command.name}" (Slash Command) was defined as 'Guild Owner Only' but was not defined as 'Guild Only'.`);
                }
                if (interaction.user.id != interaction.guild.ownerId) return interaction.reply({ content: "This command can only be used by the server owner.", ephemeral: true });
            }
            if (command.guildRoles) {
                if (!interaction.inGuild()) {
                    interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
                    return client.tools.log(2, `"${command.name}" (Slash Command) was defined as 'Guild Roles Only' but was not defined as 'Guild Only'.`);
                }
                if (command.guildRoles.length < 1) {
                    interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
                    return client.tools.log(2, `"${command.name}" (Slash Command) was defined as 'Guild Roles Only' but roles were not specified.`);
                }
                const userGuildRoles = interaction.member.roles.cache;
                const setGuildRoles = require('../data/roles.json').permRoles;
                const requiredRoleIDs = command.guildRoles.map(roleName => {
                    const role = setGuildRoles.find(r => r.name === roleName);
                    return role ? role.id : null;
                }).filter(roleID => roleID !== null);
                if (!userGuildRoles.some(role => requiredRoleIDs.includes(role.id))) {
                    if (command.ignoreGuildOwnerRoles) {
                        if (interaction.user.id != interaction.guild.ownerId) {
                            if (command.ignoreGuildAdminRoles) {
                                if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "You do not have the required roles to use this command.", ephemeral: true });
                            } else {
                                return interaction.reply({ content: "You do not have the required roles to use this command.", ephemeral: true });
                            }
                        }
                    } else {
                        if (command.ignoreGuildAdminRoles) {
                            if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "You do not have the required roles to use this command.", ephemeral: true });
                        } else {
                            return interaction.reply({ content: "You do not have the required roles to use this command.", ephemeral: true });
                        }
                    }
                }
            }
            if (command.guildPerms) {
                if (!interaction.inGuild()) {
                    interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
                    return client.tools.log(2, `"${command.name}" (Slash Command) was defined as 'Guild Perms Only' but was not defined as 'Guild Only'.`);
                }
                /*
                1: Manage Messages
                2: Timeout Members
                3: Kick Members
                4: Ban Members
                5: Manage Server
                6: Administrator
                */
                switch (command.guildPerms) {
                    case 6:
                        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: "Only members with the `Administrator` permission can use this command.", ephemeral: true });
                        break;
                    case 5:
                        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ content: "Only members with the `Manage Server` permission can use this command.", ephemeral: true });
                        break;
                    case 4:
                        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.BanMembers)) return interaction.reply({ content: "Only members with the `Ban Members` permission can use this command.", ephemeral: true });
                        break;
                    case 3:
                        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.KickMembers)) return interaction.reply({ content: "Only members with the `Kick Members` permission can use this command.", ephemeral: true });
                        break;
                    case 2:
                        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({ content: "Only members with the `Timeout Members` permission can use this command.", ephemeral: true });
                        break;
                    case 1:
                        if (!interaction.member.permissions.has(discord.PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: "Only members with the `Manage Messages` permission can use this command.", ephemeral: true });
                        break;
                    default:
                        interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
                        return client.tools.log(2, `"${command.name}" (Slash Command) was defined as 'guildPerms' but the permission level was not defined correctly.`);
                        break;
                }
            }
            if (command.requireToS) {
                const userToS = await client.database.get(`users.${interaction.user.id}.tos`);
                if (!userToS) return interaction.reply({ content: `You need to accept the **Terms of Use** / **Privacy Policy** of this bot to be able to use this command.\n\`\`\`/accepttos\`\`\``, ephemeral: true });
            }
            if (command.cooldown) {
                let userCooldown = await client.database.get(`users.${interaction.user.id}.cooldowns.slash.${command.name}`);
                if (!userCooldown) userCooldown = 0;
                if (Date.now() >= userCooldown) {
                    await client.database.set(`users.${interaction.user.id}.cooldowns.slash.${command.name}`, Date.now() + command.cooldown * 1000);
                } else {
                    return interaction.reply({ content: `This command is under cooldown: <t:${Math.floor(userCooldown / 1000)}:R>`, ephemeral: true });
                }
            }
            if (interaction.inGuild()) {
                client.tools.log(4, `'${interaction.user.tag}' [${interaction.user.id}] used "/${command.name}" in '${interaction.guild.name}' [${interaction.guild.id}].`);
            } else {
                client.tools.log(4, `'${interaction.user.tag}' [${interaction.user.id}] used "/${command.name}" in DMs.`);
            }
            return command.run(interaction, client);
        } else {
            if (interaction.isPrefixCommand) {
                // Prefix Command
                // Prefix Command Checks
            } else {
                if (interaction.isButton()) {
                    const buttonCommand = client.slashcommands.find(cmd => cmd.name == interaction.message.interaction.commandName);
                    if (buttonCommand) return buttonCommand.runInteraction(interaction, client);
                } else {
                    if (interaction.isStringSelectMenu()) {
                        const selectCommand = client.slashcommands.find(cmd => cmd.name == interaction.message.interaction.commandName);
                        if (selectCommand) return selectCommand.runInteraction(interaction, client);
                    } else {
                        if (interaction.isModalSubmit()) {
                            const modalID = interaction.customId.split('-');
                            const modalCommand = client.slashcommands.find(cmd => cmd.name == modalID[0]);
                            if (modalCommand) {
                                return modalCommand.runInteraction(interaction, client);
                            } else {
                                interaction.reply({ content: "Something went wrong!\nPlease contact us about the issue.", ephemeral: true });
                                return client.tools.log(2, `Modal's origin command could not be found! Please make sure you put "CommandNameHere-..." before the customId.`);
                            }
                        }
                    }
                }
            }
        }
    }
};