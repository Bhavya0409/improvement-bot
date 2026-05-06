import {SlashCommandBuilder} from "discord.js";
import {Improvement} from "../db/models/index.js";
import {COMPLETE_TASK} from "./commandNames.js";
import {sendRemainingTasksEmbed} from "../utils.js";

const completeTaskCommand = new SlashCommandBuilder()
	.setName(COMPLETE_TASK)
	.setDescription('Complete a task in your improvements list')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('Select a task by ID or description')
			.setRequired(true)
			.setAutocomplete(true)
	)


const completeTask = async (interaction) => {
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
		
		let improvement;
		
		// If ID was extracted, use it as source of truth
		if (extractedId) {
			improvement = await Improvement.findOne({
				where: {
					id: extractedId,
					completed: false
				}
			});
		} else {
			// Otherwise try to match by description
			improvement = await Improvement.findOne({
				where: {
					value: input,
					completed: false
				}
			});
		}
		
		// If task not found
		if (!improvement) {
			return await interaction.reply({
				content: `❌ No active task found with the provided input.`,
				ephemeral: true,
			});
		}
		
		// Update the task as completed
		await improvement.update({
			completed: true,
			completedAt: new Date(),
		});
		
		// Send success reply with confirmation
		const confirmationContent = `✅ Task '#${improvement.id} - ${improvement.value}' has been marked as completed!`;
		
		// Retrieve remaining active tasks
		const remainingTasks = await Improvement.findAll({
			where: {
				completed: false
			},
			order: [['createdAt', 'ASC']]
		});
		
		// If no remaining tasks
		if (remainingTasks.length === 0) {
			return await interaction.reply({
				content: confirmationContent + '\n✅ No pending tasks!',
				ephemeral: false,
			});
		}
		
		await sendRemainingTasksEmbed(interaction, remainingTasks, confirmationContent)
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
