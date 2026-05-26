import { SlashCommandBuilder } from 'discord.js';
import { Tag, Task, TaskTag } from '../db/models/index.js';
import { BUY } from './commandNames.js';

import {getTasks, sendTasksEmbed} from "../utils/discordUtils.js";

const buyTaskCommand = new SlashCommandBuilder()
	.setName(BUY)
	.setDescription('Add a new task and immediately mark it with the buy tag')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('The task name or description')
			.setRequired(true)
			.setMaxLength(100)
	);

const buyTask = async (interaction) => {
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

		// Look up the "buy" tag
		const tag = await Tag.findOne({ where: { value: 'buy' } });
		if (!tag) {
			return await interaction.reply({
				content: '❌ The "buy" tag does not exist.',
				ephemeral: true,
			});
		}

		// Create the task
		const task = await Task.create({ value: taskDescription, completed: false });

		// Assign the "buy" tag
		await TaskTag.create({ task_id: task.id, tag_id: tag.id });

		const allTasks = await getTasks();

		const confirmationContent = `🛒 Task '${task.value}' added and marked with the buy tag!`;
		await sendTasksEmbed(interaction, allTasks, confirmationContent);
	} catch (error) {
		console.error('Error in buy command:', error);
		await interaction.reply({
			content: '❌ Failed to create buy task. Please try again.',
			ephemeral: true,
		});
	}
};

export { buyTaskCommand, buyTask };


