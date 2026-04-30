# List Active Tasks Feature - Implementation Digest

## Overview
Implemented a new Discord slash command `/list` that displays all pending (non-completed) tasks in a formatted embed with a three-column table layout showing Task ID, Task Description, and Task Age.

## Files Created
1. **commands/listActiveTasks.js** - Main command implementation file

## Files Modified
1. **commands/commandNames.js** - Added `LIST_ACTIVE_TASKS = 'list'` constant
2. **commands/index.js** - Imported and registered the new command

## Implementation Details

### Command: `/list`
- **Description:** View all active tasks
- **Options:** None
- **Output:** Discord embed displaying all pending tasks

### Features
- **Task Filtering:** Queries database for all tasks where `completed = false`
- **Ordering:** Tasks are ordered from oldest to newest (ascending by `createdAt`)
- **Age Calculation:** Displays how long each task has been pending
  - Less than 24 hours: "<1 day ago"
  - 1 day: "1 day ago" (singular)
  - Multiple days: "X days ago" (plural)
- **Text Formatting:** Task descriptions are capitalized (first letter uppercase)
- **Embed Format:** Three-column layout using Discord embed fields (inline=true)
  - Column 1: Task ID
  - Column 2: Task Description
  - Column 3: Task Age

### Error Handling
- Catches database query errors and replies with appropriate error message
- Handles empty task list gracefully with "✅ No pending tasks!" message

### Response Examples

**With Active Tasks:**
```
⏳ ACTIVE TASKS (3)

ID | Task                  | Age
1  | Learn typescript      | 7 days ago
3  | Build discord bot     | 5 days ago
5  | Setup database        | 2 days ago

Total active tasks: 3
```

**With No Active Tasks:**
```
✅ No pending tasks!
```

## Database
No database schema changes required. Uses existing `Improvement` model fields:
- `id` - Primary key
- `value` - Task description
- `completed` - Boolean flag (filtered for false values)
- `createdAt` - Timestamp for age calculation (auto-managed by Sequelize)

## Testing Notes
- Test with various time differences (< 24 hours, 1 day, multiple days)
- Verify singular/plural grammar in age formatting
- Confirm task descriptions are capitalized
- Ensure tasks display in chronological order (oldest first)

