# AGENTS.md

Angular 21 (standalone, zoneless, Signals, OnPush) · Nx 22 · TypeScript strict · NgRx 21 · PrimeNG 21 · SCSS + BEM · Vitest · Playwright · Storybook · npm.

## Layout

- `apps/shell/src/app/` — `core/` (API, global services), `features/` (route-level), `shared/` (app-only reusable; create when needed), `store/` (NgRx), `integration/` (library adapters, host providers).
- `libs/ui` — generic visual components. `libs/form-engine` — form contracts and runtime. Inside libs, group by role: `components/ directives/ services/ helpers/ models/ validators/ pipes/ integration/ testing/` (create only when used).
- `apps/shell-e2e` — Playwright.

## Architecture

- Ownership: ui = visual primitives; form-engine = form contracts/runtime; app = routing, NgRx, API, workflows. Libraries never import app code (enforced by Nx tags).
- Use `inject()` and explicit providers. Components are thin (presentation/interaction only).
- ViewModel pattern: a component-scoped service exposes readonly signals incl. `vm`; components never call `store.select()`.
- State: Signals for local/UI, NgRx for application state, RxJS for async workflows.
- Transformations: pure, typed helpers. Variable behavior lives in configuration, not product-specific conditions.
- Single source of truth: no duplicated contracts, redundant adapters or compat re-exports.
- Path aliases (`@org/ui`, `@org/form-engine`) across projects; relative imports inside a library.

## Conventions

- Standalone, `OnPush`, inline templates; `input()`/`output()`/`computed()`/`effect()`; `@if/@for/@switch`, always `track`.
- Types, interfaces and named constants go in `*.model.ts`. `interface` for objects, `type` for unions/mapped types.
- No `any`, unsafe casts or magic indexes. Private fields use `#`; private methods use `private`.
- Early returns, named helpers, shallow nesting.
- SCSS: BEM, co-located `_component-name.scss`.
- Filenames: `*.component.ts`, `*.service.ts`, `*.helper.ts`, `*.model.ts`, `*.spec.ts`.
- NgRx: functional effects, `createActionGroup`, memoized selectors.
- Never hand-edit generated code. Prefer existing patterns over new abstractions.

## Testing

- Vitest specs next to the code. Mock external boundaries (HTTP, Store, browser APIs), not internal helpers.
- Test behavior, not implementation. Playwright uses `data-testid` or accessibility selectors; no sleeps.
- Reusable UI components get Storybook stories.
- Commits follow Conventional Commits (commitlint + Husky).

## Commands

`npm start` · `npm run build` · `npm run lint` · `npm test` · `npm run e2e` · `npm run storybook`
