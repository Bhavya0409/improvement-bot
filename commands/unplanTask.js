import { SlashCommandBuilder } from 'discord.js';
import { Tag, Task, TaskTag } from '../db/models/index.js';
import { UNPLAN } from './commandNames.js';
import { getTasks, sendRemainingTasksEmbed } from '../utils.js';

const unplanTaskCommand = new SlashCommandBuilder()
	.setName(UNPLAN)
	.setDescription('Remove the "plan" tag from a task')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('The task to unplan')
			.setRequired(true)
			.setAutocomplete(true)
	);

const unplanTask = async (interaction) => {
	try {
		const taskValue = interaction.options.getString('task');

		if (!taskValue) {
			return await interaction.reply({
				content: '❌ A task must be selected.',
				ephemeral: true,
			});
		}

		const taskId = parseInt(taskValue.split(' - ')[0]);
		const task = await Task.findOne({ where: { id: taskId, completed: false } });
		if (!task) {
			return await interaction.reply({
				content: '❌ The selected task does not exist or is already completed.',
				ephemeral: true,
			});
		}

		const tag = await Tag.findOne({ where: { value: 'plan' } });
		if (!tag) {
			return await interaction.reply({
				content: '❌ The "plan" tag does not exist.',
				ephemeral: true,
			});
		}

		const existing = await TaskTag.findOne({ where: { task_id: task.id, tag_id: tag.id } });
		if (!existing) {
			return await interaction.reply({
				content: `❌ The task '${task.value}' does not have the "plan" tag.`,
				ephemeral: true,
			});
		}

		await existing.destroy();

		const allTasks = await getTasks();

		const confirmationContent = `✅ Task '${task.value}' has been unplanned!`;
		await sendRemainingTasksEmbed(interaction, allTasks, confirmationContent);
	} catch (error) {
		console.error('Error in unplan command:', error);
		await interaction.reply({
			content: '❌ Failed to unplan task. Please try again.',
			ephemeral: true,
		});
	}
};

export { unplanTaskCommand, unplanTask };

