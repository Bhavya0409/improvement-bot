import { SlashCommandBuilder } from 'discord.js';
import { Tag, Task, TaskTag } from '../db/models/index.js';
import { ADD_PLAN } from './commandNames.js';
import { getTasks, sendRemainingTasksEmbed } from '../utils.js';

const addPlanTaskCommand = new SlashCommandBuilder()
	.setName(ADD_PLAN)
	.setDescription('Add a new task and immediately mark it as planned')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('The task name or description')
			.setRequired(true)
			.setMaxLength(100)
	);

const addPlanTask = async (interaction) => {
	try {
		const taskDescription = interaction.options.getString('task').trim();

		if (!taskDescription) {
			return await interaction.reply({
				content: '❌ Task description cannot be empty.',
				ephemeral: true,
			});
		}

		// Check for duplicate active task
		const existingTask = await Task.findOne({
			where: { value: taskDescription, completed: false },
		});
		if (existingTask) {
			return await interaction.reply({
				content: '❌ A task with this description already exists.',
				ephemeral: true,
			});
		}

		// Look up the "plan" tag
		const tag = await Tag.findOne({ where: { value: 'plan' } });
		if (!tag) {
			return await interaction.reply({
				content: '❌ The "plan" tag does not exist.',
				ephemeral: true,
			});
		}

		// Create the task
		const task = await Task.create({ value: taskDescription, completed: false });

		// Assign the "plan" tag
		await TaskTag.create({ task_id: task.id, tag_id: tag.id });

		const allTasks = await getTasks();

		const confirmationContent = `📋 Task '${task.value}' added and marked as planned!`;
		await sendRemainingTasksEmbed(interaction, allTasks, confirmationContent);
	} catch (error) {
		console.error('Error in addplan command:', error);
		await interaction.reply({
			content: '❌ Failed to create planned task. Please try again.',
			ephemeral: true,
		});
	}
};

export { addPlanTaskCommand, addPlanTask };

