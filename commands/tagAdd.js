import { SlashCommandBuilder } from 'discord.js';
import { Tag } from '../db/models/index.js';
import { TAG_ADD } from './commandNames.js';
import { capitalizeFirstLetter, getTasks, sendRemainingTasksEmbed } from '../utils.js';

const tagAddCommand = new SlashCommandBuilder()
	.setName(TAG_ADD)
	.setDescription('Create a new tag')
	.addStringOption(option =>
		option
			.setName('value')
			.setDescription('The tag value (used internally, e.g. "buy")')
			.setRequired(true)
	)
	.addStringOption(option =>
		option
			.setName('displayvalue')
			.setDescription('The display label for the tag (defaults to capitalized value)')
			.setRequired(false)
	);

const tagAdd = async (interaction) => {
	try {
		const value = interaction.options.getString('value').toLowerCase().trim();
		const displayValue = interaction.options.getString('displayvalue')?.trim() || capitalizeFirstLetter(value);

		// Check for duplicate
		const existing = await Tag.findOne({ where: { value } });
		if (existing) {
			return await interaction.reply({
				content: `❌ A tag with the value '${value}' already exists.`,
				ephemeral: true,
			});
		}

		await Tag.create({ value, displayValue });
		
		return await interaction.reply({
			content: `✅ Tag '${displayValue}' created successfully!`,
			ephemeral: false,
		});
	} catch (error) {
		console.error('Error in tagadd command:', error);
		await interaction.reply({
			content: '❌ Failed to create tag. Please try again.',
			ephemeral: true,
		});
	}
};

export { tagAddCommand, tagAdd };

