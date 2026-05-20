import {TAGS} from "./constants.js";
import {capitalizeFirstLetter} from "./baseUtils.js";

export const doesTaskHaveTag = (task, tag) => {
	return task.tags?.some(t => t.value === tag) ?? false;
}
export const isPlanTask = (task) => doesTaskHaveTag(task, 'plan');
export const isArchivedTask = (task) => doesTaskHaveTag(task, 'archive');
export const prependTask = (task) => {
	const taskDescription = capitalizeFirstLetter(task.value)
	if (doesTaskHaveTag(task, TAGS.BOT)) {
		return `[BOT] - ${taskDescription}`;
	} else if (doesTaskHaveTag(task, TAGS.BUY)) {
		return `[BUY] - ${taskDescription}`;
	} else if (doesTaskHaveTag(task, TAGS.CAR)) {
		return `[CAR] - ${taskDescription}`;
	}
	return taskDescription
}