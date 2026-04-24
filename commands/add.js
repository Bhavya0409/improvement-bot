import { SlashCommandBuilder } from 'discord.js';
import db from '../models/index.js';

export default {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add a new task to your improvements list')
		.addStringOption(option =>
			option
				.setName('task')
				.setDescription('The task name or description')
				.setRequired(true)
				.setMaxLength(100)
		),
	
	async execute(interaction) {
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
			const improvement = await db.Improvement.create({
				value: taskDescription,
				completed: false,
			});

			// Send success reply
			await interaction.reply({
				content: `✅ Task '${improvement.value}' added to your improvements list!`,
				ephemeral: false,
			});
		} catch (error) {
			console.error('Error in add command:', error);
			await interaction.reply({
				content: '❌ Failed to create task. Please try again.',
				ephemeral: true,
			});
		}
	},
};

