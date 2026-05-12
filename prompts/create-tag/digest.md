# Digest - Create Tag Feature

## Summary

Implemented a new `/tagadd` slash command that allows creating new tags on the fly, inserting a record into the `tags` table.

## Files Changed

### `commands/commandNames.js`
- Added `TAG_ADD = 'tagadd'` constant.

### `commands/tagAdd.js` _(new file)_
- Defines the `/tagadd` slash command with:
  - Required string option: `value` (lowercased/trimmed internally)
  - Optional string option: `displayvalue` (defaults to `capitalizeFirstLetter(value)` if not provided)
- Handler logic:
  - Checks for duplicate `value` in the `tags` table; returns ephemeral error if found.
  - Creates the new `Tag` record.
  - On success, replies with a confirmation message + full task list embed via `sendRemainingTasksEmbed`.

### `commands/index.js`
- Imported `TAG_ADD` from `commandNames.js`.
- Imported `tagAdd` and `tagAddCommand` from `./tagAdd.js`.
- Added `tagAddCommand` to the `COMMANDS` array.
- Added `[TAG_ADD]: tagAdd` to the `COMMAND_EXECUTIONS` map.

