import {SlashCommandBuilder} from "discord.js";
import {Improvement} from "../db/models/index.js";
import {LIST_ACTIVE_TASKS} from "./commandNames.js";
import {sendRemainingTasksEmbed} from "../utils.js";

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
		
		await sendRemainingTasksEmbed(interaction, tasks)

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

