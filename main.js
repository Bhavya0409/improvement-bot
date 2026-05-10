import {Client, Events, GatewayIntentBits} from "discord.js";
import {CONFIG} from "./config.js";
import sequelize from "./db/index.js";
import {COMMAND_EXECUTIONS, registerCommands} from "./commands/index.js";
import {Task, Tag, TaskTag} from "./db/models/index.js";
import {ADD_TAG, ADD_TASK, EDIT_TASK, REMOVE_TAG} from "./commands/commandNames.js";
import {Op} from "sequelize";

const CLIENT = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});


CLIENT.once(Events.ClientReady, async (client) => {
	console.log(`Bot logged in as ${client.user.tag}`);
})

// Handle autocomplete interactions
CLIENT.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isAutocomplete()) return;

	const { commandName } = interaction;
	const focusedOption = interaction.options.getFocused(true);
	const focusedValue = focusedOption.value;

	try {
		// Task autocomplete: used by complete, edit, refresh, addtag, removetag
		if (focusedOption.name === 'task') {
			const findOptions = { where: { completed: false } };
			if (commandName === REMOVE_TAG) {
				// Only show tasks that have at least one tag
				findOptions.include = [{ model: Tag, as: 'tags', required: true }];
			}
			const tasks = await Task.findAll(findOptions);
			const choices = tasks.map(task => {
				if (commandName === EDIT_TASK) {
					return { name: task.value, value: task.value };
				}
				return {
					name: `${task.id} - ${task.value}`,
					value: `${task.id} - ${task.value}`,
				};
			}).filter(c => c.name.toLowerCase().includes(focusedValue.toLowerCase()));
			return await interaction.respond(choices.slice(0, 25));
		}

		// Tag autocomplete for /add: all tags
		if (focusedOption.name === 'tag' && commandName === ADD_TASK) {
			const tags = await Tag.findAll();
			const choices = tags
				.map(t => ({ name: t.displayValue, value: t.value }))
				.filter(c => c.name.toLowerCase().includes(focusedValue.toLowerCase()));
			return await interaction.respond(choices.slice(0, 25));
		}

		// Tag autocomplete for /addtag: tags NOT yet on the selected task
		if (focusedOption.name === 'tag' && commandName === ADD_TAG) {
			const taskValue = interaction.options.getString('task') || '';
			const taskId = parseInt(taskValue.split(' - ')[0]);
			let excludeTagIds = [];
			if (!isNaN(taskId)) {
				const existingTaskTags = await TaskTag.findAll({ where: { task_id: taskId } });
				excludeTagIds = existingTaskTags.map(tt => tt.tag_id);
			}
			const whereClause = excludeTagIds.length > 0 ? { id: { [Op.notIn]: excludeTagIds } } : {};
			const tags = await Tag.findAll({ where: whereClause });
			const choices = tags
				.map(t => ({ name: t.displayValue, value: t.value }))
				.filter(c => c.name.toLowerCase().includes(focusedValue.toLowerCase()));
			return await interaction.respond(choices.slice(0, 25));
		}

		// Tag autocomplete for /removetag: only tags ON the selected task
		if (focusedOption.name === 'tag' && commandName === REMOVE_TAG) {
			const taskValue = interaction.options.getString('task') || '';
			const taskId = parseInt(taskValue.split(' - ')[0]);
			if (isNaN(taskId)) return await interaction.respond([]);
			const taskTags = await TaskTag.findAll({ where: { task_id: taskId }, include: [{ model: Tag, as: 'tag' }] });
			const choices = taskTags
				.map(tt => ({ name: tt.tag.displayValue, value: tt.tag.value }))
				.filter(c => c.name.toLowerCase().includes(focusedValue.toLowerCase()));
			return await interaction.respond(choices.slice(0, 25));
		}

		await interaction.respond([]);
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
