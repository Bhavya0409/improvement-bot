import {EmbedBuilder} from "discord.js";
import {Tag, Task} from "./db/models/index.js";

export const calculateAge = (createdAt, lastCompletedAt) => {
	// Prioritize lastCompletedAt if it exists
	const referenceDate = lastCompletedAt && new Date(lastCompletedAt) > new Date(createdAt)
		? new Date(lastCompletedAt)
		: new Date(createdAt);
	
	const now = new Date();
	const diffInMilliseconds = now - referenceDate;
	const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	const diffInHours = Math.floor(diffInMinutes / 60);
	const diffInDays = Math.floor(diffInHours / 24);
	
	// Less than 1 minute
	if (diffInMinutes < 1) {
		return 'Just now';
	}
	
	// Less than 1 hour
	if (diffInHours < 1) {
		return `${diffInMinutes}m`;
	}
	
	// Less than 1 day
	if (diffInDays < 1) {
		return `${diffInHours}h`;
	}
	
	// 1 day or more
	return `${diffInDays}d`;
};
export const getColorCircle = (createdAt, lastCompletedAt) => {
	// Prioritize lastCompletedAt if it exists
	const referenceDate = lastCompletedAt && new Date(lastCompletedAt) > new Date(createdAt)
		? new Date(lastCompletedAt)
		: new Date(createdAt);
	
	const now = new Date();
	const diffInMilliseconds = now - referenceDate;
	const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInHours / 24);
	
	// 🟢 < 1 day
	if (diffInDays < 1) {
		return '🟢';
	}
	
	// 🟡 1-2 days (upper limit is inclusive)
	if (diffInDays <= 2) {
		return '🟡';
	}
	
	// 🟠 3-6 days (upper limit is inclusive)
	if (diffInDays <= 6) {
		return '🟠';
	}
	
	// 🔴 7+ days
	return '🔴';
};
export const getAgeWithColor = (createdAt, lastCompletedAt) => {
	const colorCircle = getColorCircle(createdAt, lastCompletedAt);
	const age = calculateAge(createdAt, lastCompletedAt);
	return `${colorCircle} ${age}`;
};
export const capitalizeFirstLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
export const isPlanTask = (task) => {
	return task.tags?.some(tag => tag.value === 'plan') ?? false;
};
export const sendRemainingTasksEmbed = async (interaction, tasks, confirmationContent) => {
	// planTasks first, then regular (getTasks already orders this, but filter here for clarity)
	const sorted = [
		...tasks.filter(t => isPlanTask(t)),
		...tasks.filter(t => !isPlanTask(t)),
	];

	const ages = sorted.map(task => isPlanTask(task) ? '🤔' : getAgeWithColor(task.createdAt, task.lastCompletedAt)).join('\n') || '\u200B';
	const spacer = sorted.map(() => '\u200B').join('\n') || '\u200B';
	const descriptions = sorted.map(task => capitalizeFirstLetter(task.value)).join('\n') || '\u200B';

	const embed = new EmbedBuilder()
		.setColor('#FFA500')
		.setTitle(`TASK LIST (${tasks.length})`)
		.addFields(
			{ name: 'Age', value: ages, inline: true },
			{ name: '\u200B', value: spacer, inline: true },
			{ name: 'Task', value: descriptions, inline: true },
		)
		.setFooter({ text: `Total active tasks: ${tasks.length}` });
	
	if (confirmationContent) {
		await interaction.reply({
			content: confirmationContent,
			embeds: [embed],
			ephemeral: false,
		});
	} else {
		await interaction.reply({
			embeds: [embed],
			ephemeral: false,
		});
	}
}
export const getTasks = async () => {
	const allTasks = await Task.findAll({
		where: { completed: false },
		order: [['createdAt', 'ASC']],
		include: [{ model: Tag, as: 'tags' }],
	});

	const [planTasks, nonPlanTasks] = allTasks.reduce((acc, task) => {
		acc[isPlanTask(task) ? 0 : 1].push(task);
		return acc;
	}, [[], []]);

	return [...planTasks, ...nonPlanTasks];
}
