I want to develop a new feature. The feature involves improving the current /complete command to have a better user experience. The current experience of manually inputting the task description is not a good user experience. The user needs to know the exact description in the db, or it will fail.

There are 2 approaches to improvement:
1. Add the ability to select a task by the db ID
2. Add the ability to select the task description from a list of predefined task descriptions.

Implementation Strategy:
- Update the /complete command to use autocomplete with suggestions from the DB.
- The autocomplete suggestions should only include non-completed items
- The fetch should happen per character input and should not debounce at all.
- The format should be "# [Task Id] - [Task Description]"
- The input and flow should support the following flows
  - The user can submit an input that looks like "[Task Id]"
  - The user can submit an input that looks like "[Task Description]"
  - The user can submit an input that looks like "[Task Id] - [Task Description]"
  - The logic for the handler should be able to determine the necessary condition to find the task in the db and mark as complete
  - If there is any discrepancy, or multiple values are provided, the "id" field should be used as the source of truth.
    - For example, if the input is "1 - Lean Typescript" with a spelling mistake, that should still be marked as complete since the id exists in the db
  - The handler should reply with the id and the description, and mention that the task was marked as complete. The handler should then return the list of still non-completed items.

# Bot Plan

## Plan: Enhance Complete Task Command with Autocomplete by ID

Replace the manual text-based `/complete` command with an autocomplete-driven interface showing task ID and description. Users can submit by ID, description, or both, with ID as the source of truth. After completion, the command displays remaining active tasks.

### Steps

1. **Update [completeTask.js](file:///C:/Users/bhavy/OneDrive/Desktop/improvement-bot/commands/completeTask.js) command definition:**
    - Enable `.setAutocomplete(true)` on the task option
    - Update option description to "Select a task by ID or description"
    - Remove `.setMaxLength(100)` constraint (autocomplete will handle format)

2. **Implement input parsing logic in `completeTask` handler:**
    - Parse input to extract Task ID using simplified regex: `/^(\d+)/` (matches leading digits)
    - If ID found: Query `Improvement.findOne({ id: parsedId, completed: false })`
    - If ID not found but description provided: Query `Improvement.findOne({ value: input, completed: false })`
    - If task not found: Reply with error
    - Handle formats: "5", "1 - Learn TypeScript", "Learn TypeScript"

3. **Update completion logic with enhanced reply:**
    - Mark task as completed (set `completed: true` and `completedAt: new Date()`)
    - Reply with confirmation: "✅ Task '#[ID] - [Description]' has been marked as completed!"
    - Query remaining active tasks: `Improvement.findAll({ completed: false, order: [['createdAt', 'ASC']] })`
    - Append list of remaining tasks using same format as `/list` command (or simplified format)

4. **Add autocomplete handler to [main.js](file:///C:/Users/bhavy/OneDrive/Desktop/improvement-bot/main.js):**
    - Detect `interaction.isAutocomplete()` and `commandName === 'complete'`
    - Query all non-completed tasks: `Improvement.findAll({ completed: false })`
    - Format suggestions as: `"[ID] - [Description]"` (name and value)
    - Filter based on focused input (no character limit, no debounce)
    - Return filtered results (up to 25)
    - Handle errors gracefully

### Further Considerations

1. **Input parsing edge cases:**
    - "5" → Extract ID 5
    - "1 - Learn TypeScript" → Extract ID 1, use as source of truth
    - "Learn TypeScript" → No ID found, search by description
    - "1 - Wrong Description" → ID 1 is source of truth, ignore description mismatch

2. **Remaining tasks display:**
    - Show as formatted embed table like `/list` command?
    - Or simpler inline list format to keep reply concise?
    - (Recommend: Extract common embed-building logic to utility function, reuse from `listActiveTasks.js`)

3. **Autocomplete performance:**
    - No debounce means query fires per keystroke
    - For 100+ tasks this is acceptable; if scalability needed later, add 2-3 char minimum

