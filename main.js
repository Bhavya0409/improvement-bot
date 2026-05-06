import {Client, Events, GatewayIntentBits} from "discord.js";
import {CONFIG} from "./config.js";
import sequelize from "./db/index.js";
import {COMMAND_EXECUTIONS, registerCommands} from "./commands/index.js";
import {Task} from "./db/models/index.js";

const CLIENT = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});


CLIENT.once(Events.ClientReady, async (client) => {
	console.log(`Bot logged in as ${client.user.tag}`);
})

// Handle autocomplete interactions
CLIENT.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isAutocomplete()) return;
	
	if (interaction.commandName !== 'complete' && interaction.commandName !== 'edit' && interaction.commandName !== 'refresh') return
	
	const focusedValue = interaction.options.getFocused();
	
	try {
		// Query all non-completed tasks from database
		const tasks = await Task.findAll({
			where: {
				completed: false
			}
		});
		
		// Format suggestions based on command
		// For 'complete' and 'refresh' commands: include ID prefix
		// For 'edit' command: only task descriptions
		const filtered = tasks.map(task => {
			if (interaction.commandName === 'complete' || interaction.commandName === 'refresh') {
				return {
					name: `${task.id} - ${task.value}`,
					value: `${task.id} - ${task.value}`
				};
			} else {
				// edit command - descriptions only
				return {
					name: task.value,
					value: task.value
				};
			}
		}).filter(choice =>
			choice.name.toLowerCase().includes(focusedValue.toLowerCase())
		);
		
		// Return up to 25 results
		await interaction.respond(filtered.slice(0, 25));
	} catch (error) {
		console.error('Error in autocomplete:', error);
		await interaction.respond([]);
	}
});

// Handle slash command interactions
CLIENT.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	
	try {
		const commandToExecute = COMMAND_EXECUTIONS[interaction.commandName]
		await commandToExecute(interaction)
	} catch (error) {
		console.error('Error executing command:', error);
		await interaction.reply({
			content: '❌ An error occurred while executing this command.',
			ephemeral: true,
		});
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