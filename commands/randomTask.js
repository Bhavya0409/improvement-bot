import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {RANDOM} from "./commandNames.js";
import {getTasks} from "../utils/discordUtils.js";
import {isPlanTask} from "../utils/taskUtils.js";
import {capitalizeFirstLetter} from "../utils/baseUtils.js";
import {getAgeWithColor} from "../utils/embedUtils.js";

const randomTaskCommand = new SlashCommandBuilder()
	.setName(RANDOM)
	.setDescription('Get a random active task')


const randomTask = async (interaction) => {
	try {
		// Retrieve all non-completed, non-plan tasks
		const tasks = (await getTasks()).filter(t => !isPlanTask(t));

		// If no tasks, reply with a simple message
		if (tasks.length === 0) {
			return await interaction.reply({
				content: '✅ No pending tasks!',
				ephemeral: false,
			});
		}

		// Pick a random task
		const randomIndex = Math.floor(Math.random() * tasks.length);
		const randomTaskData = tasks[randomIndex];

		// Build the three columns for the embed (single row)
		const age = getAgeWithColor(randomTaskData.createdAt, randomTaskData.lastCompletedAt);
		const id = randomTaskData.id.toString();
		const taskDescription = capitalizeFirstLetter(randomTaskData.value);

		// Create and configure the embed
		const embed = new EmbedBuilder()
			.setColor('#FFA500')
			.setTitle('🎲 RANDOM ACTIVE TASK')
			.addFields(
				{ name: 'Age', value: age, inline: true },
				{ name: 'ID', value: id, inline: true },
				{ name: 'Task', value: taskDescription, inline: true },
			)
			.setFooter({ text: `Picked from ${tasks.length} active task(s)` });

		// Reply with the embed
		await interaction.reply({
			embeds: [embed],
			ephemeral: false,
		});

	} catch (error) {
		console.error('Error in random task command:', error);
		await interaction.reply({
			content: '❌ Failed to retrieve a random task. Please try again.',
			ephemeral: true,
		});
	}
}

export {
	randomTaskCommand,
	randomTask
}



