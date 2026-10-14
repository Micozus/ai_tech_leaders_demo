# AGENTS.md

Angular 21 (standalone, zoneless, Signals, OnPush) · Nx 22 · TypeScript strict · NgRx 21 · PrimeNG 21 · Tailwind CSS 4 + SCSS (BEM for component styles) · Vitest · Playwright · Storybook · npm.

## Layout

- `apps/shell/src/app/` — `core/` (API, global services), `features/` (route-level), `shared/` (app-only reusable; create when needed), `store/` (NgRx), `integration/` (library adapters, host providers).
- `apps/shell/src/server/` — Node-only code (MikroORM 7 + PostgreSQL, entities, repositories, Express routers). Wired in `src/server.ts`; never imported by `src/app` except as types.
- `libs/ui` — generic visual components. `libs/form-engine` — form contracts and runtime. Inside libs, group by role: `components/ directives/ services/ helpers/ models/ validators/ pipes/ integration/ testing/` (create only when used).
- `apps/shell-e2e` — Playwright. `apps/shell-integration` — Vitest + testcontainers + agent-browser against the built server.

## Architecture

- Ownership: ui = visual primitives; form-engine = form contracts/runtime; app = routing, NgRx, API, workflows. Libraries never import app code (enforced by Nx tags).
- Use `inject()` and explicit providers. Components are thin (presentation/interaction only).
- ViewModel pattern: a component-scoped service exposes readonly signals incl. `vm`; components never call `store.select()`.
- State: Signals for local/UI, NgRx for application state, RxJS for async workflows.
- Transformations: pure, typed helpers. Variable behavior lives in configuration, not product-specific conditions.
- Single source of truth: no duplicated contracts, redundant adapters or compat re-exports.
- Path aliases (`@org/ui`, `@org/form-engine`) across projects; relative imports inside a library.

## SSR and data access

- The app is server-rendered (`RenderMode.Server`) with hydration. `TasksApi` is the abstraction: `ServerTasksApi` (SSR) calls the repository passed through `REQUEST_CONTEXT` — no HTTP loopback — and publishes results via `TransferState`; `HttpTasksApi` (browser) consumes that state, then calls `/api/*`.
- Database: `DATABASE_URL` (defaults to the sandbox PostgreSQL) via MikroORM 7 (`@mikro-orm/postgresql`). Entities use `EntitySchema` (no decorators: esbuild has no decorator metadata), types live in `*.model.ts`. Repositories fork the `EntityManager` per operation; never use a global one. Schema bootstrap (`schema.update()` + seed) lives in `server/database`; move to MikroORM migrations once schema history matters. No string-built SQL.

## Conventions

- Standalone, `OnPush`, inline templates; `input()`/`output()`/`computed()`/`effect()`; `@if/@for/@switch`, always `track`.
- Types, interfaces and named constants go in `*.model.ts`. `interface` for objects, `type` for unions/mapped types.
- No `any`, unsafe casts or magic indexes. Private fields use `#`; private methods use `private`.
- Early returns, named helpers, shallow nesting.
- Styling: Tailwind utility classes in templates first; component SCSS (BEM, co-located `_component-name.scss`) only for what utilities cannot express. Tailwind is wired in `apps/shell/.postcssrc.json` and `styles.scss`.
- Filenames: `*.component.ts`, `*.service.ts`, `*.helper.ts`, `*.model.ts`, `*.spec.ts`.
- NgRx: functional effects, `createActionGroup`, memoized selectors.
- Never hand-edit generated code. Prefer existing patterns over new abstractions.

## Standards

Full naming table, layering rules, security minimums, concept scaffold recipe and review checklist: [.ai/docs/engineering-standards.md](.ai/docs/engineering-standards.md). Read it before adding a domain concept, router, store slice or shared component; keep it and this file in sync.

## Testing

- Vitest specs next to the code. Mock external boundaries (HTTP, Store, browser APIs), not internal helpers.
- Test behavior, not implementation. Playwright uses `data-testid` or accessibility selectors; no sleeps.
- Reusable UI components get Storybook stories.
- **Every new feature must ship with 100% unit-test coverage** (statements, branches, functions, lines). No exceptions and no coverage-ignore comments; a feature without complete unit tests is not done. `npm run test:coverage` enforces it per project (thresholds in each `vite.config.mts`) and CI fails the pull request otherwise.
- Only process entrypoints are excluded from coverage (`main.ts`, `main.server.ts`, `server.ts`, stories, specs); they are exercised by the integration suite. Keep logic out of them.
- Each project's `coverage-guard.spec.ts` imports every source file; never remove it — Vitest otherwise reports unimported files as 100% covered.
- Integration tests live in `apps/shell-integration` (`*.integration.spec.ts`): a throwaway PostgreSQL (testcontainers) plus the built server, driven through `agent-browser`. Every new route/page gets a happy-path integration test. Run: `npm run integration` (needs Docker, or `INTEGRATION_DATABASE_URL` pointing at a disposable database, and `npx agent-browser install --with-deps` once).
- E2E is Playwright (`apps/shell-e2e`, `npm run e2e`, `data-testid`/role selectors, runs in CI against a PostgreSQL service). Every new route/page gets an e2e happy path next to its integration test.
- Commits and PR titles follow Conventional Commits (commitlint + Husky locally, enforced again in CI). GitHub Actions are pinned to commit SHAs; Dependabot updates them.

## Working agreement

- **Plan first.** For multi-file or architectural changes, state a short plan (files to touch, layer ownership, success criteria) before coding; unresolved technical doubt is settled with a small prototype. Non-trivial work gets a spec (see AI workspace). If the work goes sideways, stop and re-plan instead of pushing on.
- **Split big work** into testable steps: contracts/models → logic/helpers → integration (store, API) → tests. Keep changes minimal and in scope.
- **Verify, don't claim.** A change is done only after you ran the checks: `npm run lint`, `npm run test:coverage` (must stay at 100%), `npm run build`, plus `npm run integration` for UI, SSR or data-flow changes. Report commands and results; separate confirmed facts from hypotheses. Never present unrun checks as passing.
- **Bugs:** reproduce with a failing Vitest spec first when feasible, then fix. For failing CI/tests, read the logs, find the first real cause and fix it — no workarounds that hide the failure.
- **Simplify after implementing:** remove needless layers, duplication and out-of-scope edits (single source of truth, no speculative abstractions) without changing behavior; re-run tests.
- **Learn from corrections:** after any user correction or fixed bug, record the rule via the Lessons step below; if it is a standing convention, add one line to this file instead and remove outdated lines. Keep this file short — procedures belong in skills.
- **Risky actions** (push, merge, destructive Git or DB operations, secrets) need explicit user approval.

## Commands

`npm start` · `npm run build` · `npm run lint` · `npm test` · `npm run test:coverage` · `npm run integration` · `npm run e2e` · `npm run storybook`

## AI workspace (`.ai/`) — mandatory

```text
.ai/
  specs/                 # SDD specifications, named YYYY-MM-DD-slug.md
    implemented/         # specs whose implementation has shipped
    archive/             # abandoned or superseded specs
  runs/                  # logs of autonomous AI runs, named YYYY-MM-DD-slug.md
  lessons.md             # index of lessons (long-term memory)
  lessons/               # lesson details, named YYYY-MM-DD-slug.md
  docs/                  # reference docs (engineering-standards.md)
```

Rules (all names: date `YYYY-MM-DD` = creation day, `slug` = lowercase kebab-case):

1. **Before work**: read `.ai/lessons.md` and open the lessons relevant to the task.
2. **Spec-driven development**: for a non-trivial feature or change, find its spec in `.ai/specs/`. If none exists, write one there first (goal, scope, acceptance criteria, open questions) and implement against it. Do not contradict a spec; change the spec instead and say so.
3. **After implementing a spec**: move it to `.ai/specs/implemented/` (keep the filename). Move dropped or superseded specs to `.ai/specs/archive/`.
4. **Autonomous runs**: every autonomous (unattended or multi-step) run writes a log to `.ai/runs/YYYY-MM-DD-slug.md` — objective, spec used, steps/decisions, files changed, commands run and results, open issues. Update it as you work, not only at the end.
5. **Lessons**: after fixing a bug, hitting a surprising failure, receiving a correction, or discovering a non-obvious project fact, write `.ai/lessons/YYYY-MM-DD-slug.md` (context, root cause, fix/rule) and add a one-line entry to `.ai/lessons.md`. Update an existing lesson instead of duplicating it.
6. Never delete specs, runs or lessons; archive instead. Do not store secrets in `.ai/`.
