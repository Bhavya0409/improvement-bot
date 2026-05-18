# Digest: listtype Filter for /list Command

## What Was Built

Added an optional `listtype` autocomplete parameter to the `/list` slash command. When omitted, the command behaves exactly as before (returns all tasks). When provided, it filters the task list to only tasks that carry the matching tag.

## Behaviour

| Scenario | Result |
|---|---|
| `listtype` not provided | Full task list returned as normal |
| `listtype` provided, tag exists | Filtered task list returned with confirmation content |
| `listtype` provided, tag not found | Ephemeral error reply |
| `listtype` provided, tag valid but no tasks match | Empty state message mentioning the tag |

## Files Changed

- **`commands/listActiveTasks.js`** — Added `.addStringOption()` with `setAutocomplete(true)` to the `SlashCommandBuilder`. Handler reads `listtype`, validates against `Tag.findOne`, filters tasks, and passes confirmation content to `sendRemainingTasksEmbed`.
- **`main.js`** — Imported `LIST_ACTIVE_TASKS` from `commandNames.js`. Added `listtype` autocomplete block that returns all tags as choices.

## Key Decisions

- **Ephemeral error**: Invalid tag input replies with `ephemeral: true` so only the user sees it.
- **No embed title change**: The embed title stays as `TASK LIST (n)`. The active filter is communicated via `confirmationContent` above the embed.
- **Autocomplete option name**: Named `listtype` (lowercase) to satisfy Discord's slash command option naming rules.
