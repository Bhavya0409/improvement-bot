# New Feature

## Description

I want the /list command to take in an optional parameter "listType". This parameter will be an autocomplete string field that takes in all the existing tags as an argument. If the tag field is empty, return the regular list of tags. If the tag is field is empty, then return the list of all tasks, just like the way it is. If the tag field is not empty, but the tag field doesn't match an existing tag, return an error. If the tag field is not empty, and the tag field does match an existing tag, then return the subset of tasks that have a tag that matches the tag passed in. The confirmation content of the modal should mention that the task list is now showing only that subset of tasks.