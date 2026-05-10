# New Feature - Plan Command

## Description

The purpose of this new feature is to add a a new command, that will be a quick shortcut/shorthand to mark a task as "planned"., i.e. add the "plan" tag to a task. This is useful in case a task is stuck for a long time, and I need to break it out of the existing structure, and move it to the top of the task list where I can think about the best next steps for it.

## Requirements

1. Add a new "/plan" command, with the same structure as the existing command
2. This command will take 1 argument, the task. This option will utilize the same autocomplete logic as the other command. However, this command should only return the list of tasks that do not already have the "plan" tag attached to it. This should be done at the autocomplete level, not submission level. 
3. Upon submission of this command, assign the "plan" tag to the task. Then, return an embed with a confirmation message, along with the list of new remaining active tasks
4. After completing the work, create a "digest.md" of all the work and changes done, and put it in the prompts/plan-command directory