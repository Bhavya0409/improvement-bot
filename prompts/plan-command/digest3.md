# Add Plan Command - Implementation Digest

**Date:** May 10, 2026

## Summary

Added a new `/addplan` slash command that creates a new task and immediately assigns the "plan" tag to it in a single step. It combines the logic of `/add` and `/plan` as a convenience shorthand.

---

## Files Changed

### `commands/commandNames.js`
- Added `export const ADD_PLAN = 'addplan'`

### `commands/addPlanTask.js` *(new file)*
- Defines `addPlanTaskCommand` (`SlashCommandBuilder`) with a single required plain-text `task` option (no autocomplete — free-text input like `/add`).
- Handler (`addPlanTask`):
  1. Trims and validates the task description is non-empty.
  2. Checks for a duplicate active task with the same description.
  3. Looks up the "plan" tag via `Tag.findOne({ where: { value: 'plan' } })`.
  4. Creates the `Task` record.
  5. Creates a `TaskTag` record linking the task to the "plan" tag.
  6. Calls `sendRemainingTasksEmbed` with a confirmation message.

### `commands/index.js`
- Imported `ADD_PLAN` from `commandNames.js`.
- Imported `addPlanTask` and `addPlanTaskCommand` from `addPlanTask.js`.
- Added `addPlanTaskCommand` to the `COMMANDS` array (registered with Discord).
- Added `[ADD_PLAN]: addPlanTask` to the `COMMAND_EXECUTIONS` map.

### `main.js`
- No changes needed — the `task` option is plain free-text, so no autocomplete branch is required.

---

## Key Decisions

| Decision | Rationale |
|---|---|
| No autocomplete on `task` option | Free-text input matching `/add` — user types a new task name, not selecting an existing one |
| Duplicate check before creation | Consistent with `/add` behavior to prevent accidental duplicates |
| "plan" tag looked up by `value: 'plan'` | Matches seeded value; fails gracefully if tag is missing |
| No optional tag parameter | Command is a focused shorthand — "plan" tag is always applied, no other tags needed |

