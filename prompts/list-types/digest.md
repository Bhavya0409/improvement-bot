# Digest: tag Filter for /list Command

## What Was Built

Added an optional `tag` autocomplete parameter to the `/list` slash command. When omitted, the command behaves exactly as before (returns all tasks). When provided, it filters the task list to only tasks that carry the matching tag.

## Behaviour

| Scenario | Result |
|---|---|
| `tag` not provided | Full task list returned as normal |
| `tag` provided, tag exists | Filtered task list returned with confirmation content |
| `tag` provided, tag not found | Ephemeral error reply |
| `tag` provided, tag valid but no tasks match | Empty state message mentioning the tag |

## Files Changed

- **`commands/listActiveTasks.js`** — Added `.addStringOption()` with `setAutocomplete(true)` to the `SlashCommandBuilder`. Handler reads `tag`, validates against `Tag.findOne`, filters tasks, and passes confirmation content to `sendRemainingTasksEmbed`.
- **`main.js`** — Imported `LIST_ACTIVE_TASKS` from `commandNames.js`. Folded `/list` into the existing `tag` autocomplete block alongside `/add` (both return all tags).

## Key Decisions

- **Ephemeral error**: Invalid tag input replies with `ephemeral: true` so only the user sees it.
- **No embed title change**: The embed title stays as `TASK LIST (n)`. The active filter is communicated via `confirmationContent` above the embed.
- **Shared autocomplete block**: `/list` reuses the `/add` tag autocomplete block in `main.js` since both need all tags returned.
