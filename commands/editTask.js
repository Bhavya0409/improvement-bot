import {SlashCommandBuilder} from "discord.js";
import {Task} from "../db/models/index.js";
import {EDIT_TASK} from "./commandNames.js";
import {getTasks, sendRemainingTasksEmbed} from "../utils.js";

const editTaskCommand = new SlashCommandBuilder()
	.setName(EDIT_TASK)
	.setDescription('Edit the description of a non-completed task')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('Select a task to edit')
			.setRequired(true)
			.setAutocomplete(true)
	)
	.addStringOption(option =>
		option
			.setName('new_description')
			.setDescription('The new description for the task')
			.setRequired(true)
			.setMaxLength(100)
	)


const editTask = async (interaction) => {
	try {
		const selectedTask = interaction.options.getString('task').trim();
		const newDescription = interaction.options.getString('new_description').trim();
		
		// Validate selected task is not empty after trimming
		if (!selectedTask) {
			return await interaction.reply({
				content: '❌ Task selection cannot be empty.',
			});
		}
		
		// Validate new description is not empty after trimming
		if (!newDescription) {
			return await interaction.reply({
				content: '❌ New description cannot be empty.',
			});
		}
		
		// Find the task to edit by description (descriptions only, no ID prefix)
		const improvement = await Task.findOne({
			where: {
				value: selectedTask,
				completed: false
			}
		});
		
		// If task not found
		if (!improvement) {
			return await interaction.reply({
				content: '❌ No active task found with the provided description.',
			});
		}
		
		// Store old description for confirmation message
		const oldDescription = improvement.value;
		
		// Update the task description
		await improvement.update({
			value: newDescription
		});
		
		// Send success reply with confirmation
		const confirmationContent = `✅ Task '#${improvement.id} - ${oldDescription}' has been updated to '${newDescription}'!`;
		
		// Retrieve remaining active tasks
		const remainingTasks = await getTasks();
		
		// If no remaining tasks
		if (remainingTasks.length === 0) {
			return await interaction.reply({
				content: confirmationContent,
			});
		}
		
		await sendRemainingTasksEmbed(interaction, remainingTasks, confirmationContent);
	} catch (error) {
		console.error('Error in edit command:', error);
		try {
			await interaction.reply({
				content: '❌ Failed to edit task. Please try again.',
			});
		} catch (replyError) {
			console.error('Error sending error reply:', replyError);
		}
	}
}

export {
	editTaskCommand,
	editTask
}


