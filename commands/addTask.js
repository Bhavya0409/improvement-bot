import {SlashCommandBuilder} from "discord.js";
import {Improvement} from "../db/models/index.js";
import {ADD_TASK} from "./commandNames.js";
import {sendRemainingTasksEmbed} from "../utils.js";

const addTaskCommand = new SlashCommandBuilder()
	.setName(ADD_TASK)
	.setDescription('Add a new task to your improvements list')
	.addStringOption(option =>
		option
			.setName('task')
			.setDescription('The task name or description')
			.setRequired(true)
			.setMaxLength(100)
	)


const addTask =  async (interaction) => {
	try {
		const taskDescription = interaction.options.getString('task').trim();
		
		// Validate task is not empty after trimming
		if (!taskDescription) {
			return await interaction.reply({
				content: '❌ Task description cannot be empty.',
				ephemeral: true,
			});
		}
		
		// Check if a task with the same description already exists (non-completed)
		const existingTask = await Improvement.findOne({
			where: {
				value: taskDescription,
				completed: false
			}
		});
		
		if (existingTask) {
			return await interaction.editReply({
				content: '❌ A task with this description already exists.',
			});
		}
		
		// Create the improvement record
		const improvement = await Improvement.create({
			value: taskDescription,
			completed: false,
		});
		
		// Retrieve all non-completed tasks
		const allTasks = await Improvement.findAll({
			where: {
				completed: false
			},
			order: [['createdAt', 'ASC']]
		});
		
		// Send success reply with confirmation
		const confirmationContent = `✅ Task '${improvement.value}' added to your improvements list!`;
		
		// If no other tasks exist, just send confirmation
		if (allTasks.length === 0) {
			return await interaction.reply({
				content: confirmationContent,
				ephemeral: false,
			});
		}
		
		await sendRemainingTasksEmbed(interaction, allTasks, confirmationContent)
	} catch (error) {
		console.error('Error in add command:', error);
		await interaction.reply({
			content: '❌ Failed to create task. Please try again.',
			ephemeral: true,
		});
	}
}

export {
	addTaskCommand,
	addTask
}