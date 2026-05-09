# Tags Feature - Plan

## Overview
Add a tags system to allow metadata grouping of tasks, with many-to-many support via a join table.

---

## Database Updates

### Migration 1: `20260508000001-create-tags.cjs`
- Create `tags` table with columns: `id`, `value` (unique string), `displayValue` (string), `createdAt`, `updatedAt`

### Migration 2: `20260508000002-create-task-tags.cjs`
- Create `task_tags` join table with columns: `id`, `task_id` (FK → tasks.id, CASCADE), `tag_id` (FK → tags.id, CASCADE), `createdAt`, `updatedAt`

### Seeder: `20260508000001-seed-tags.cjs`
- Insert 3 default tags: `{ value: 'bot', displayValue: 'Bot' }`, `{ value: 'buy', displayValue: 'Buy' }`, `{ value: 'plan', displayValue: 'Plan' }`

---

## Model Updates

### New: `db/models/tag.js`
- Define `Tag` model with `id`, `value`, `displayValue`, timestamps

### New: `db/models/taskTag.js`
- Define `TaskTag` model with `id`, `task_id`, `tag_id`, timestamps

### Modified: `db/models/index.js`
- Import and initialize `Tag` and `TaskTag`
- Set up `Task.belongsToMany(Tag)` and `Tag.belongsToMany(Task)` through `TaskTag`
- Add `TaskTag.belongsTo(Task)` and `TaskTag.belongsTo(Tag)` for include queries

---

## Command Updates

### Modified: `commands/commandNames.js`
- Add `ADD_TAG = 'addtag'` and `REMOVE_TAG = 'removetag'`

### Modified: `commands/addTask.js`
- Import `Tag` and `TaskTag`
- Add optional `tag` string option with `setAutocomplete(true)`
- After task creation, if tag provided: validate it exists in DB, create `TaskTag` entry

### New: `commands/addTag.js`
- Command: `/addtag`
- Options:
  - `task` — autocomplete of non-completed tasks (`id - value` format)
  - `tag` — autocomplete of tags not already on the task
- Logic: validate task exists (non-completed), validate tag exists, check tag not already on task, create `TaskTag`
- Reply: confirmation + remaining tasks embed

### New: `commands/removeTag.js`
- Command: `/removetag`
- Options:
  - `task` — autocomplete of non-completed tasks
  - `tag` — autocomplete of tags currently on the task
- Logic: validate task, validate tag, validate `TaskTag` exists, destroy it
- Reply: confirmation + remaining tasks embed

### Modified: `commands/index.js`
- Import and register `addTagCommand`, `addTag`, `removeTagCommand`, `removeTag`
- Add both to `COMMANDS` array and `COMMAND_EXECUTIONS` map

---

## Autocomplete Handler Updates

### Modified: `main.js`
- Replace old inline autocomplete handler with a unified handler
- Import `Tag`, `TaskTag`, `Op` from Sequelize
- Handle `focusedOption.name === 'task'` for all commands (with `id - value` format, except `edit` which uses value-only)
- Handle `focusedOption.name === 'tag'` per command:
  - `add`: all tags
  - `addtag`: tags NOT already on selected task
  - `removetag`: tags currently ON the selected task

---

## Post
- Generate `prompts/tags/digest.md` summarizing all files changed
- Compare digest to plan and note differences

