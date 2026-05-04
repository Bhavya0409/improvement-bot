# New Feature

The purpose of this new feature will be to edit the description of a non-completed task

Requirements:
1. A new slash command will be created. This command will be "/edit" and take in 2 parameters. 
    - The first will be an autocomplete text field that will take in the task description. This field should not be editable freehand, but editable only through selecting a item in the autocomplete 
    - The second will be a free text field. This new text field should be blocked from being input until the 1st field is populated. After the first is populated, it should populate this new field too.
2. Submitting will edit the text, and return the list of tasks, similar to all the other commands.

Notes:
1. The autocomplete should not include the task id in the options. I know the /complete command does, but this should not
2. The age field will stay the same, since it will refer to date created, not date updated