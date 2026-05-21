import {EmbedBuilder} from "discord.js";

import {TAGS} from "./constants.js";
import {Tag, Task} from "../db/models/index.js";

import {isArchivedTask, isBuyTask, isDeferredTask, isPlanTask, prependTask} from "./taskUtils.js";
import {calculateAge, getAgeWithColor} from "./embedUtils.js";
import {capitalizeFirstLetter} from "./baseUtils.js";

const embedConfig = {
	[TAGS.PLAN]: {
		ageMapFn: () => '🤔',
		descriptionName: 'Planned Tasks'
	},
	[TAGS.ARCHIVE]: {
		ageMapFn: t => calculateAge(t.createdAt, t.lastCompletedAt),
		descriptionName: 'Archived Tasks'
	},
	[TAGS.BUY]: {
		ageMapFn: () => '\u200B',
		descriptionName: 'Items to Buy'
	},
	deferred: {
		ageMapFn: () => '⚪',
		descriptionName: 'Deferred Tasks'
	},
	default: {
		ageMapFn: t => getAgeWithColor(t.createdAt, t.lastCompletedAt),
		ageName: 'Age',
	}
}

const pushToFields = (fields, tasks, sectionTag = 'default') => {
	// If fields or tasks is not passed in OR if tasks is an empty array, do nothing
	if (!fields || !tasks || tasks.length === 0) return
	const {ageMapFn, descriptionName = 'Tasks', ageName = '\u200B'} = embedConfig[sectionTag]
	
	const ages = tasks.map(ageMapFn);
	const spacer = tasks.map(() => '\u200B')
	const descriptions = tasks.map(task => prependTask(task))
	
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
	const deferredTasks = []
	const regularTasks = []
	const buyTasks = []
	const fields = [];
	
	// Partition tasks for the different sections
	tasks.forEach((task) => {
		if (isArchivedTask(task)) {
			archivedTasks.push(task)
		} else if (isPlanTask(task)) {
			plannedTasks.push(task)
		} else if (isDeferredTask(task)) {
			deferredTasks.push(task)
		} else if (isBuyTask(task)) {
			buyTasks.push(task)
		} else {
			regularTasks.push(task)
		}
	})
	
	deferredTasks.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
	
	// Create individual embed sections for each task section
	pushToFields(fields, plannedTasks, TAGS.PLAN)
	pushToFields(fields, archivedTasks, TAGS.ARCHIVE)
	pushToFields(fields, deferredTasks, 'deferred')
	pushToFields(fields, buyTasks, TAGS.BUY)
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