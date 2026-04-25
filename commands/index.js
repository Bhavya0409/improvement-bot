import {REST, Routes} from "discord.js";
import {CONFIG} from "../config.js";
import {ADD_COMMAND_NAME} from "./commandNames.js";

// Add Command
import {addNewTask, addCommand} from './addCommand.js'

const COMMANDS = [
	addCommand
]

export const COMMAND_EXECUTIONS = {
	[ADD_COMMAND_NAME]: addNewTask
}

export const registerCommands = async () => {
	const rest = new REST({ version: '10' }).setToken(CONFIG.BOT_TOKEN);
	await rest.put(
		Routes.applicationGuildCommands(CONFIG.CLIENT_ID, CONFIG.GUILD_ID),
		{ body: COMMANDS.map(command => command.toJSON()) }
	);
}