import {EmbedBuilder} from "discord.js";

export const calculateAge = (createdAt) => {
	const now = new Date();
	const created = new Date(createdAt);
	const diffInMilliseconds = now - created;
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
export const getColorCircle = (createdAt) => {
	const now = new Date();
	const created = new Date(createdAt);
	const diffInMilliseconds = now - created;
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
export const getAgeWithColor = (createdAt) => {
	const colorCircle = getColorCircle(createdAt);
	const age = calculateAge(createdAt);
	return `${colorCircle} ${age}`;
};
export const capitalizeFirstLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
export const sendRemainingTasksEmbed = async (interaction, tasks, confirmationContent) => {
	const ids = tasks.map(task => task.id.toString()).join('\n');
	const taskDescriptions = tasks.map(task => capitalizeFirstLetter(task.value)).join('\n');
	const ages = tasks.map(task => getAgeWithColor(task.createdAt)).join('\n');
	
	const embed = new EmbedBuilder()
		.setColor('#FFA500')
		.setTitle(`⏳ REMAINING ACTIVE TASKS (${tasks.length})`)
		.addFields(
			{ name: 'Age', value: ages, inline: true },
			{ name: 'ID', value: ids, inline: true },
			{ name: 'Task', value: taskDescriptions, inline: true }
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