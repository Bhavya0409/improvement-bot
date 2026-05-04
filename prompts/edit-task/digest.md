# Digest: /edit Command Implementation

## Overview
The `/edit` command allows users to edit the description of non-completed tasks. The command uses autocomplete to select which task to edit (descriptions only, no ID prefix), and then accepts a new description via a free-text field.

## Command Structure
- **Command Name**: `edit`
- **Parameters**:
  1. `task` (string, required, autocomplete): The task description to edit. Autocomplete shows only task descriptions (no ID prefix). Must be selected from autocomplete options.
  2. `new_description` (string, required): The new description for the task. Free-text field, populated after selecting a task.

## Key Features
1. **Autocomplete**: Shows only task descriptions (no ID prefix unlike `/complete`)
2. **Duplicate Check**: New description cannot match existing non-completed tasks
3. **Age Preservation**: The task's `age` field stays the same (refers to `createdAt`, not updated)
4. **Confirmation**: Returns a success message and displays remaining active tasks in an embed

## Implementation Details

### editTask.js Handler
The handler should:
1. Get the selected `task` and `new_description` parameters
2. Trim the `new_description` and validate it's not empty/whitespace-only
3. Parse the selected task description to find the matching improvement record (where `value === task && completed === false`)
4. Check if `new_description` already exists for another non-completed task
5. If duplicate found, return error: `❌ A task with this description already exists.`
6. Update the improvement's `value` field with `new_description`
7. Send confirmation: `✅ Task '#ID - old description' has been updated to 'new description'!`
8. Retrieve and display remaining active tasks in the same embed format as `/complete`

### Autocomplete Handler (main.js)
The autocomplete is already configured in main.js to:
- Check if `interaction.commandName === 'edit'`
- Return only task descriptions (no ID prefix)
- Filter tasks based on focused value
- Return up to 25 results

## Database
Uses the `Improvement` model with fields:
- `id`: Auto-increment primary key
- `value`: Task description (STRING)
- `completed`: Boolean flag (defaults to false)
- `completedAt`: Optional timestamp for when task was completed
- `createdAt`: Timestamp for when task was created (preserved)

## Error Handling
- Task description cannot be empty or whitespace-only
- New description cannot duplicate existing non-completed tasks
- Missing or invalid task selection
- Database operation failures

## Return Format
On success:
1. Confirmation message with old and new description
2. Embed with remaining active tasks (Age | ID | Task columns)
3. Footer showing total active tasks count

If no tasks remain, only show confirmation message.

