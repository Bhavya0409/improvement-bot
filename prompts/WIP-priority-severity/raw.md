# New Feature - Priority

## Current State / Problem

- Currently, the tasks are separated in 2 ways: by section and by age. I want to keep both.
- Currently, the older the task is, the more I feel it is important to complete it, thereby implicitly creating a feeling of severity.
- However, I want to be able to designate that some tasks are more important to be completed in ways other than age. 
- For example, a task that can only be completed on a weekend should be prioritized heavily on a weekend day, even if the task was created sooner than a task from 3 days ago.

## Solution

- At the end of the day, the goal of this feature is to design a priority algorithm, a function that will return the task that is the most important to be completed now.
- There may be other factors that weigh into how severe/important/prioritized a task should be, such that I want to keep arbitrary options open while designing this feature.

### Algorithm features/factors

- If a task was deferred, then it should be marked as high priority once the start date is reached
- Priority of task can depend on time of day. i.e. doing laundry, shopping, and vacuuming all have higher priority during day than at night
- Delayed daily tasks will rise in priority higher than delayed regular tasks