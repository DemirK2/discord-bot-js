import {
  ChatInputCommandInteraction,
  Message,
  PermissionsBitField,
} from "discord.js";
import { BotClient } from "../client/BotClient.js";
import { env } from "../config/env.js";
import {
  getGuildBanReason,
  getUserBanReason,
} from "../managers/botBanManager.js";
import { getUserBotPermissionLevel } from "../managers/botPermissionManager.js";
import { hasAcceptedBotTerms } from "../managers/botTermsManager.js";
import { getCooldownRemaining } from "../managers/cooldownManager.js";
import { Command } from "../types/Command.js";

type GuardTarget = ChatInputCommandInteraction | Message;

export interface CommandGuardResult {
  allowed: boolean;
  reason?: string;
}

export async function commandGuard(
  client: BotClient,
  command: Command,
  target: GuardTarget
): Promise<CommandGuardResult> {
  const userId = "user" in target ? target.user.id : target.author.id;
  const guildId = target.guildId;

  if (env.DATABASE_ENABLED) {
    const userBanReason = await getUserBanReason(userId);
    if (userBanReason) {
      void client;
      return {
        allowed: false,
        reason: `You are banned from using this bot. Reason: ${userBanReason}`,
      };
    }

    if (guildId) {
      const guildBanReason = await getGuildBanReason(guildId);

      if (guildBanReason) {
        void client;
        return {
          allowed: false,
          reason: `This server is banned from using this bot. Reason: ${guildBanReason}`,
        };
      }
    }
  }

  if (command.guildOnly && !guildId) {
    return {
      allowed: false,
      reason: "This command can only be used in a server.",
    };
  }

  if (command.dmOnly && guildId) {
    return {
      allowed: false,
      reason: "This command can only be used in DMs.",
    };
  }

  if (command.guildOwnerOnly) {
    if (!guildId) {
      return {
        allowed: false,
        reason: "This command can only be used in a server.",
      };
    }

    const guild = target.guild;
    if (!guild || guild.ownerId !== userId) {
      return {
        allowed: false,
        reason: "Only the server owner can use this command.",
      };
    }
  }

  if (command.botOwnerOnly) {
    if (!env.BOT_OWNER_IDS.includes(userId)) {
      return {
        allowed: false,
        reason: "Only the bot owner can use this command.",
      };
    }
  }

  if (command.permissions) {
    if (!guildId) {
      return {
        allowed: false,
        reason: "This command can only be used in a server.",
      };
    }

    const member = target.member;
    if (!member || !("permissions" in member)) {
      return {
        allowed: false,
        reason: "Could not verify your permissions.",
      };
    }

    const memberPermissions =
      typeof member.permissions === "string"
        ? BigInt(member.permissions)
        : member.permissions;
    const perms = new PermissionsBitField(memberPermissions);
    if (!perms.has(command.permissions)) {
      return {
        allowed: false,
        reason: "You do not have permission to use this command.",
      };
    }
  }

  if (command.botPermissions !== undefined) {
    if (!env.DATABASE_ENABLED) {
      return {
        allowed: false,
        reason: "This command requires the database to be enabled.",
      };
    }

    const level = await getUserBotPermissionLevel(userId);

    if (level < command.botPermissions) {
      return {
        allowed: false,
        reason: "You do not have the required bot permission level.",
      };
    }
  }

  if (command.botTerms) {
    if (!env.DATABASE_ENABLED) {
      return {
        allowed: false,
        reason: "This command requires the database to be enabled.",
      };
    }

    const accepted = await hasAcceptedBotTerms(userId);

    if (!accepted) {
      return {
        allowed: false,
        reason:
          "You must accept the bot terms of service before using this command.",
      };
    }
  }

  if (command.cooldown) {
    const commandName = "data" in command ? command.data.name : command.name;

    const remaining = getCooldownRemaining(
      userId,
      commandName,
      command.cooldown
    );

    if (remaining > 0) {
      return {
        allowed: false,
        reason: `Please wait ${remaining} seconds before using this command again.`,
      };
    }
  }

  void client;

  return { allowed: true };
}
