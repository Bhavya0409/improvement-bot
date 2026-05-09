import {SlashCommandBuilder} from "discord.js";
import {Tag, Task, TaskTag} from "../db/models/index.js";
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
	.addStringOption(option =>
		option
			.setName('tag')
			.setDescription('Optional tag for this task')
			.setRequired(false)
			.setAutocomplete(true)
	)


const addTask =  async (interaction) => {
	try {
		const taskDescription = interaction.options.getString('task').trim();
		const tagValue = interaction.options.getString('tag');
		
		// Validate task is not empty after trimming
		if (!taskDescription) {
			return await interaction.reply({
				content: '❌ Task description cannot be empty.',
				ephemeral: true,
			});
		}
		
		// Validate tag if provided
		let tag = null;
		if (tagValue) {
			tag = await Tag.findOne({ where: { value: tagValue } });
			if (!tag) {
				return await interaction.reply({
					content: '❌ The selected tag does not exist.',
					ephemeral: true,
				});
			}
		}
		
		// Check if a task with the same description already exists (non-completed)
		const existingTask = await Task.findOne({
			where: {
				value: taskDescription,
				completed: false
			}
		});
		
		if (existingTask) {
			return await interaction.reply({
				content: '❌ A task with this description already exists.',
				ephemeral: true,
			});
		}
		
		// Create the improvement record
		const improvement = await Task.create({
			value: taskDescription,
			completed: false,
		});
		
		// Link tag if provided
		if (tag) {
			await TaskTag.create({ task_id: improvement.id, tag_id: tag.id });
		}
		
		// Retrieve all non-completed tasks
		const allTasks = await Task.findAll({
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