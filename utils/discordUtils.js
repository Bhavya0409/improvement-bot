import {EmbedBuilder} from "discord.js";

import {TAGS} from "./constants.js";
import {Tag, Task} from "../db/models/index.js";

import {isArchivedTask, isPlanTask} from "./taskUtils.js";
import {calculateAge, getAgeWithColor} from "./embedUtils.js";
import {capitalizeFirstLetter} from "./baseUtils.js";

const embedConfig = {
	plan: {
		ageMapFn: () => '🤔',
		descriptionName: 'Planned Tasks'
	},
	archive: {
		ageMapFn: t => calculateAge(t.createdAt, t.lastCompletedAt),
		descriptionName: 'Archived Tasks'
	},
	default: {
		ageMapFn: t => getAgeWithColor(t.createdAt, t.lastCompletedAt),
		ageName: 'Age',
	}
}

const pushToFields = (fields, tasks, tag = 'default') => {
	// If fields or tasks is not passed in OR if tasks is an empty array, do nothing
	if (!fields || !tasks || tasks.length === 0) return
	const {ageMapFn, descriptionName = 'Tasks', ageName = '\u200B'} = embedConfig[tag]
	
	const ages = tasks.map(ageMapFn);
	const spacer = tasks.map(() => '\u200B')
	const descriptions = tasks.map(t => capitalizeFirstLetter(t.value))
	
	ages.push('--------');
	spacer.push('-----');
	descriptions.push('---------------------------------------------------------------------');
	
	fields.push(
		{ name: ageName, value: ages.join('\n'), inline: true },
		{ name: '\u200B', value: spacer.join('\n'), inline: true },
		{ name: descriptionName, value: descriptions.join('\n'), inline: true }
	);
}

export const sendRemainingTasksEmbed = async (interaction, tasks, confirmationContent) => {
	const plannedTasks = []
	const archivedTasks = []
	const regularTasks = []
	const fields = [];
	
	// Partition tasks for the different sections
	tasks.forEach((task) => {
		if (isArchivedTask(task)) {
			archivedTasks.push(task)
		} else if (isPlanTask(task)) {
			plannedTasks.push(task)
		} else {
			regularTasks.push(task)
		}
	})
	
	// Create individual embed sections for each task section
	pushToFields(fields, plannedTasks, TAGS.PLAN)
	pushToFields(fields, archivedTasks, TAGS.ARCHIVE)
	pushToFields(fields, regularTasks)
	
	// Set up embed values
	const descriptionFieldLength = regularTasks.map(t => capitalizeFirstLetter(t.value)).join('\n').length
	const charsLeft = 1024 - descriptionFieldLength;
	const embedColor = charsLeft < 100 ? '#C0392B' : charsLeft < 300 ? '#D4AC0D' : '#1E8449';
	
	const embed = new EmbedBuilder()
		.setColor(embedColor)
		.setTitle(`TASK LIST (${tasks.length})`)
		.addFields(...fields)
		.setFooter({ text: `${charsLeft}/1024 - Characters left\n${regularTasks.length} - Total active tasks` });
	
	
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
	
	allTasks.sort((a, b) => getSortDate(b) - getSortDate(a));
	
	return allTasks;
}