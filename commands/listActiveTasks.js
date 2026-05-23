import {SlashCommandBuilder} from "discord.js";
import {LIST_ACTIVE_TASKS} from "./commandNames.js";
import {getTasks, sendTasksEmbed} from "../utils/discordUtils.js";
import {Tag} from "../db/models/index.js";

const listActiveTasksCommand = new SlashCommandBuilder()
	.setName(LIST_ACTIVE_TASKS)
	.setDescription('View all active tasks')
	.addStringOption(option =>
		option.setName('tag')
			.setDescription('Filter tasks by tag')
			.setAutocomplete(true)
			.setRequired(false)
	)


const listActiveTasks = async (interaction) => {
	try {
		const tagFilter = interaction.options.getString('tag');

		// Validate tagFilter if provided
		if (tagFilter) {
			const matchedTag = await Tag.findOne({ where: { value: tagFilter } });
			if (!matchedTag) {
				return await interaction.reply({
					content: `❌ No tag found matching **${tagFilter}**. Please choose a valid tag.`,
					ephemeral: true,
				});
			}
		}

		// Retrieve all non-completed tasks ordered from oldest to newest
		const allTasks = await getTasks();
		const tasks = tagFilter
			? allTasks.filter(t => t.tags?.some(tag => tag.value === tagFilter))
			: allTasks;

		// If no tasks, reply with a simple message
		if (tasks.length === 0) {
			return await interaction.reply({
				content: tagFilter ? `✅ No tasks found tagged with **${tagFilter}**!` : '✅ No pending tasks!',
			});
		}

		const confirmationContent = tagFilter
			? `📋 Showing tasks tagged with **${tagFilter}**`
			: null;

		await sendTasksEmbed(interaction, tasks, confirmationContent)

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
