import {REST, Routes} from "discord.js";
import {CONFIG} from "../config.js";
import {
	ADD_TASK, COMPLETE_TASK, LIST_ACTIVE_TASKS, RANDOM, EDIT_TASK, REFRESH, TAG, UNTAG, TAG_ADD, PLAN, UNPLAN, ADD_PLAN,
	ARCHIVE_TASK
} from "./commandNames.js";

// Add Command
import {addTask, addTaskCommand} from './addTask.js'

// Add Plan Task Command
import {addPlanTask, addPlanTaskCommand} from './addPlanTask.js'

// Complete Task Command
import {completeTask, completeTaskCommand} from './completeTask.js'

// Edit Task Command
import {editTask, editTaskCommand} from './editTask.js'

// List Active Tasks Command
import {listActiveTasks, listActiveTasksCommand} from './listActiveTasks.js'

// Plan Task Command
import {planTask, planTaskCommand} from './planTask.js'

// Random Task Command
import {randomTask, randomTaskCommand} from './randomTask.js'

// Refresh Task Command
import {refreshTask, refreshTaskCommand} from './refreshTask.js'

// Tag Command
import {addTag, addTagCommand} from './tag.js'

// Tag Add Command
import {tagAdd, tagAddCommand} from './tagAdd.js'

// Unplan Task Command
import {unplanTask, unplanTaskCommand} from './unplanTask.js'

// Untag Command
import {removeTag, removeTagCommand} from './untag.js'

// Archive Task Command
import {archiveTask, archiveTaskCommand} from "./archiveTask.js";

export const COMMAND_CONFIG = {
	[ARCHIVE_TASK]: {
		executionFn: archiveTask,
		commandBuilder: archiveTaskCommand,
		aliases: []
	},
	[ADD_TASK]: {
		executionFn: addTask,
		commandBuilder: addTaskCommand,
		aliases: ['a', 'task']
	},
	[ADD_PLAN]: {
		executionFn: addPlanTask,
		commandBuilder: addPlanTaskCommand,
		aliases: []
	},
	[COMPLETE_TASK]: {
		executionFn: completeTask,
		commandBuilder: completeTaskCommand,
		aliases: ['c']
	},
	[EDIT_TASK]: {
		executionFn: editTask,
		commandBuilder: editTaskCommand,
		aliases: ['e']
	},
	[LIST_ACTIVE_TASKS]: {
		executionFn: listActiveTasks,
		commandBuilder: listActiveTasksCommand,
		aliases: ['l']
	},
	[PLAN]: {
		executionFn: planTask,
		commandBuilder: planTaskCommand,
		aliases: ['p']
	},
	[RANDOM]: {
		executionFn: randomTask,
		commandBuilder: randomTaskCommand,
		aliases: ['ra']
	},
	[REFRESH]: {
		executionFn: refreshTask,
		commandBuilder: refreshTaskCommand,
		aliases: ['re']
	},
	[TAG]: {
		executionFn: addTag,
		commandBuilder: addTagCommand,
		aliases: ['t']
	},
	[TAG_ADD]: {
		executionFn: tagAdd,
		commandBuilder: tagAddCommand,
		aliases: []
	},
	[UNPLAN]: {
		executionFn: unplanTask,
		commandBuilder: unplanTaskCommand,
		aliases: ['up']
	},
	[UNTAG]: {
		executionFn: removeTag,
		commandBuilder: removeTagCommand,
		aliases: ['ut']
	},
}

export const registerCommands = async () => {
	// Build primary command JSON
	const primaryCommands = Object.values(COMMAND_CONFIG).map(c => c.commandBuilder.toJSON());

	// Build alias command JSON (copy of primary with name swapped)
	const aliasCommands = Object.values(COMMAND_CONFIG).flatMap(config => {
		const baseJson = config.commandBuilder.toJSON();
		return (config.aliases ?? []).map(alias => ({ ...baseJson, name: alias }));
	});

	const rest = new REST({ version: '10' }).setToken(CONFIG.BOT_TOKEN);
	await rest.put(
		Routes.applicationGuildCommands(CONFIG.CLIENT_ID, CONFIG.GUILD_ID),
		{ body: [...primaryCommands, ...aliasCommands] }
	);
}
