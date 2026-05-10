# New Feature - Unplan Command

## Description

The purpose of this new feature is to add a a new command, that will quickly undo what the "plan" command does, namely remove the "plan" for a task.

## Requirements

1. Add a new "/unplan" command, with the same structure as the existing command
2. This command will take 1 argument, the task. This option will utilize the same autocomplete logic as the other command. However, this command should only return the list of tasks that already have the "plan" tag attached to it. This should be done at the autocomplete level, not submission level.
3. Upon submission of this command, remove the "plan" tag on the task. Then, return an embed with a confirmation message, along with the list of new remaining active tasks
4. After completing the work, create a "digest2.md" of all the work and changes done, and put it in the prompts/plan-command directory