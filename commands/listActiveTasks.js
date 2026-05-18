import {SlashCommandBuilder} from "discord.js";
import {LIST_ACTIVE_TASKS} from "./commandNames.js";
import {getTasks, sendRemainingTasksEmbed} from "../utils/discordUtils.js";
import {Tag} from "../db/models/index.js";

const listActiveTasksCommand = new SlashCommandBuilder()
	.setName(LIST_ACTIVE_TASKS)
	.setDescription('View all active tasks')
	.addStringOption(option =>
		option.setName('listtype')
			.setDescription('Filter tasks by tag')
			.setAutocomplete(true)
			.setRequired(false)
	)


const listActiveTasks = async (interaction) => {
	try {
		const listType = interaction.options.getString('listtype');

		// Validate listType if provided
		if (listType) {
			const matchedTag = await Tag.findOne({ where: { value: listType } });
			if (!matchedTag) {
				return await interaction.reply({
					content: `❌ No tag found matching **${listType}**. Please choose a valid tag.`,
					ephemeral: true,
				});
			}
		}

		// Retrieve all non-completed tasks ordered from oldest to newest
		const allTasks = await getTasks();
		const tasks = listType
			? allTasks.filter(t => t.tags?.some(tag => tag.value === listType))
			: allTasks;

		// If no tasks, reply with a simple message
		if (tasks.length === 0) {
			return await interaction.reply({
				content: listType ? `✅ No tasks found tagged with **${listType}**!` : '✅ No pending tasks!',
			});
		}

		const confirmationContent = listType
			? `📋 Showing tasks tagged with **${listType}**`
			: null;

		await sendRemainingTasksEmbed(interaction, tasks, confirmationContent)

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
