import {SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {Improvement} from "../db/models/index.js";
import {ADD_TASK} from "./commandNames.js";
import {calculateAge, capitalizeFirstLetter} from "../utils.js";

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
		
		// Build embed with all active tasks
		const ids = allTasks.map(task => task.id.toString()).join('\n');
		const taskDescriptions = allTasks.map(task => capitalizeFirstLetter(task.value)).join('\n');
		const ages = allTasks.map(task => calculateAge(task.createdAt)).join('\n');
		
		const embed = new EmbedBuilder()
			.setColor('#FFA500')
			.setTitle(`⏳ ACTIVE TASKS (${allTasks.length})`)
			.addFields(
				{ name: 'ID', value: ids, inline: true },
				{ name: 'Task', value: taskDescriptions, inline: true },
				{ name: 'Age', value: ages, inline: true }
			)
			.setFooter({ text: `Total active tasks: ${allTasks.length}` });
		
		// Send success reply with confirmation and active tasks embed
		await interaction.reply({
			content: confirmationContent,
			embeds: [embed],
			ephemeral: false,
		});
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