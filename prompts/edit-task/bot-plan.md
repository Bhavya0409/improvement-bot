# Plan: Add duplicate description validation + create /edit command

Adds duplicate description validation to the `/add` command, and creates the new `/edit` command to update task descriptions with descriptions-only autocomplete.

## Steps

### Part 1: Update /add command with duplicate check
1. In [addTask.js](../../commands/addTask.js) handler, after trimming `taskDescription`, add a database query to check if a non-completed task with matching description already exists
2. If duplicate found, return error: `❌ A task with this description already exists.`
3. Only proceed with creating the new improvement if duplicate check passes

### Part 2: Create /edit command
4. Add `EDIT = 'edit'` constant to [commandNames.js](../../commands/commandNames.js)
5. Create new file [editTask.js](../../commands/editTask.js) with `SlashCommandBuilder` command definition and handler
6. In command builder, add two required string options: `task` (autocomplete enabled) and `new_description`
7. Update [main.js](../../main.js) autocomplete handler to also respond when `commandName === 'edit'`, returning **only task descriptions** (no ID prefix)
8. In handler, validate `new_description` is not empty/whitespace-only, throw error if empty
9. Parse selected task description, find matching non-completed task, validate `new_description` doesn't duplicate another task's description, update task's `value` field
10. Show confirmation message: `✅ Task '#ID - old description' has been updated to 'new description'!`
11. Retrieve and display remaining active tasks in same embed format as completeTask
12. Update [commands/index.js](../../commands/index.js) to import, register, and add to `COMMAND_EXECUTIONS`
