# New Feature

## Description

The purpose/goal of this new feature will be to set a date that the task should be completed on. Essentially, add the ability to delay a task so that the date ticker doesn't count until that start date is reached.

This feature should allow the ability to create a delayed task, as well as set a delay on an existing task

## Requirements

1. Add a new column to the task table, "startDate", which will be a datetime field
2. Add an optional field to the add task command, which will be an integer field, and will take in a number of days to delay the task. The field title/param will be called "delay"
3. If the delay field exists, then it should set the startDate field of the task to be the current date (of the newly created task) plus the delay count
4. The function that sends the remaining tasks as an embed should be updated to reflect this change:
   - Add a new section for pending tasks, above regular tasks, and above buy tasks, but below archived tasks.
   - This new section should have 3 columns, the first column should simply return a "-", without age or color, the second column will continue to return a space, and the 3rd column should return the task
   - If there are multiple tasks that have a startDate, then this "pending" tasks section should sort the tasks by the startDate, ascending. Meaning, new pending tasks will be at the top, and older pending tasks should be at the bottom of this new "pending" section.
5. The command to edit a task should now also take an optional "delay" parameter, which will do exactly the same as the above functionality.

Questions:

1. Should this be called "pending", "delayed", "deferred" or something else?