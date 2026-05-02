I want to develop a new feature. The purpose of this new feature will be to add a higher level of granularity to tasks. Currently, the tasks only show information at a "day" level. For example, if a task was made 26 hours ago, it would return "1 day ago". If a task was made 14 hours ago, it would return "<1 day ago"

I want to update that logic so that if a task was made <1 day ago, it should return the amount of hours. If the task was made <1 hour ago, it should return the minutes. If the task was made <1 minute ago, it should return "Just now"

Time ago since created -> resulted UI
25 hours ago -> 1 day ago
24 hours ago -> 1 day ago
23 hours ago -> 23 hours ago
1 hour ago -> 1 hour ago
59 minutes ago -> 59 minutes ago
1 minute ago -> 1 minute ago
59 seconds ago -> Just now