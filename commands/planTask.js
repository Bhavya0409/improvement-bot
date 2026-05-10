import { SlashCommandBuilder } from 'discord.js';
import { Tag, Task, TaskTag } from '../db/models/index.js';
import { PLAN } from './commandNames.js';
import { getTasks, sendRemainingTasksEmbed } from '../utils.js';

const planTaskCommand = new SlashCommandBuilder()
	.setName(PLAN)
	.setDescription('Mark a task as planned by adding the "plan" tag')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('The task to mark as planned')
			.setRequired(true)
			.setAutocomplete(true)
	);

const planTask = async (interaction) => {
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
		if (existing) {
			return await interaction.reply({
				content: `❌ The task '${task.value}' is already marked as planned.`,
				ephemeral: true,
			});
		}

		await TaskTag.create({ task_id: task.id, tag_id: tag.id });

		const allTasks = await getTasks();

		const confirmationContent = `📋 Task '${task.value}' has been marked as planned!`;
		await sendRemainingTasksEmbed(interaction, allTasks, confirmationContent);
	} catch (error) {
		console.error('Error in plan command:', error);
		await interaction.reply({
			content: '❌ Failed to mark task as planned. Please try again.',
			ephemeral: true,
		});
	}
};

export { planTaskCommand, planTask };

