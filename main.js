import "dotenv/config";
import {Client, Events, GatewayIntentBits, REST, Routes} from "discord.js";

import {CONFIG} from "./config.js";
import db from "./models/index.js";
import commands from "./commands/index.js";

const CLIENT = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

// Initialize database
async function initializeDatabase() {
	try {
		// Test database connection
		await db.sequelize.authenticate();
		console.log('Database connection successful');
		
	} catch (error) {
		console.error('Failed to connect to database:', error);
		process.exit(1);
	}
}

// Register slash commands to Discord guild
async function registerCommands() {
	try {
		const rest = new REST({ version: '10' }).setToken(CONFIG.BOT_TOKEN);
		const commandData = Array.from(commands.values()).map(cmd => cmd.data.toJSON());

		console.log(`Registering ${commandData.length} commands to guild ${CONFIG.GUILD_ID}...`);

		await rest.put(
			Routes.applicationGuildCommands(CONFIG.CLIENT_ID, CONFIG.GUILD_ID),
			{ body: commandData }
		);

		console.log('Commands registered successfully');
	} catch (error) {
		console.error('Failed to register commands:', error);
		process.exit(1);
	}
}

CLIENT.once(Events.ClientReady, async (client) => {
	console.log(`Bot logged in as ${client.user.tag}`);
	console.log('Bot is ready to handle commands!');
});

// Handle slash command interactions
CLIENT.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error('Error executing command:', error);
		await interaction.reply({
			content: '❌ An error occurred while executing this command.',
			ephemeral: true,
		});
	}
});

// Initialize database and login
(async () => {
	try {
		await initializeDatabase();
		await registerCommands();
		await CLIENT.login(CONFIG.BOT_TOKEN);
		console.log('Logged in to discord');
	} catch (error) {
		console.error('Failed to start bot:', error);
		process.exit(1);
	}
})();
