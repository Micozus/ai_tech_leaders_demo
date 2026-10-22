# Run: design system, stage 1 (foundations), 2026-10-22

Objective: Storybook as a user manual for the DevMentor design system; stage 1 = Storybook config, three-layer tokens, Foundations pages, token lint.
Inputs: `lekcja-06/referencje.md`, `lekcja-06/tokeny.md` (approved), decisions in `libs/ui/POSTEP.md` (PrimeNG in `libs/ui`, light only, PrimeIcons, Inter).
Spec: none new; the plan is `libs/ui/POSTEP.md`.

## Decisions and deviations
- Built on branch `feat/design-tokens-and-base-components` (PR #51, open, not merged).
- Existing components migrated to the new tokens so the app keeps building (shape, density and states are restyled in stage 2).
- Removed (approved in tokeny.md): `mint-300`, four shadow tokens, radius scale, `text-2xl`, button hover lift, avatar gradient, `--color-subtle`.
- Dependencies added: `@storybook/addon-docs`, `@storybook/addon-a11y` (10.2.4), `remark-gfm`, `axe-playwright`, `@fontsource-variable/inter`, `primeicons` 7.0.0 (MIT; not in the repo before, 8.x has a licence key). `@storybook/test-runner` was added then removed (see lesson).
- Story tests run through our own script, not the Vitest addon or the test-runner (lesson 2026-10-22).

## Checks run
- `npm run lint`: pass (3 existing warnings in form-engine spec). `npm run test:coverage`: 100% in ui (76/76, 6/6), form-engine and shell. `npx nx build shell`: pass. `npx nx build-storybook ui`: pass.
- `npm run test-storybook`: 35 of 35 stories pass render and axe (WCAG 2.2 A/AA); negative probe (low contrast, unnamed button, missing alt, throwing play function) failed as expected.
- `npm run tokens:lint`: clean for the design system; negative probe detected hex, rgb(), oklch(), palette classes and an arbitrary value; `--all` finds `text-slate-500` in `apps/shell/.../admin-page.component.ts` (app code, not changed).
- Browser: Foundations pages checked at 1440 px (tables render as tables, live contrast values), Color page at 320 px without horizontal scroll.

## Not checked
- Foundations pages other than Color at 320 and 768 px; keyboard and overlays (no overlays yet); `npm run integration` and e2e (no route changed).
