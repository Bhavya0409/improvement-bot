export const doesTaskHaveTag = (task, tag) => {
	return task.tags?.some(t => t.value === tag) ?? false;
}
export const isPlanTask = (task) => doesTaskHaveTag(task, 'plan');
export const isArchivedTask = (task) => doesTaskHaveTag(task, 'archive');