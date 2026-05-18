import {Client, Events, GatewayIntentBits} from "discord.js";
import {CONFIG} from "./config.js";
import sequelize from "./db/index.js";
import {COMMAND_CONFIG, registerCommands} from "./commands/index.js";
import {getAutocompleteSuggestions, resolveCommandName} from "./utils/getAutocompleteSuggestions.js";

const CLIENT = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});


CLIENT.once(Events.ClientReady, async (client) => {
	console.log(`Bot logged in as ${client.user.tag}`);
})

// Handle autocomplete interactions
CLIENT.on(Events.InteractionCreate, getAutocompleteSuggestions)

// Handle slash command interactions
CLIENT.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	try {
		const resolvedCommandName = resolveCommandName(interaction.commandName);
		const commandToExecute = COMMAND_CONFIG[resolvedCommandName]?.executionFn;
		await commandToExecute(interaction)
	} catch (error) {
		console.error('Error executing command:', error);
		try {
			await interaction.reply({
				content: '❌ An error occurred while executing this command.',
				ephemeral: true,
			});
		} catch (_) {}
	}
});

const start = async () => {
	// Connect to database
	await sequelize.authenticate()
	console.log('DB connected!');
	
	// Register discord commands
	await registerCommands()
	console.log('Commands registered!');

	// Log into discord client
	await CLIENT.login(CONFIG.BOT_TOKEN);
	console.log('Logged in to discord!');
}

await start()
