import { SlashCommandBuilder } from 'discord.js';
import { Tag, Task, TaskTag } from '../db/models/index.js';
import { TAG } from './commandNames.js';
import {getTasks, sendTasksEmbed} from "../utils/discordUtils.js";

const addTagCommand = new SlashCommandBuilder()
	.setName(TAG)
	.setDescription('Add a tag to an existing task')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('The task to tag')
			.setRequired(true)
			.setAutocomplete(true)
	)
	.addStringOption(option =>
		option
			.setName('tag')
			.setDescription('The tag to add')
			.setRequired(true)
			.setAutocomplete(true)
	);

const addTag = async (interaction) => {
	try {
		const taskValue = interaction.options.getString('task');
		const tagValue = interaction.options.getString('tag');

		if (!taskValue || !tagValue) {
			return await interaction.reply({
				content: '❌ Both task and tag must be selected.',
				ephemeral: true,
			});
		}

		// Resolve task by "id - value" format
		const taskId = parseInt(taskValue.split(' - ')[0]);
		const task = await Task.findOne({ where: { id: taskId, completed: false } });
		if (!task) {
			return await interaction.reply({
				content: '❌ The selected task does not exist or is already completed.',
				ephemeral: true,
			});
		}

		const tag = await Tag.findOne({ where: { value: tagValue } });
		if (!tag) {
			return await interaction.reply({
				content: '❌ The selected tag does not exist.',
				ephemeral: true,
			});
		}

		// Check if the tag is already on the task
		const existing = await TaskTag.findOne({ where: { task_id: task.id, tag_id: tag.id } });
		if (existing) {
			return await interaction.reply({
				content: `❌ The tag '${tag.displayValue}' is already on this task.`,
				ephemeral: true,
			});
		}

		await TaskTag.create({ task_id: task.id, tag_id: tag.id });

		const allTasks = await getTasks();

		const confirmationContent = `✅ Tag '${tag.displayValue}' added to task '${task.value}'!`;
		await sendTasksEmbed(interaction, allTasks, confirmationContent);
	} catch (error) {
		console.error('Error in addtag command:', error);
		await interaction.reply({
			content: '❌ Failed to add tag. Please try again.',
			ephemeral: true,
		});
	}
};

export { addTagCommand, addTag };



