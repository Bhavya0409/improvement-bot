# New Feature - Add Plan Command

## Description

The purpose of this new feature is to add a new command, that will be a quick shortcut/shorthand to add a new "planned" task.

## Requirements

1. Add a new "/addplan" command, with the same structure as the existing command
2. This command will take 1 argument, the task.
3. Upon submission of this command, create the new task, assign the "plan" tag to the task. Then, return an embed with a confirmation message, along with the list of new remaining active tasks
4. After completing the work, create a "digest3.md" of all the work and changes done, and put it in the prompts/plan-command directory