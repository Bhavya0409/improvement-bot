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
		return 'Now';
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
	const planTasks = tasks.filter(t => isPlanTask(t));
	const regularTasks = tasks.filter(t => !isPlanTask(t));

	const fields = [];
	
	if (planTasks.length > 0) {
		const planAges = planTasks.map(() => '🤔');
		const planSpacer = planTasks.map(() => '\u200B');
		const planDescriptions = planTasks.map(t => capitalizeFirstLetter(t.value));
		
		planAges.push('--------');
		planSpacer.push('-----');
		planDescriptions.push('---------------------------------------------------------------------');
		
		fields.push(
			{ name: '\u200B', value: planAges.join('\n'), inline: true },
			{ name: '\u200B', value: planSpacer.join('\n'), inline: true },
			{ name: 'Plan Tasks', value: planDescriptions.join('\n'), inline: true }
		);
	}
	
	// Add regular tasks fields (if any)
	if (regularTasks.length > 0) {
		const regAges = regularTasks.map(t => getAgeWithColor(t.createdAt, t.lastCompletedAt)).join('\n');
		const regSpacer = regularTasks.map(() => '\u200B').join('\n');
		const regDescriptions = regularTasks.map(t => capitalizeFirstLetter(t.value)).join('\n');

		fields.push(
			{ name: 'Age', value: regAges, inline: true },
			{ name: '\u200B', value: regSpacer, inline: true },
			{ name: 'Tasks', value: regDescriptions, inline: true }
		);
	}

	const embed = new EmbedBuilder()
		.setColor('#FFA500')
		.setTitle(`TASK LIST (${tasks.length})`)
		.addFields(...fields)
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
		include: [{ model: Tag, as: 'tags' }],
	});

	const getSortDate = (task) => new Date(
		task.lastCompletedAt && new Date(task.lastCompletedAt) > new Date(task.createdAt)
			? task.lastCompletedAt
			: task.createdAt
	);

	allTasks.sort((a, b) => getSortDate(a) - getSortDate(b));

	const [planTasks, nonPlanTasks] = allTasks.reduce((acc, task) => {
		acc[isPlanTask(task) ? 0 : 1].push(task);
		return acc;
	}, [[], []]);

	return [...planTasks, ...nonPlanTasks];
}
