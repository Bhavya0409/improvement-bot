# New Feature - Tags

## Description

The purpose of this new feature is to allow adding extra metadata to tasks, so that I can add additional functionality in the future based on what groups the tasks are in.

## Requirements

### Prep

1. Before any code change is done, generate a plan for the following changes, with as much detail as possible (specify which files are to be changed, what changes will be done to those files, etc.). Then, save the plan to "prompts/tags/plan.md"

### Database Updates

1. Create a new table, "tags". This will be a static data table 
2. This table will have the following columns:
   - id - number, auto incrementing
   - createdAt - timestamp, auto generated
   - updatedAt - timestamp, auto generated
   - value - string
   - displayValue - string
3. Create another table, "task_tag". This will be a join table to connect tags to tasks
   - id - number, auto incrementing
   - createdAt - timestamp, auto generated
   - updatedAt - timestamp, auto generated
   - tag_id - number, refers to the id of the tag
   - task_id - number, refers to the id of the task
4. Task should have a many to many relationship with tags
5. Add 3 tags to the tags table
   - Tag 1
     - value: bot
     - displayValue: Bot
   - Tag 2
     - value: buy
     - displayValue: Buy
   - Tag 3
     - value: plan
     - displayValue: Plan
6. Migrations should be created for the above changes

### Application Updates

1. Add new models to the models/ directory to represent the new tables
2. Update existing "/add" command to allow the addition of a tag on task create
   - This command should now take in a 2nd param, which is optional, called "tag"
   - This field will be an autocomplete field which will pull from all the tags in the current tags table
   - Upon submission of a new task with a tag, create a new entry in the "task_tag", in addition to the regular add
3. Add new "/addtag" command to allow the ability to add a new tag to an existing task
   - This command will have 2 fields:
     - "task" - Will be an autocomplete of all the existing non-completed tasks
     - "tag" - Will be an autocomplete of all the existing tags that are not currently on the task yet
   - Upon submission,
     - If no task or tag selected, throw error
     - If tag or task supplied that doesn't exist in db, throw error
     - If success, add a new entry to the "task_tag" table
4. Add new "/removetag" command to allow the ability to remove an existing tag from an existing task
   - This command will have 2 fields
     - "task" - Will be an autocomlpete of all the existing non-completed tasks
     - "tag" - Will be an autocomplete of all the existing tags on the task
   - Upon submission
     - If no task or tag selected, throw error
     - If tag or task supplied that doesn't exist in db, throw error
     - If tag supplied that isn't linked to task supplied, throw error
     - If success, remove corresponding entry from "tag_task" table
5. Upon submission of any command, old or new, there should be a confirmation message, and the list of all non-completed tasks should be returned as an embed
6. Current embeds should not be changed at all. This feature is purely data updates, nothing UI besides the commands

### Post

1. After plan is executed, generate a digest of all files changed. Save the file to "prompts/tags/digest.md".
2. Compare the "digest.md" to "plan.md" in the same directory, and add a section to the bottom of "digest.md", detailing the differences, and ideally why it was missed in the plan.md

## Questions / Considerations

1. How many migration files should be created / how should the database updates be mapped to the migration files?
2. Should the join table be named "task_tag" or should it be "tasks_tags" or something similar - what is standard convention for a join table?
3. Is there a better way to organize the table so that all the tags are just in the task table, or is a join table the best way of handling this feature?
4. Is there a better way of naming/organizing the "/addtag" and "/removetag" commands?
5. Instead of removing the "task_tag" on /removetag, should I instead have a "removedAt" column to always track the tags on a task? What value would this provide?