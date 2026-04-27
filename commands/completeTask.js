import {SlashCommandBuilder} from "discord.js";
import {Improvement} from "../db/models/index.js";
import {COMPLETE_TASK} from "./commandNames.js";

const completeTaskCommand = new SlashCommandBuilder()
	.setName(COMPLETE_TASK)
	.setDescription('Complete a task in your improvements list')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('The task name or description')
			.setRequired(true)
			.setMaxLength(100)
	)


const completeTask = async (interaction) => {
	try {
		const taskDescription = interaction.options.getString('task').trim();
		
		// Validate task is not empty after trimming
		if (!taskDescription) {
			return await interaction.reply({
				content: '❌ Task description cannot be empty.',
				ephemeral: true,
			});
		}
		
		// Find the improvement record with matching value
		const improvement = await Improvement.findOne({
			where: {
				value: taskDescription
			}
		});
		
		// If task not found
		if (!improvement) {
			return await interaction.reply({
				content: `❌ No task found with the name '${taskDescription}'.`,
				ephemeral: true,
			});
		}
		
		// Update the task as completed
		await improvement.update({
			completed: true,
			completedAt: new Date(),
		});
		
		// Send success reply
		await interaction.reply({
			content: `✅ Task '${improvement.value}' has been marked as completed!`,
			ephemeral: false,
		});
	} catch (error) {
		console.error('Error in complete command:', error);
		await interaction.reply({
			content: '❌ Failed to complete task. Please try again.',
			ephemeral: true,
		});
	}
}

export {
	completeTaskCommand,
	completeTask
}

