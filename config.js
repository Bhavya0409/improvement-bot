import "dotenv/config";

export const CONFIG = {
	BOT_TOKEN: process.env.BOT_TOKEN,
	GUILD_ID: process.env.GUILD_ID,
	CHANNEL_ID: process.env.CHANNEL_ID,
	CLIENT_ID: process.env.CLIENT_ID,
	DB_HOST: process.env.DB_HOST || 'localhost',
	DB_PORT: process.env.DB_PORT || 5432,
	DB_USER: process.env.DB_USER || 'postgres',
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME || 'improvement_bot',
}