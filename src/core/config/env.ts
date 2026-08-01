function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function snowflake(name: string, value: string): string {
  if (!/^\d{17,20}$/.test(value)) {
    throw new Error(`Invalid Discord ID in environment variable: ${name}`);
  }
  return value;
}

function port(name: string, fallback: number): number {
  const value = Number(process.env[name] || fallback);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`Invalid port in environment variable: ${name}`);
  }
  return value;
}

function boolean(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (!value) return fallback;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${name} must be either true or false`);
}

const defaultPrefix = process.env.PREFIX_DEFAULT || "!";
if (defaultPrefix.length > 10) {
  throw new Error("PREFIX_DEFAULT must be at most 10 characters long");
}

const databaseEnabled = boolean("DATABASE_ENABLED", false);

export const env = {
  DISCORD_TOKEN: required("DISCORD_TOKEN"),
  CLIENT_ID: snowflake("CLIENT_ID", required("CLIENT_ID")),

  DEV_GUILD_ID: process.env.DEV_GUILD_ID
    ? snowflake("DEV_GUILD_ID", process.env.DEV_GUILD_ID)
    : null,

  BOT_OWNER_IDS: (process.env.BOT_OWNER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => snowflake("BOT_OWNER_IDS", id)),

  PREFIX_DEFAULT: defaultPrefix,

  DATABASE_ENABLED: databaseEnabled,
  DB_HOST: databaseEnabled ? required("DB_HOST") : "127.0.0.1",
  DB_PORT: port("DB_PORT", 3306),
  DB_USER: databaseEnabled ? required("DB_USER") : "",
  DB_PASSWORD: databaseEnabled ? required("DB_PASSWORD") : "",
  DB_NAME: databaseEnabled ? required("DB_NAME") : "",
};
