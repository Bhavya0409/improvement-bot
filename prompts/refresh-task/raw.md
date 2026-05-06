# New Feature - Refresh Task

## Description

This new feature involves a new slash command "/refresh" that will refresh an existing task. 

### Purpose/Goals

1. The completion of an old task, while retaining the task in the embed
2. The ability for a task to reset the age in the embed, while maintaining the existance
3. To avoid flooding the improvements table with repeated tasks
4. To avoid retyping the same task multiple times
5. To track when and how often I complete a task

### Requirements

#### Database Updates

The following updates should be performed in a new migration:

1. "improvements"
   - Update name of "improvements" table to "tasks"
   - Add a new column "lastCompletedAt" - timestamp, nullable
2. "instances"
   - Create a new table "instances"
   - This table should have 5 columns:
     - id - auto incrementing, number
     - task_id - references id column of tasks
     - completedAt - timestamp, not nullable
     - createdAt - timestamp, set to when new record created
     - updatedAt - timestamp, set to when new record created, or updated

#### Application Updates

1. Create a new database model "Instance" for the new table, with associated connections
2. Create a new slash command, with the same file/folder/logic approach as the other slash commands.
   3. Name - "/refresh"
   4. This command will take 1 argument, the task itself. The logic should work the same as the "/complete" command where it includes an autocomplete with the task id and the task description.
   5. This command should add a new record to the Instances table, setting the task_id to the task id, and the other 3 timestamps to be now.
   6. This command should not update the completedAt field of the task in the "tasks" table
   7. This command should update the "lastCompletedAt" field of the task
   8. The calculate age function should prioritize looking at this new "lastCompletedAt" field, and look at the "createdAt" field if this new field doesn't exist

#### Considerations / Questions
1. Should I not use the "lastCompletedAt" field and instead do a JOIN on the tables to find the last completed at date?
   - Pros: Don't need extra column for same information
   - Cons: Potentially expensive JOIN
2. New migration file is created "[20260506034929-rename-improvements-to-tasks.cjs](../../migrations/20260506034929-rename-improvements-to-tasks.cjs)" - put migration info here.
3. Before performing any updates - create a comprehensive plan, call it "plan.md" and put it in the same folder as this file. After the plan has completed execution, create a "digest.md" and put it in the same folder as this file.