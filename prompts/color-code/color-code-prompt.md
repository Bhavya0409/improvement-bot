# New Feature
## Purpose / Goal

This new feature will be around adding color coding to the tasks. The reason this feature is useful is that it will easier to scan the table for importance and priority, barring a new field to indicate that priority level.

This new approach will utilize the age field to add some color to the field.

## Steps

1. Create a new function in utils.js. This new function should use the age of the task and return a colored circle. The upper limit is inclusive, meaning exactly 1 day ago is green; exactly 2 days ago is yellow, etc.

   - 🟢 < 1 day
   - 🟡 1-2 days
   - 🟠 3-6 days
   - 🔴 7+ days

2. Update the columns in the embed to have the age as the first column. 
3. In the age column, show the colored circle first, to the left of the actual age
4. Update the calculate age logic to have use a singular letter instead of the full word. For example "1 day ago" should be "1d", "5 hours ago" should be "5h", "30 minutes ago" should be "30m"

## Clarifications

1. Keep "Just now" the way it is
2. The circle should be to the left of age, but it should be included all in the same first column
3. This change should affect all instances that use calculateAge. Accept this breaking change 