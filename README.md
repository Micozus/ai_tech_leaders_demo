# Angular Nx Monorepo

Production-ready Angular monorepo. Priorities: readability, clear ownership, maintainability and minimal complexity. Architecture rules for contributors and agents are summarized in [AGENTS.md](AGENTS.md).

## Getting started

```sh
npm run setup
```

Installs dependencies and the browsers needed for `npm run integration` and `npm run e2e`. Safe to re-run: it detects what is already done and skips it.

### Manual steps

Prefer to do it by hand, or need just one piece of it? See [Commands](#commands) below for the individual steps (`npm install`, the browser installs `integration`/`e2e` need on first run, then `npm start`).

## Technology stack

| Area        | Choice                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| Framework   | Angular 21.2.9 — standalone, zoneless, Signals, OnPush, SSR             |
| Monorepo    | Nx 22.7.12 — project boundaries, task orchestration                     |
| Language    | TypeScript 5.9.3 — strict mode                                          |
| State       | NgRx 21.1.1 — Store, Effects, Selectors                                 |
| UI          | PrimeNG 21.0.4                                                          |
| Styling     | Tailwind CSS 4 (utilities first) + SCSS with BEM for component styles   |
| Unit tests  | Vitest 4.1.11 + `@analogjs/vitest-angular`                              |
| E2E         | Playwright                                                              |
| Docs        | Storybook 10.2.4 (reusable components)                                  |
| Quality     | ESLint, Prettier, Husky, lint-staged, commitlint (Conventional Commits) |
| Package mgr | npm                                                                     |
| Backend     | Express + MikroORM 7 + PostgreSQL, co-located with the app for SSR      |

Packages are kept version-compatible; unnecessary dependencies are avoided.

## Repository architecture

```text
apps/
  shell/
    src/app/
      core/           # API, global services, root configuration
      features/       # Route-level features and components
      shared/         # Application-specific reusable code (created when needed)
      store/          # NgRx state management
      integration/    # Library adapters and host-specific providers
    src/server/       # Node-only: MikroORM entities, repositories, Express routers
  shell-e2e/          # Playwright tests

libs/
  form-engine/        # Reusable form renderer, runtime, contracts
  ui/                 # Generic visual components and styles
```

| Project             | Path                     | Role                                                                          |
| ------------------- | ------------------------ | ----------------------------------------------------------------------------- |
| `shell`             | `apps/shell`             | Application (routing, NgRx, API)                                              |
| `shell-e2e`         | `apps/shell-e2e`         | Playwright tests                                                              |
| `shell-integration` | `apps/shell-integration` | Vitest + testcontainers (PostgreSQL) + agent-browser against the built server |
| `ui`                | `libs/ui`                | Generic visual components + Storybook                                         |
| `form-engine`       | `libs/form-engine`       | Config-driven form renderer                                                   |

Inside libraries, code is grouped by technical role: `components/`, `directives/`, `services/`, `helpers/`, `models/`, `validators/`, `pipes/`, `integration/`, `testing/` (created only when used). Application features may keep their own local `components/`, `services/`, `models/` and tests. No empty abstractions or directories.

## Architectural principles

- **Clear ownership** — `ui` owns visual primitives; `form-engine` owns form contracts and runtime; the app owns routing, NgRx, API and business workflows.
- **Strict boundaries** — libraries never import application code (enforced by Nx tags).
- **Dependency injection** — `inject()` and explicit providers.
- **Thin components** — presentation and interaction only; orchestration, mapping and business logic live in services/helpers.
- **ViewModel pattern** — a component-scoped service exposes readonly signals, including `vm`; components never call `store.select()`.
- **State** — Signals for local/UI state, NgRx for application state, RxJS for asynchronous workflows.
- **Transformations** — pure, typed helpers; explicit pipelines for complex cases.
- **Configuration-driven behavior** — genuinely variable behavior lives in configuration, not product-specific conditions.
- **Single source of truth** — no duplicated contracts, redundant adapters or compatibility re-exports.
- **Imports** — path aliases (`@org/ui`, `@org/form-engine`) across projects; relative imports inside a library.

## Coding conventions

- Standalone components, `ChangeDetectionStrategy.OnPush`, inline templates.
- `input()`, `output()`, `computed()`, `effect()`, `@if` / `@for` / `@switch`; always `track`.
- Types, interfaces and named constants go in `*.model.ts`. `interface` for object contracts, `type` for unions and mapped types.
- No `any`, unsafe casts, magic indexes or needless generic abstractions.
- Private fields use `#`; private methods use `private`.
- Early returns, named helpers, shallow nesting.
- Tailwind utilities in templates first; component SCSS (BEM, co-located `_component-name.scss`) only when utilities are not enough.
- Filenames: `*.component.ts`, `*.service.ts`, `*.helper.ts`, `*.model.ts`, `*.spec.ts`.
- NgRx: functional effects, `createActionGroup`, memoized selectors.
- Prefer existing patterns over new abstractions; never hand-edit generated code.

## SSR and data access

The app is server-rendered (`RenderMode.Server`) with hydration. `TasksApi` is the abstraction over data access:

- `ServerTasksApi` (SSR) calls the repository passed through `REQUEST_CONTEXT` — no HTTP loopback — and publishes results via `TransferState`.
- `HttpTasksApi` (browser) consumes that state first, then calls `/api/*`.

Database: `DATABASE_URL` (default `postgres://postgres:postgres@127.0.0.1:5432/open-mercato`) through MikroORM 7 with `EntitySchema` mappings. The `tasks` table is created (`schema.update()`) and seeded on server start (`server/database`); no string-built SQL.

## Reference feature

The sample `tasks` feature demonstrates the full flow: component → ViewModel service → NgRx → API abstraction (`TasksApi`). It is intentionally minimal — no domain-specific functionality or speculative features.

## Testing and quality

- Vitest specs live next to the code. Mock external boundaries (HTTP, Store, browser APIs), not internal helpers or business pipelines.
- Test observable behavior and real transformations, not implementation details.
- Playwright uses `data-testid` or accessibility selectors; no arbitrary sleeps — synchronize on observable state.
- Reusable UI components get Storybook stories.
- Commits follow Conventional Commits (commitlint + Husky + lint-staged).
- Nx provides independent `build`, `lint`, `test` and `e2e` targets; `integration` runs the black-box suite.
- **100% unit-test coverage is mandatory** for every new feature; `npm run test:coverage` enforces it.
- **CI** (`.github/workflows/ci.yml`) runs on pull requests, pushes to `main` and merge queues: build, lint, unit tests with the 100% coverage gate, integration tests (PostgreSQL via testcontainers, UI driven by agent-browser), Playwright e2e (PostgreSQL service), a dependency audit (`npm audit --omit=dev`, high and above) and Conventional Commits checks for PR title and commits. Dependabot (`.github/dependabot.yml`) and `CODEOWNERS` live next to it. Mark these jobs as required status checks in the branch protection rules.

## Commands

```sh
npm run setup        # one-shot, idempotent: see Getting started above
npm install
npm start            # dev server on 0.0.0.0:3000
npm run build
npm run lint
npm test
npm run test:coverage # unit tests, fails below 100%
npm run integration  # needs Docker; first run: npx agent-browser install --with-deps
npm run e2e          # first run: npx playwright install chromium
npm run storybook    # ui library stories on :6006
```
