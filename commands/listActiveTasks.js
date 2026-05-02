import {SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {Improvement} from "../db/models/index.js";
import {LIST_ACTIVE_TASKS} from "./commandNames.js";
import {calculateAge, capitalizeFirstLetter} from "../utils.js";

const listActiveTasksCommand = new SlashCommandBuilder()
	.setName(LIST_ACTIVE_TASKS)
	.setDescription('View all active tasks')


const listActiveTasks = async (interaction) => {
	try {
		// Retrieve all non-completed tasks ordered from oldest to newest
		const tasks = await Improvement.findAll({
			where: {
				completed: false
			},
			order: [['createdAt', 'ASC']]
		});

		// If no tasks, reply with a simple message
		if (tasks.length === 0) {
			return await interaction.reply({
				content: '✅ No pending tasks!',
				ephemeral: false,
			});
		}

		// Build the three columns for the embed
		const ids = tasks.map(task => task.id.toString()).join('\n');
		const taskDescriptions = tasks.map(task => capitalizeFirstLetter(task.value)).join('\n');
		const ages = tasks.map(task => calculateAge(task.createdAt)).join('\n');

		// Create and configure the embed
		const embed = new EmbedBuilder()
			.setColor('#FFA500')
			.setTitle(`⏳ ACTIVE TASKS (${tasks.length})`)
			.addFields(
				{ name: 'ID', value: ids, inline: true },
				{ name: 'Age', value: ages, inline: true },
				{ name: 'Task', value: taskDescriptions, inline: true },
			)
			.setFooter({ text: `Total active tasks: ${tasks.length}` });

		// Reply with the embed
		await interaction.reply({
			embeds: [embed],
			ephemeral: false,
		});

	} catch (error) {
		console.error('Error in list active tasks command:', error);
		await interaction.reply({
			content: '❌ Failed to retrieve tasks. Please try again.',
			ephemeral: true,
		});
	}
}

export {
	listActiveTasksCommand,
	listActiveTasks
}

