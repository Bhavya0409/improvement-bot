# New Feature

## Purpose
The purpose of this new feature will be to allow me to view the list of active/non-completed tasks currently in the database.

I want to create a new slash command.

This new slash command will open up a discord embed that will show the list of tasks.

## Steps:
### listActiveTasks.js
1. Add a new file to the commands/ directory. This filename will be "listActiveTasks.js".
2. This file will replicate the structure of addTask.js and completeTask.js.
    - It will define a "listActiveTasksCommand" command that will be a slash command builder with no string options\
    - It will include a "listActiveTasks" function that will retrieve all the non-completed tasks from the database
      - The information should be in order from oldest to newest
      - This function will utilize discord's "embed builder" to build out a simple embed that will show all the tasks.
      - The embed should resemble a table with the following fields from left to right:
      - The piece of included information will be
        - The ID of the task
        - The task title / description (first letter should be uppercase)
        - The age of the task
          - The age should be formatted like "# days ago"
          - If the age is less than 24 hours, return "<1 day ago"
          - Make sure to use plural vs singular for 1 vs multiple days ago
      - Ensure that any errors are caught
      - Reply with the embed
      - Export the necessary functions
      - If you think any new functions or files should be created, explicitly ask for permission before creating anything.

### index.js
1. Import necessary functions and update index.js file the same way the existing commands look and work

### db/
If any files/folders need to be created/updated in this directory, explicitly describe the update and request permission.

If any other changes are needed, explicitly ask for permission.

After all changes are complete, create a digest file in the "prompts/list-tasks/" directory, titled "digest.md"