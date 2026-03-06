function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  DISCORD_TOKEN: required("DISCORD_TOKEN"),
  CLIENT_ID: required("CLIENT_ID"),

  DEV_GUILD_ID: process.env.DEV_GUILD_ID || null,

  BOT_OWNER_IDS: (process.env.BOT_OWNER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),

  PREFIX_DEFAULT: process.env.PREFIX_DEFAULT || "!",

  DB_HOST: required("DB_HOST"),
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_USER: required("DB_USER"),
  DB_PASSWORD: required("DB_PASSWORD"),
  DB_NAME: required("DB_NAME"),
};
