# Engineering Standards

Status: active · Applies to: `apps/shell`, `libs/ui`, `libs/form-engine`

Rules for adding domain code to this workspace. Short rules live in [AGENTS.md](../../AGENTS.md); this file holds the naming table, the reasoning, the scaffold recipe and the review checklist. When the two disagree, fix both in the same change.

Stack: Angular 21 (standalone, zoneless, Signals, OnPush, SSR) · NgRx 21 · Tailwind 4 + SCSS/BEM · PrimeNG 21 · Express 5 · MikroORM 7 + PostgreSQL · Vitest · Playwright · Storybook · Nx 22.

---

## 1. Rules

### Naming

| Element | Convention | Example |
| --- | --- | --- |
| Domain concept folder | plural, single lowercase word (kebab-case if unavoidable); the **same name** in every layer | `bookings`, `payments` |
| Nx project | `apps/<name>`, `libs/<name>`; import alias `@org/<name>` | `@org/ui` |
| Route-level feature | `app/features/<concept>/` with local `components/ services/ models/` | `features/tasks/` |
| Component | `<name>.component.ts`, class `<Name>Component`, selector prefix `app-` (libs: their own prefix) | `TasksPageComponent` |
| ViewModel service | `<name>-view-model.service.ts`, component-scoped (`providers: [...]`), exposes readonly signals incl. `vm` | `TasksViewModelService` |
| Component styles | Tailwind classes first; leftover SCSS in `_<component-name>.scss`, BEM | `tasks-page__list` |
| Types / constants | `*.model.ts`; `interface` for objects, `type` for unions/mapped | `tasks.model.ts` |
| Pure transformation | `*.helper.ts`, typed, no side effects | `tasks-transfer.helper.ts` |
| NgRx slice | `store/<concept>/<concept>.{actions,reducer,selectors,effects}.ts`; `createActionGroup`, functional effects, memoized selectors | `store/tasks/` |
| API abstraction (client) | abstract `<Concept>Api`; implementations `Http<Concept>Api` (browser) and `Server<Concept>Api` (SSR) | `TasksApi` |
| Server data port | `<Concept>DataSource` interface in `*.model.ts`, shared by app and server as a type | `TasksDataSource` |
| Entity | `<name>.entity.ts` exporting a PascalCase `EntitySchema`; record type in `<name>.model.ts` | `Task` → `server/tasks/task.entity.ts` |
| DB table / column | snake_case, plural table; column mapped from camelCase via `fieldName` | `created_at` ← `createdAt` |
| Repository | `<concept>.repository.ts`, class `<Concept>Repository implements <Concept>DataSource` | `TasksRepository` |
| Express router | `<concept>.router.ts`, `create<Concept>Router(dataSource)`, mounted under `/api/<concept>` | `createTasksRouter` |
| Request parsing | `<concept>.helper.ts` returns a typed value or `null`/error, never the raw body | `parseCreateTaskBody` |
| Domain error | `<Name>Error` extending a shared `AppError`, in `server/http/errors.ts` (create with the first need) | `NotFoundError` |
| Spec / story | `<file>.spec.ts` next to the code; `<component>.stories.ts` for reusable `libs/ui` components | |

### Architecture

- **Ownership and direction.** `apps/shell` → `libs/*`; libraries never import app code (Nx tags, ESLint). `src/app` never imports `src/server` except as types. Do not loosen a boundary for convenience.
- **Concept folders.** Domain code is organized by concept, repeated across layers (`features/<c>`, `store/<c>`, `core/api` model, `server/<c>`). Create a folder with its first file; never scaffold empty ones. No module runtime, no auto-discovery, no per-concept manifest.
- **Data access.** One abstraction per concept (`<Concept>Api`). The server implementation calls the repository directly through `REQUEST_CONTEXT` (no HTTP loopback) and publishes via `TransferState`; the browser implementation consumes that state, then calls `/api/*`. Components, view-models and effects depend on the abstraction only.
- **Ports for external integrations** (payments, mail, storage…): an interface in `*.model.ts` plus an adapter, provided explicitly (Angular provider or constructor argument in `server.ts`). Callers see the port; a vendor SDK is imported in exactly one adapter file.
- **Persistence.** Only `src/server` imports `@mikro-orm/*`. Entities use `EntitySchema` (no decorators under esbuild). A repository forks the `EntityManager` per operation. No string-built SQL.
- **Transactions.** A check-then-write on shared state (availability, balance, status transition) runs in one transaction (`em.transactional`) backed by a unique constraint — never two round-trips.
- **Validation.** Parse request bodies in a typed helper; one definition per input shape, reused by server and client. Never spread a raw body into `em.create()`/`em.assign()` (mass assignment) — pass explicitly picked fields.
- **State.** Signals for local/UI state; NgRx for application state; RxJS for async workflows (effects). Components never call `store.select()`; they read the ViewModel.
- **Configuration over conditionals.** Variable behavior (labels, field sets, feature switches) lives in configuration objects (e.g. form-engine configs), not `if (product === …)`.
- **Single source of truth.** No duplicated contracts, redundant adapters or compat re-exports. If app and server need the same type, it is declared once in `core/api/*.model.ts`.
- **SSR safety.** Server-only code (Node APIs, DB) never reaches the browser bundle; browser-only APIs (`window`, `localStorage`) are accessed through injected abstractions or guarded with `isPlatformBrowser`.

### Reusable API & UI layers (no duplicated fetch / error / form code)

Add a shared layer only when a second real consumer appears; once it exists, never re-implement it inline.

**Server (`apps/shell/src/server/http/`, created when the second router needs it):**

- `errors.ts` — small typed hierarchy (`AppError` + `NotFoundError`, `ValidationError`, `ConflictError`, `UnauthorizedError`, `ForbiddenError`). Repositories and helpers throw these; nothing builds an HTTP response outside the router layer.
- `error-handler.ts` — single Express error middleware mapping `AppError` → status + JSON envelope `{ message, code?, fieldErrors? }`, logging unexpected errors with context, never leaking stack traces. Express 5 forwards rejected promises from async handlers, so routers contain **no `try/catch`** (`tasks.router.ts` follows this).
- `auth.ts` — `requireSession(req)` and ownership assertions; every non-public route calls one before touching a repository. Fail closed.

**Client:**

- Only `Http<Concept>Api` services (and a shared request helper once there are two) call `HttpClient` for `/api/*`. Components and effects never do.
- Errors are normalized once (an interceptor or helper) into a typed `ApiError`; effects map it to a failure action — no ad-hoc `catchError` shapes per feature.
- Forms: `libs/form-engine` renders configuration-driven forms; field components come from PrimeNG wrapped in `libs/ui`. A bespoke form needs a stated reason.
- Lists/tables and loading/empty/error states: one shared component each in `libs/ui` (PrimeNG-based) the second time a feature needs them — not per-page markup.

**Where a new reusable component goes:**

1. Generic, visual, concept-agnostic → `libs/ui/src/lib/components/` (+ Storybook story).
2. Form contracts / runtime / validators → `libs/form-engine`.
3. Tied to one concept's domain shape → `app/features/<concept>/components/`.
4. Used by one page only → keep it beside that page; promote when a second page needs it. Cross-feature, app-specific → `app/shared/`.

### Engineering principles

When two pull in different directions, choose the one that keeps the change smaller and more explicit.

- **SRP.** Entity file = mapping only. Repository = persistence for one concept. Router = HTTP wiring (parse → auth → call → respond). Component = presentation/interaction. ViewModel = orchestration and mapping. Helper = pure transformation.
- **DRY.** One definition per schema, contract, error mapping and request path. About to copy a `try/catch` or a validation block? Extract it. Three similar lines are fine.
- **Separation of concerns.** Persistence in `server`, workflow state in `store`, rendering in components, visuals in `libs/ui`. A component never queries data; a repository never knows about Express.
- **Dependency inversion.** Depend on `TasksApi` / `TasksDataSource` / a port, not a concrete class or vendor SDK. Angular DI (`inject()` + explicit providers) is the wiring mechanism; there is no extra container.
- **Explicit over implicit.** Every provider, route and router mount is registered by hand and is greppable. No glob-based auto-registration.
- **Convention over configuration, narrowly.** The concept-folder convention replaces a module system; it works only if applied consistently.
- **YAGNI.** No folder, abstraction, option or dependency before its first real use. No plugin loader, no queue, no multi-tenancy, no RBAC unless a spec requires it.
- **Composition over inheritance.** Small services and functions composed together; no base `Service` or `Repository` classes with template methods.
- **Immutability and signals.** State updates are pure (reducers, `computed`); expose `readonly` signals, never writable ones.
- **Fail closed.** An error inside an authorization/ownership check denies. Ambiguity is 403, not a best-effort 200.
- **Idempotency.** Operations that can be retried (webhooks, payment confirmation, double submit) tolerate a second call: unique constraints plus transactions, not application-level checks alone.

### Security & validation — minimum bar

The workspace has no auth yet; these apply from the first auth/payment feature and to anything touching data today.

- **Server-side enforcement** of auth and **record-level** authorization (ownership, not only "logged in"). Hiding a button is not enforcement.
- **Input:** every write endpoint parses an explicit typed shape; reject with `ValidationError` (400); revalidate server-side anything client-supplied that affects money, ownership or status (price, user id, status).
- **Injection:** only MikroORM entity/query APIs; no interpolated SQL; no untrusted input in file paths or shell commands.
- **Passwords:** `argon2id` (memory ≥ 19 MiB, iterations ≥ 2, parallelism 1) or bcrypt cost ≥ 12. Generic "invalid credentials" messages — never reveal whether an email exists.
- **Sessions/tokens:** signed (HS256 minimum, secret ≥ 32 random bytes from env), short expiry, in `httpOnly` + `secure` (production) + `sameSite=lax|strict` cookies; never in `localStorage`.
- **CSRF:** cookie auth requires `sameSite` plus a custom header check on state-changing routes (set by the shared client request helper).
- **Rate limiting** on login/register/reset endpoints (per IP+account, with cooldown).
- **Secrets & logging:** secrets only via environment (`DATABASE_URL`, …), validated at startup, `.env` git-ignored; logs never contain passwords, tokens or full JWTs.
- **SSR/TransferState:** never serialize secrets or other users' data into `TransferState`; it is visible in the HTML.
- **IDs:** prefer UUIDs for user-facing resources that must not be enumerable (the current `tasks` demo uses sequential bigints).
- **Dependencies:** `npm audit` as part of validation; do not add a package for what ~20 lines cover.

### Code quality

- No `any`, unsafe casts or magic indexes; narrow `unknown` at runtime.
- Self-documenting names; a comment only for a non-obvious *why*.
- One function, one level of abstraction; early returns instead of nesting.
- Handle error/empty/null paths where they occur, not woven through the happy path.
- No empty `catch`: handle, log with context, or rethrow.
- Named constants for magic numbers/strings, with the *why* when the value isn't obvious (cutoffs, windows, limits) — in `*.model.ts`.
- Booleans read positively (`isConfirmed`); no bare `true`/`false` argument — use a named option.
- No dead code, commented-out code or stray `console.log` (the server startup message is the only allowed one).
- A diff traces entirely to its purpose: no drive-by renames or formatting passes mixed with behavior changes.

### Code review checklist

**Structure & conventions**

- [ ] Concept naming matches the table; no concept folder without content.
- [ ] No import breaks the boundaries (lib → app, app → server runtime, component → store/DB).
- [ ] Components are thin; orchestration is in the ViewModel; no `store.select()` in components.
- [ ] New data access goes through the `<Concept>Api` abstraction; no direct `HttpClient` in components/effects.
- [ ] Routers use the shared error path; no hand-rolled `try/catch` unless justified in the PR.
- [ ] Styling follows Tailwind-first + BEM-SCSS fallback; reusable UI has a Storybook story.
- [ ] `npm run lint`, `npm test`, `npm run build` pass (and `npm run e2e` for UI/SSR/data-flow changes).

**Security**

- [ ] Auth enforced server-side on every non-public route. (blocker)
- [ ] Authorization checks the specific record. (blocker)
- [ ] Check-then-act on shared state is transactional with a unique constraint. (blocker)
- [ ] No secret/token/password in logs, error responses, `TransferState` or client payloads. (blocker)
- [ ] No untrusted input reaches a query, shell or path unparameterized. (blocker)
- [ ] Write endpoints parse an explicit shape; no raw body into `em.create()`/`em.assign()`. (blocker)
- [ ] Cookie flags preserved when auth-cookie code is touched. (major)
- [ ] Security decisions fail closed on unexpected errors. (blocker)
- [ ] Security bug fixes ship a regression test that fails without the fix. (major)
- [ ] Rate limiting present on login/register/reset endpoints touched. (major)

**Correctness & tests**

- [ ] Behavior changes ship a test that fails on the old code; bug fixes ship a regression test.
- [ ] Race-sensitive flows have a test for the concurrent case, not just the happy path.
- [ ] Tests mock external boundaries (HTTP, Store, EntityManager, browser APIs), not internal helpers.
- [ ] E2E uses `data-testid`/accessibility selectors and waits on observable state, never sleeps.

---

## 2. Scaffolding a new concept

Example: "add `reviews`". Do the steps in order; create each folder only when its first file is added.

1. **Contracts** — `app/core/api/<concept>.model.ts`: entity DTO, `<Concept>DataSource` interface, limits as named constants.
2. **Persistence** — `server/<concept>/<name>.model.ts` (record type), `<name>.entity.ts` (`EntitySchema`), add it to `entities` in `server/database/database.ts`.
3. **Repository** — `server/<concept>/<concept>.repository.ts` implementing the data source (fork `EntityManager` per call; transaction for check-then-write). Spec mocks the `EntityManager`.
4. **Request parsing** — `server/<concept>/<concept>.helper.ts` + spec (valid, invalid, boundary cases).
5. **HTTP** — `server/<concept>/<concept>.router.ts`; mount in `src/server.ts` under `/api/<concept>` after auth where needed; expose the repository through `ServerRequestContext`.
6. **Client API** — `<Concept>Api` abstraction, `Server…Api` (repository + `TransferState`), `Http…Api`; provide them in `app.config.ts` / `app.config.server.ts`.
7. **State** — `store/<concept>/` actions (`createActionGroup`), reducer, memoized selectors, functional effects calling the API abstraction; register in the store config. Specs per file.
8. **Feature** — `features/<concept>/`: ViewModel service (readonly signals + `vm`), thin component with Tailwind classes, route entry in `app.routes.ts` (and `app.routes.server.ts` render mode). Reuse `libs/ui` / `libs/form-engine` before writing bespoke UI.
9. **Verify** — specs, Playwright test (`data-testid`), `lint`, `test`, `build`, `e2e`; update the spec in `.ai/specs/` and any lesson learned.

Never create a `modules/<concept>/` directory, per-concept setup/ACL files or auto-discovery.

---

## 3. Reference layout

```text
apps/shell/src/
  app/
    core/api/            <concept>.model.ts, <concept>-api.service.ts, http-/server- implementations, transfer helper
    features/<concept>/  components/ services/ (ViewModel) models/
    store/<concept>/     actions, reducer, selectors, effects (+ specs)
    shared/              app-only reusable code (when a second feature needs it)
    integration/         library adapters, host providers
  server/
    database/            ORM factory, schema bootstrap, seed
    http/                errors.ts, error-handler.ts, auth.ts (when needed)
    <concept>/           *.entity.ts, *.model.ts, *.repository.ts, *.helper.ts, *.router.ts (+ specs)
  server.ts              Express wiring, explicit mounts, SSR handler
libs/ui/                 generic PrimeNG-based components + stories
libs/form-engine/        form contracts, runtime, validators
```

Boundaries: `app → ui | form-engine`; `server` is Node-only and imported by `app` as types only.

## 4. Implemented vs. still open

Implemented: typed `AppError` hierarchy (`server/http/errors.ts`), single `apiErrorHandler` (`server/http/error-handler.ts`, malformed JSON → 400, unexpected → generic 500), routers without `try/catch`, client `ApiError` + `toApiError` (`core/api/api-error.*`), `*Failed` actions with error state in the store, effects that never die on a failed request, error rendering in the feature (`data-testid="tasks-error"`).

Still open (introduce with the first real need, not earlier):

- `server/http/auth.ts` (`requireSession`, ownership assertions) — no auth feature yet. `UnauthorizedError`/`ForbiddenError` already exist.
- Shared client request helper / HTTP interceptor — add when a second feature calls `/api/*`.
- Shared `libs/ui` list and loading/empty/error components — add when a second feature needs them (the tasks page renders them inline).
- MikroORM migrations instead of `schema.update()` — before the first production schema change.
- UUID ids for non-enumerable resources (`tasks` uses sequential bigints).
- Rate limiting, CSRF header check, cookie flags — with the first auth/session feature.
