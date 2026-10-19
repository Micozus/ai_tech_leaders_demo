# Design tokens and base UI components

Status: implemented · Source: `devmentor-koncepcja-i-klikalny-prototyp.zip` (visual language only) · Guide: `.ai/docs/style-guide.md`

## Goal
Give feature work one visual vocabulary: design tokens extracted from the concept prototype, a PrimeNG theme driven by the same tokens, and a small set of generic base components in `libs/ui`, documented in Storybook.

## Scope
- Tokens in `libs/ui/src/lib/styles/tokens.css` (Tailwind 4 `@theme static`): colour scales and semantic roles, type scale, radius, elevation, motion, breakpoints, layering. Element defaults in `styles/base.css`.
- `DEVMENTOR_PRESET` (PrimeNG Aura) referencing tokens by `var(--…)`; provided in the app.
- Components: button, badge, avatar, alert, spinner, skeleton, empty state, field, page header; card restyled. Specs and stories for each; a *Foundations / Design tokens* gallery story.
- Light theme only (no dark mode, decided by the requester): `color-scheme: light` and PrimeNG `darkModeSelector: 'none'`.
- Out of scope: domain components, product behaviour in the prototype (ratings, chat, video, admin console, search, 12 h cancellation, USD): they contradict N01, N02, R08, R09, R13 and D19 (see the style guide).

## Acceptance criteria
- No colour, radius or shadow literal outside `tokens.css`; templates use semantic utilities.
- `npm run lint`, `npm run test:coverage` (100 % per project) and `npm run build` pass; `npm run build-storybook` (ui) succeeds and its CSS contains tokens and the utilities the components use.
- A spec fails if the PrimeNG preset references a token that does not exist.

## Decisions
- Tokens live in the library and the app `@use`s them with an explicit `@source` for `libs/ui` (Tailwind scans only the app root).
- `@theme static` so every token is emitted as a runtime variable (the preset needs them even when no utility uses them).
- Components that enhance native elements use kebab-case attribute selectors (`button[ui-button]`); `libs/ui` lint allows attribute component selectors.
- PrimeNG `borderRadius` is a *primitive* token, not a semantic one.

## Open questions
- Font: Inter is declared but not self-hosted or loaded; load it (self-hosted, per CSP) before the first public page.
