# Unplan Command - Implementation Digest

**Date:** May 10, 2026

## Summary

Added a new `/unplan` slash command that removes the "plan" tag from a task in a single step. It is the direct inverse of the `/plan` command — the autocomplete only shows tasks that already have the "plan" tag, and submission destroys that `TaskTag` record.

---

## Files Changed

### `commands/commandNames.js`
- Added `export const UNPLAN = 'unplan'`

### `commands/unplanTask.js` *(new file)*
- Defines `unplanTaskCommand` (`SlashCommandBuilder`) with a single required autocomplete `task` option.
- Handler (`unplanTask`):
  1. Parses `task` value in `"id - value"` format.
  2. Looks up the task by ID (must be active/incomplete).
  3. Looks up the "plan" tag via `Tag.findOne({ where: { value: 'plan' } })`.
  4. Guards against the tag not being on the task.
  5. Calls `existing.destroy()` to remove the `TaskTag` record.
  6. Calls `sendRemainingTasksEmbed` with a confirmation message.

### `commands/index.js`
- Imported `UNPLAN` from `commandNames.js`.
- Imported `unplanTask` and `unplanTaskCommand` from `unplanTask.js`.
- Added `unplanTaskCommand` to the `COMMANDS` array (registered with Discord).
- Added `[UNPLAN]: unplanTask` to the `COMMAND_EXECUTIONS` map.

### `main.js`
- Imported `UNPLAN` from `commandNames.js`.
- Added an `UNPLAN` autocomplete branch in the `task` handler:
  - Fetches the "plan" tag by `value: 'plan'`.
  - Queries all `TaskTag` rows with that `tag_id` to collect `task_id`s that are planned.
  - Uses `Op.in` to include **only** those tasks in autocomplete results (inverse of `/plan`).
  - Falls back to `id: -1` (empty result) if no plan tag exists or no tasks are planned.

---

## Key Decisions

| Decision | Rationale |
|---|---|
| Filter at autocomplete level, not submission level | Required by spec; users only see tasks eligible to be unplanned |
| `Op.in` inclusion (inverse of `/plan`'s `Op.notIn`) | Symmetrical pattern — show only tasks that have the tag |
| `id: -1` fallback when no planned tasks exist | Ensures an empty autocomplete list rather than showing all tasks |
| Guard against missing tag in handler | Defense-in-depth, consistent with `/plan` implementation |

