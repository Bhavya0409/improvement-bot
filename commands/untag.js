import { SlashCommandBuilder } from 'discord.js';
import { Tag, Task, TaskTag } from '../db/models/index.js';
import { UNTAG } from './commandNames.js';
import {getTasks, sendRemainingTasksEmbed} from "../utils/discordUtils.js";

const removeTagCommand = new SlashCommandBuilder()
	.setName(UNTAG)
	.setDescription('Remove a tag from an existing task')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('The task to remove the tag from')
			.setRequired(true)
			.setAutocomplete(true)
	)
	.addStringOption(option =>
		option
			.setName('tag')
			.setDescription('The tag to remove')
			.setRequired(true)
			.setAutocomplete(true)
	);

const removeTag = async (interaction) => {
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

		const taskTag = await TaskTag.findOne({ where: { task_id: task.id, tag_id: tag.id } });
		if (!taskTag) {
			return await interaction.reply({
				content: `❌ The tag '${tag.displayValue}' is not linked to this task.`,
				ephemeral: true,
			});
		}

		await taskTag.destroy();

		const allTasks = await getTasks();

		const confirmationContent = `✅ Tag '${tag.displayValue}' removed from task '${task.value}'!`;
		await sendRemainingTasksEmbed(interaction, allTasks, confirmationContent);
	} catch (error) {
		console.error('Error in removetag command:', error);
		await interaction.reply({
			content: '❌ Failed to remove tag. Please try again.',
			ephemeral: true,
		});
	}
};

export { removeTagCommand, removeTag };



