import {Op} from "sequelize";

import {ADD_TASK, EDIT_TASK, PLAN, TAG, UNPLAN, UNTAG} from "../commands/commandNames.js";
import {TaskTag, Tag, Task} from "../db/models/index.js";

import {COMMAND_CONFIG} from "../commands/index.js";

const ALIAS_TO_COMMAND = Object.entries(COMMAND_CONFIG).reduce((acc, [cmdName, config]) => {
	for (const alias of config.aliases) {
		acc[alias] = cmdName;
	}
	return acc;
}, {});

export const resolveCommandName = (name) => ALIAS_TO_COMMAND[name] ?? name;

const getAllPlannedTaskIds = async () => {
	const planTag = await Tag.findOne({ where: { value: 'plan' } });
	const plannedTaskTags = await TaskTag.findAll({ where: { tag_id: planTag.id } });
	return plannedTaskTags.map(tt => tt.task_id);
}
const getAutocompleteFindOptions = async (resolvedCommandName) => {
	const findOptions = { where: { completed: false } };
	
	switch (resolvedCommandName) {
		case UNTAG:
			// Only show tasks that have at least one tag
			findOptions.include = [{ model: Tag, as: 'tags', required: true }];
			break;
		case PLAN: {
			const plannedTaskIds = await getAllPlannedTaskIds()
			findOptions.where = {
				completed: false,
				...(plannedTaskIds.length > 0 ? { id: { [Op.notIn]: plannedTaskIds } } : {}),
			};
			break;
		}
		case UNPLAN: {
			const plannedTaskIds = await getAllPlannedTaskIds()
			findOptions.where = {
				completed: false,
				...(plannedTaskIds.length > 0 ? { id: { [Op.in]: plannedTaskIds } } : { id: -1 }),
			};
			break;
		}
		default:
			break;
	}
	
	return findOptions
}
export const getAutocompleteSuggestions = async (interaction) => {
	// If the interaction isn't an autocomplete field, do nothing
	if (!interaction.isAutocomplete()) return;
	
	// Convert potential alias to base command name
	const resolvedCommandName = resolveCommandName(interaction.commandName);
	const focusedOption = interaction.options.getFocused(true);
	const {name: autocompleteField, value: userValue} = focusedOption
	
	try {
		if (autocompleteField === 'task') {
			const findOptions = await getAutocompleteFindOptions(resolvedCommandName);
			const tasks = await Task.findAll(findOptions);
			const choices = tasks.map(task => {
				if (resolvedCommandName === EDIT_TASK) {
					return { name: task.value, value: task.value };
				}
				return {
					name: `${task.id} - ${task.value}`,
					value: `${task.id} - ${task.value}`,
				};
			}).filter(c => c.name.toLowerCase().includes(userValue.toLowerCase()));
			return await interaction.respond(choices.slice(0, 25));
		}
		if (autocompleteField === 'tag') {
			switch (resolvedCommandName) {
				case UNTAG: {
					const taskValue = interaction.options.getString('task') || '';
					const taskId = parseInt(taskValue.split(' - ')[0]);
					if (isNaN(taskId)) return await interaction.respond([]);
					const taskTags = await TaskTag.findAll({ where: { task_id: taskId }, include: [{ model: Tag, as: 'tag' }] });
					const choices = taskTags
						.map(tt => ({ name: tt.tag.displayValue, value: tt.tag.value }))
						.filter(c => c.name.toLowerCase().includes(userValue.toLowerCase()));
					return await interaction.respond(choices.slice(0, 25));
				}
				case TAG: {
					const taskValue = interaction.options.getString('task') || '';
					const taskId = parseInt(taskValue.split(' - ')[0]);
					let excludeTagIds = [];
					if (!isNaN(taskId)) {
						const existingTaskTags = await TaskTag.findAll({ where: { task_id: taskId } });
						excludeTagIds = existingTaskTags.map(tt => tt.tag_id);
					}
					const whereClause = excludeTagIds.length > 0 ? { id: { [Op.notIn]: excludeTagIds } } : {};
					const tags = await Tag.findAll({ where: whereClause });
					const choices = tags
						.map(t => ({ name: t.displayValue, value: t.value }))
						.filter(c => c.name.toLowerCase().includes(userValue.toLowerCase()));
					return await interaction.respond(choices.slice(0, 25));
				}
				case ADD_TASK: {
					const tags = await Tag.findAll();
					const choices = tags
						.map(t => ({ name: t.displayValue, value: t.value }))
						.filter(c => c.name.toLowerCase().includes(userValue.toLowerCase()));
					return await interaction.respond(choices.slice(0, 25));
				}
				default:
					return await interaction.respond([]);
			}
		}
	} catch (e) {
		console.error('Error in autocomplete:', e);
		await interaction.respond([]);
	}
}