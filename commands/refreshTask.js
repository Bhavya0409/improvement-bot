import { SlashCommandBuilder } from "discord.js";
import { Task, Instance } from "../db/models/index.js";
import { REFRESH } from "./commandNames.js";
import {getTasks, sendTasksEmbed} from "../utils/discordUtils.js";

const refreshTaskCommand = new SlashCommandBuilder()
	.setName(REFRESH)
	.setDescription('Refresh a task to reset its age')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('Select a task by ID or description')
			.setRequired(true)
			.setAutocomplete(true)
	)

const refreshTask = async (interaction) => {
	try {
		const input = interaction.options.getString('task').trim();
		
		// Validate input is not empty after trimming
		if (!input) {
			return await interaction.reply({
				content: '❌ Task input cannot be empty.',
				ephemeral: true,
			});
		}
		
		// Parse input to extract task ID (if present)
		const idMatch = input.match(/^(\d+)/);
		const extractedId = idMatch ? parseInt(idMatch[1]) : null;
		
		let task;
		
		// If ID was extracted, use it as source of truth
		if (extractedId) {
			task = await Task.findOne({
				where: {
					id: extractedId,
					completed: false
				}
			});
		} else {
			// Otherwise try to match by description
			task = await Task.findOne({
				where: {
					value: input,
					completed: false
				}
			});
		}
		
		// If task not found
		if (!task) {
			return await interaction.reply({
				content: `❌ No active task found with the provided input.`,
				ephemeral: true,
			});
		}
		
		// Create new instance record
		await Instance.create({
			task_id: task.id,
			completedAt: new Date(),
		});
		
		// Update the task's lastCompletedAt (but NOT completed flag)
		await task.update({
			lastCompletedAt: new Date(),
		});
		
		// Send success reply with confirmation
		const confirmationContent = `✅ Task '#${task.id} - ${task.value}' has been refreshed!`;
		
		// Retrieve remaining active tasks
		const remainingTasks = await getTasks();
		
		// If no remaining tasks
		if (remainingTasks.length === 0) {
			return await interaction.reply({
				content: confirmationContent + '\n✅ No pending tasks!',
				ephemeral: false,
			});
		}
		
		await sendTasksEmbed(interaction, remainingTasks, confirmationContent)
	} catch (error) {
		console.error('Error in refresh command:', error);
		await interaction.reply({
			content: '❌ Failed to refresh task. Please try again.',
			ephemeral: true,
		});
	}
}

export {
	refreshTaskCommand,
	refreshTask
}



