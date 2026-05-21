# Deferred Tasks Feature - Digest

## Overview
Tasks can now be deferred by a number of days. A deferred task has a `startDate` in the future and appears in a separate **Deferred Tasks** section of the embed (no age/color ticker) until `startDate` is reached, at which point it automatically promotes to the regular section on the next embed render.

---

## Files Changed

### New Files

| File | Description |
|------|-------------|
| `migrations/20260521000001-add-startDate-to-tasks.cjs` | Adds nullable `startDate` TIMESTAMP column to the `tasks` table |

### Modified Files

| File | Changes |
|------|---------|
| `db/models/task.js` | Added `startDate` field: `DataTypes.DATE`, `allowNull: true`, `defaultValue: null` |
| `commands/addTask.js` | Added optional integer `delay` parameter (min: 1); computes `startDate = now + delay days` on task creation |
| `commands/editTask.js` | Added optional integer `delay` parameter (min: 0); `delay > 0` sets `startDate`, `delay === 0` clears `startDate` to `null`, omitting `delay` leaves `startDate` unchanged |
| `utils/taskUtils.js` | Added `isDeferredTask(task)` helper — returns `true` when `task.startDate` is set and `startDate > now` |
| `utils/discordUtils.js` | Added `deferred` entry to `embedConfig`; partitions deferred tasks into their own array; sorts deferred tasks by `startDate` ascending; calls `pushToFields` for deferred section between archived and buy sections |

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Section name | **Deferred Tasks** | "Pending" is ambiguous (all active tasks could be considered pending); "Delayed" implies something went wrong; "Deferred" clearly communicates a deliberate, scheduled future start |
| Auto-promotion | Yes, on render | When `now >= startDate`, `isDeferredTask` returns `false`, so the task silently moves to the regular section on the next embed render — no background job needed |
| Clearing a deferral via edit | `delay: 0` sets `startDate = null` | Explicit zero value provides a simple in-command way to un-defer a task |
| Deferred sort order | `startDate` ascending | Soonest-to-activate tasks appear at top, furthest-future tasks at bottom |
| Age column for deferred | `-` (plain dash) | No color circle or age count — the ticker hasn't started yet |

---

## Differences vs plan.md

None. Implementation matched the plan exactly.

