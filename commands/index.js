import {REST, Routes} from "discord.js";
import {CONFIG} from "../config.js";
import {ADD_TASK, COMPLETE_TASK, LIST_ACTIVE_TASKS, RANDOM, EDIT_TASK, REFRESH, TAG, UNTAG, TAG_ADD, PLAN, UNPLAN, ADD_PLAN} from "./commandNames.js";

// Add Command
import {addTask, addTaskCommand} from './addTask.js'

// Complete Task Command
import {completeTask, completeTaskCommand} from './completeTask.js'

// List Active Tasks Command
import {listActiveTasks, listActiveTasksCommand} from './listActiveTasks.js'

// Random Task Command
import {randomTask, randomTaskCommand} from './randomTask.js'

// Edit Task Command
import {editTask, editTaskCommand} from './editTask.js'

// Refresh Task Command
import {refreshTask, refreshTaskCommand} from './refreshTask.js'

// Tag Command
import {addTag, addTagCommand} from './tag.js'

// Untag Command
import {removeTag, removeTagCommand} from './untag.js'

// Plan Task Command
import {planTask, planTaskCommand} from './planTask.js'

// Unplan Task Command
import {unplanTask, unplanTaskCommand} from './unplanTask.js'

// Add Plan Task Command
import {addPlanTask, addPlanTaskCommand} from './addPlanTask.js'

// Tag Add Command
import {tagAdd, tagAddCommand} from './tagAdd.js'

const COMMANDS = [
	addTaskCommand,
	completeTaskCommand,
	listActiveTasksCommand,
	randomTaskCommand,
	editTaskCommand,
	refreshTaskCommand,
	addTagCommand,
	removeTagCommand,
	planTaskCommand,
	unplanTaskCommand,
	addPlanTaskCommand,
	tagAddCommand,
]

export const COMMAND_EXECUTIONS = {
	[ADD_TASK]: addTask,
	[COMPLETE_TASK]: completeTask,
	[LIST_ACTIVE_TASKS]: listActiveTasks,
	[RANDOM]: randomTask,
	[EDIT_TASK]: editTask,
	[REFRESH]: refreshTask,
	[TAG]: addTag,
	[UNTAG]: removeTag,
	[PLAN]: planTask,
	[UNPLAN]: unplanTask,
	[ADD_PLAN]: addPlanTask,
	[TAG_ADD]: tagAdd,
}

export const registerCommands = async () => {
	const rest = new REST({ version: '10' }).setToken(CONFIG.BOT_TOKEN);
	await rest.put(
		Routes.applicationGuildCommands(CONFIG.CLIENT_ID, CONFIG.GUILD_ID),
		{ body: COMMANDS.map(command => command.toJSON()) }
	);
}

