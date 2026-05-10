# Plan Command - Implementation Digest

**Date:** May 10, 2026

## Summary

Added a new `/plan` slash command that assigns the "plan" tag to a task in a single step. The command is a shorthand for the common workflow of tagging a stuck task as "planned" so it surfaces at the top of the list for review.

---

## Files Changed

### `commands/commandNames.js`
- Added `export const PLAN = 'plan'`

### `commands/planTask.js` *(new file)*
- Defines the `planTaskCommand` (`SlashCommandBuilder`) with a single required autocomplete `task` option.
- Handler (`planTask`):
  1. Parses `task` value in `"id - value"` format.
  2. Looks up the task by ID (must be active/incomplete).
  3. Looks up the "plan" tag via `Tag.findOne({ where: { value: 'plan' } })`.
  4. Guards against the tag already being on the task.
  5. Creates a `TaskTag` record to associate the tag.
  6. Calls `sendRemainingTasksEmbed` with a confirmation message.

### `commands/index.js`
- Imported `PLAN` from `commandNames.js`.
- Imported `planTask` and `planTaskCommand` from `planTask.js`.
- Added `planTaskCommand` to the `COMMANDS` array (registered with Discord).
- Added `[PLAN]: planTask` to the `COMMAND_EXECUTIONS` map.

### `main.js`
- Imported `PLAN` from `commandNames.js`.
- Extended the `task` autocomplete block with a `PLAN`-specific branch:
  - Fetches the "plan" tag by `value: 'plan'`.
  - Queries all `TaskTag` rows with that `tag_id` to collect `task_id`s already planned.
  - Uses `Op.notIn` to exclude those tasks from the autocomplete results, so users only see tasks that don't yet have the "plan" tag.

---

## Key Decisions

| Decision | Rationale |
|---|---|
| Filter at autocomplete level, not submission level | Required by spec; prevents the user from even selecting an already-planned task |
| `Op.notIn` exclusion | Consistent with existing `addtag` tag-exclusion pattern in the codebase |
| Tag lookup by `value: 'plan'` (lowercase) | Matches the seeded value in `20260508000003-seed-default-tags.cjs` |
| Guard against duplicate in handler | Defense-in-depth in case the task somehow already has the tag |

