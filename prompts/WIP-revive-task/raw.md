# New Feature - Revive a Task (WIP)

## Problem

If I want to redo a task, then the only way for me to do it is to either add a new task with a similar name/description, or refresh a task.
If a task was completed, then there is no way to refresh the task, so I'd have to create a new one.
There exists value in repeating a task that was already completed.

## Solution

Implement a way to "revive" an existing completed task. That way, the id, description, tags, etc. would be retained.

## Implementation

### Values

TASK_DATABASE_VALUE = can_revive

### Steps

1. Add a new field to the task table, "TASK_DATABASE_VALUE". This will be a boolean
   - The purpose of this field is to allow a task be revived.
   - When searching for tasks, this is an easy way to see which tasks can be revived, to simplify autocomplete
   - This also avoids having to go back and adjust previous tasks to be revived, or making that effort easier

### Open Questions / Uncertainties

1. Instances table
   - Do I reuse or create new?
   - How does refreshing a task affect (if at all) a revived/revivable task