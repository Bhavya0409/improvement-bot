# Refresh Task Feature Implementation Plan

## Overview
Implement a new "/refresh" slash command that allows resetting task age while maintaining completion history via an `instances` table. Involves: (1) renaming `improvements` table to `tasks` and adding `lastCompletedAt` column, (2) creating `instances` table with FK constraint, (3) refactoring models, (4) building refresh command with confirmation, and (5) updating age calculation logic.

## Implementation Steps

### 0. Save plan to plan.md ✅
Document this implementation plan in prompts/refresh-task/plan.md for reference during execution.

### 1. Create migration to rename table and add lastCompletedAt
**File**: `migrations/20260506034929-rename-improvements-to-tasks.cjs`

Create migration that:
- Renames `improvements` table to `tasks`
- Adds `lastCompletedAt` column (DATE, nullable)
- Includes proper up/down rollback logic

### 2. Rename and refactor Improvement model to Task
**File**: `db/models/task.js` (rename from `improvement.js`)

Changes:
- Rename class from `Improvement` to `Task`
- Update `tableName: 'tasks'`
- Add `lastCompletedAt` field definition (DATE, nullable)

### 3. Update model exports
**File**: `db/models/index.js`

Changes:
- Import `defineTask` from `task.js` instead of `defineImprovement` from `improvement.js`
- Export `Task` instead of `Improvement`

### 4. Update all Task imports across codebase
**Files to update**:
- `main.js`
- `commands/completeTask.js`
- `commands/listActiveTasks.js`
- `commands/editTask.js`
- `commands/randomTask.js`

Changes:
- Replace `import {Improvement}` with `import {Task}`
- Update all references from `Improvement` to `Task`

### 5. Create migration for instances table
**File**: `migrations/20260506034930-instances.cjs`

Create migration that:
- Creates `instances` table with columns:
  - `id` (auto-increment PK)
  - `task_id` (INT, FK → tasks.id)
  - `completedAt` (DATE, not nullable)
  - `createdAt` (DATE)
  - `updatedAt` (DATE)
- Includes proper foreign key constraint
- Includes up/down rollback logic

### 6. Create Instance model
**File**: `db/models/instance.js`

Create model with:
- `id` field (INTEGER, PK, autoIncrement)
- `task_id` field (INTEGER, FK)
- `completedAt` field (DATE, not nullable)
- `belongsTo` association with Task model

### 7. Update Task model with associations
**File**: `db/models/task.js`

Add:
- `hasMany(Instance)` relationship

### 8. Export Instance model
**File**: `db/models/index.js`

Changes:
- Import and export `Instance` model

### 9. Add REFRESH to command names
**File**: `commands/commandNames.js`

Add:
- `export const REFRESH = 'refresh'`

### 10. Create refreshTask command
**File**: `commands/refreshTask.js`

Create command with:
- SlashCommandBuilder for `/refresh`
- Required string option `task` with autocomplete enabled
- Logic:
  1. Parse input to extract task ID if present
  2. Find active task by ID or description
  3. Create new `Instance` record with `task_id` + current timestamp for `completedAt`
  4. Update task's `lastCompletedAt` field (do NOT set `completed` flag)
  5. Send confirmation message: "✅ Task '#X - description' has been refreshed!"
  6. Retrieve all remaining active tasks
  7. Call `sendRemainingTasksEmbed()` with confirmation content

### 11. Register refresh command
**File**: `commands/index.js`

Changes:
- Import `refreshTask` and `refreshTaskCommand`
- Add to `COMMANDS` array
- Add to `COMMAND_EXECUTIONS` object

### 12. Update autocomplete handler
**File**: `main.js`

Changes:
- Update condition to include `'refresh'` command check
- Format refresh suggestions as `${id} - ${description}` matching complete command format

### 13. Update age calculation functions
**File**: `utils.js`

Changes:
- Modify `calculateAge()` to prioritize `lastCompletedAt` when present, fallback to `createdAt`
- Modify `getColorCircle()` with same priority logic
- Modify `getAgeWithColor()` if needed

### 14. Create digest.md
**File**: `prompts/refresh-task/digest.md`

Document:
- Implementation results
- Decisions made
- Verification steps

## Key Considerations

1. **Migration Timing**: Rename migration must succeed before instances migration runs.
2. **Foreign Key Constraints**: Instances FK references tasks(id). Ensure no orphaned task_ids.
3. **Autocomplete Format**: `/refresh` uses identical format to `/complete` for consistency.
4. **Active vs Inactive Tasks**: Autocomplete only shows active tasks (completed = false).
5. **Timestamps**: Instance.createdAt/updatedAt auto-handled by Sequelize. Task.lastCompletedAt manually set.
6. **Confirmation Pattern**: Follow `/complete` command pattern for consistency.

