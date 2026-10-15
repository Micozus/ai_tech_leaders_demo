# Code review rules

Read by `om-code-review` (and therefore `om-auto-review-pr`) automatically. The full naming table, scaffold recipe, and the canonical checklist this file summarizes live in [.ai/docs/engineering-standards.md](.ai/docs/engineering-standards.md) — that file and this one are kept in sync; when they disagree, fix both in the same change. `.ai/agentic.config.json` also points `reviewChecklist` at that file, so a review reads both.

Stack: Angular 21 (standalone, zoneless, Signals, OnPush, SSR) · Nx 22 · TypeScript strict · NgRx 21 · PrimeNG 21 · Tailwind 4 + SCSS/BEM · Express 5 · MikroORM 7 + PostgreSQL · Vitest · Playwright · Storybook · npm.

## Review priorities, in order

1. **Correctness** — does the change do what the PR claims, including error/empty/null paths?
2. **Security** — server-side auth/authorization, injection, secrets, session handling (see Security below).
3. **Contracts** — does the diff respect `BACKWARD_COMPATIBILITY.md` for any protected surface it touches (HTTP routes, DB schema, library exports, config shapes)?
4. **Architecture boundaries** — layering and ownership rules below.
5. **Quality and tests** — coverage, readability, reuse.

## Repo-specific checks

**Structure & layering**

- [ ] Concept naming matches the table in `.ai/docs/engineering-standards.md`; no concept folder created without content.
- [ ] No import breaks a boundary: `libs/*` never imports `apps/shell` app code (Nx tags + ESLint enforce this); `src/app` never imports `src/server` except as types.
- [ ] Components stay thin (presentation/interaction only); orchestration lives in a component-scoped ViewModel service exposing readonly signals including `vm`; components never call `store.select()` directly.
- [ ] New data access goes through a `<Concept>Api` abstraction (`Server<Concept>Api` via `REQUEST_CONTEXT` + `TransferState` for SSR, `Http<Concept>Api` for the browser) — no direct `HttpClient` calls in components or effects.
- [ ] Express routers stay free of `try/catch` (Express 5 forwards rejected promises to `apiErrorHandler`); typed `AppError` subclasses are thrown instead.
- [ ] MikroORM entities use `EntitySchema` (no decorators — esbuild has no decorator metadata); repositories fork the `EntityManager` per operation, never a shared/global one; no string-built SQL.
- [ ] A check-then-write on shared state (availability, balance, status transition) is wrapped in `em.transactional`, backed by a unique constraint — never two round-trips.
- [ ] Styling is Tailwind-utility-first; component SCSS only for what Tailwind cannot express, BEM-named and co-located (`_component-name.scss`).
- [ ] Reusable `libs/ui` components ship a Storybook story.
- [ ] Types/interfaces/named constants live in `*.model.ts`; `interface` for objects, `type` for unions/mapped types; no `any`, unsafe casts, or magic indexes.
- [ ] Private fields use `#`; private methods use `private`; early returns over nested conditionals.

**Security** (blockers unless noted)

- [ ] Auth and **record-level** authorization (not just "logged in") enforced server-side on every non-public route. Hiding a UI element is not enforcement.
- [ ] Every write endpoint parses an explicit typed shape and rejects with `ValidationError` (400); no raw `req.body` spread into `em.create()`/`em.assign()` (mass assignment).
- [ ] Price, ownership, and status fields that affect money or access are revalidated server-side even when client-supplied.
- [ ] No untrusted input reaches a query, shell command, or file path unparameterized; only MikroORM query APIs touch the database.
- [ ] No secret, token, password, or another user's data in logs, error responses, or `TransferState` (SSR state is visible in page HTML).
- [ ] Session/auth cookie flags (`httpOnly`, `secure` in production, `sameSite`) are preserved whenever auth-cookie code is touched. (major if missed outside auth code)
- [ ] Security-relevant bug fixes ship a regression test that fails without the fix. (major)
- [ ] An error inside an authorization/ownership check denies (fail closed) — ambiguity is 403, never a best-effort 200.

**Correctness & tests**

- [ ] Behavior changes ship a test that fails on the old code; bug fixes ship a regression test.
- [ ] Race-sensitive flows (concurrent writes, double submit, webhook retries) have a test for the concurrent case, not just the happy path.
- [ ] Tests mock external boundaries only (HTTP, NgRx Store, `EntityManager`, browser APIs) — never internal helpers.
- [ ] `coverage-guard.spec.ts` in each project still imports every source file (it exists so an unimported file cannot read as 100% covered by omission).
- [ ] Playwright/integration specs use `data-testid` or accessibility selectors and wait on observable state — never a sleep.
- [ ] New feature carries 100% statement/branch/function/line coverage with no coverage-ignore comments — `npm run test:coverage` is part of the validation gate and fails the PR otherwise.

**Diff hygiene**

- [ ] No dead code, commented-out code, or stray `console.log` (the one allowed server-startup message is the only exception).
- [ ] No drive-by rename or formatting pass mixed into a behavior change.
- [ ] No duplicated contract, redundant adapter, or compatibility re-export — one definition per schema/contract/error mapping.

## Validation gate

Every PR must pass, in order: `npm run lint`, `npm run test:coverage` (100% gate), `npm run build`. Add `npm run integration` and/or `npm run e2e` when the change touches UI, SSR, or the data-access layer, per `AGENTS.md`.

## Severity guidance

- **Blocker** — breaks the build/tests/gate, a security item above, a broken architecture boundary, or a `BACKWARD_COMPATIBILITY.md` violation without a documented migration path.
- **Major** — missing regression test for a bug fix, missing coverage, a layering smell that works today but will trap the next change, a `risk-high` change (per `SDLC.md`) missing its required evidence.
- **Minor** — naming/convention drift, a missed opportunity for an existing shared abstraction, a readability nit.

A `risk-high` PR (auth, sessions, data scoping, money, schema migrations, or shared contract surfaces — see `SDLC.md`) is blocked without the evidence that section requires, unless a maintainer waives it explicitly on the PR.
