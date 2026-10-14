# Admin panel (minimum)

Status: implemented

## Goal

A route `/admin` that shows every task and the total count, so operators can inspect what is stored in PostgreSQL. It also gives the integration suite a second primary path next to the home page.

## Scope

- Route `/admin`, lazy-loaded, server-rendered (existing wildcard `RenderMode.Server`).
- Read-only: heading "Admin", total (`data-testid="admin-total"`), list of all tasks (`data-testid="admin-tasks-list"`), loading / empty / error states.
- Follows the existing flow: component → `AdminViewModelService` (readonly signals incl. `vm`) → NgRx tasks slice → `TasksApi`. No new API, no new store slice.
- Tailwind utility classes only; no new SCSS.

## Out of scope

Authentication/authorization, editing or deleting tasks, navigation links, pagination. **Known limitation:** `/admin` is public until an auth feature exists — it must not expose anything beyond what `/api/tasks` already returns.

## Acceptance criteria

- `/admin` renders the heading, the total and all tasks from the database (server-rendered HTML contains them).
- Empty database → empty state; failed load → error message.
- Unit tests at 100% coverage for the new files (`npm run test:coverage`).
- Integration test (`apps/shell-integration`): server-rendered HTML and browser view show seeded tasks and the correct total; a task added on the home page appears in `/admin`.

## Open questions

- Which auth mechanism protects `/admin` (separate spec).
