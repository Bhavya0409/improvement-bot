import {EmbedBuilder} from "discord.js";

import {SECTIONS} from "./constants.js";
import {Tag, Task} from "../db/models/index.js";

import {isArchivedTask, isBotTask, isBuyTask, isDeferredTask, isPlanTask, prependTask} from "./taskUtils.js";
import {calculateAge, getAgeWithColor, getDeferredTaskAgeWithColor} from "./embedUtils.js";
import {capitalizeFirstLetter} from "./baseUtils.js";

const embedConfig = {
	[SECTIONS.PLANNED]: {
		ageMapFn: () => '🤔',
		descriptionName: 'Planned Tasks'
	},
	[SECTIONS.ARCHIVED]: {
		ageMapFn: calculateAge,
		descriptionName: 'Archived Tasks'
	},
	[SECTIONS.BUY]: {
		ageMapFn: () => '\u200B',
		descriptionName: 'Items to Buy'
	},
	[SECTIONS.BOT]: {
		ageMapFn: () => '\u200B',
		descriptionName: 'Bot Tasks'
	},
	[SECTIONS.DEFERRED]: {
		ageMapFn: getDeferredTaskAgeWithColor,
		descriptionName: 'Deferred Tasks'
	},
	[SECTIONS.DEFAULT]: {
		ageMapFn: getAgeWithColor,
		ageName: 'Age',
	}
}
const addSectionToFields = (fields, section, unsortedTasks) => {
	// If fields or tasks is not passed in OR if tasks is an empty array, do nothing
	if (!unsortedTasks || unsortedTasks.length === 0) return
	const {ageMapFn, descriptionName = 'Tasks', ageName = '\u200B'} = embedConfig[section]
	const tasks = unsortedTasks.sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
	
	const ages = tasks.map(ageMapFn);
	const spacer = tasks.map(() => '\u200B')
	const descriptions = tasks.map(task => prependTask(task))
	
	ages.push('----------');
	spacer.push('-----');
	descriptions.push('------------------------------------------------------------------');
	
	fields.push(
		{ name: ageName, value: ages.join('\n'), inline: true },
		{ name: '\u200B', value: spacer.join('\n'), inline: true },
		{ name: descriptionName, value: descriptions.join('\n'), inline: true }
	);
}

export const sendTasksEmbed = async (interaction, tasks, confirmationContent) => {
	const plannedTasks = []
	const archivedTasks = []
	const deferredTasks = []
	const regularTasks = []
	const buyTasks = []
	const botTasks = []
	const fields = [];
	
	// Partition tasks for the different sections
	tasks.forEach((task) => {
		if (isArchivedTask(task)) {
			archivedTasks.push(task)
		} else if (isBotTask(task)) {
			botTasks.push(task)
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

	addSectionToFields(fields, SECTIONS.PLANNED, plannedTasks)
	addSectionToFields(fields, SECTIONS.ARCHIVED, archivedTasks)
	addSectionToFields(fields, SECTIONS.DEFERRED, deferredTasks)
	addSectionToFields(fields, SECTIONS.BUY, buyTasks)
	addSectionToFields(fields, SECTIONS.BOT, botTasks)
	addSectionToFields(fields, SECTIONS.DEFAULT, regularTasks)

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
		order: [['createdAt', 'ASC']],
	});
	
	const getSortDate = (task) => new Date(
		task.lastCompletedAt && new Date(task.lastCompletedAt) > new Date(task.createdAt)
			? task.lastCompletedAt
			: task.createdAt
	);
	
	allTasks.sort((a, b) => getSortDate(b) - getSortDate(a));
	
	return allTasks;
}