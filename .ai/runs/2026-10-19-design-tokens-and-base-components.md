# Run: design tokens and base components (2026-10-19)

Objective: unpack the concept prototype, align it with the current plan (brief, specs #46–#48) and app direction (AGENTS.md), extract design tokens, add base components and a style guide.
Spec: `.ai/specs/implemented/2026-10-19-design-tokens-and-base-components.md`

## Steps and decisions
- Read the prototype (README, `styles.css`, docs 01–05, `src/main.ts` size only). Its product scope conflicts with the brief (N01, N02, R08, R09, R13, D19), so only the visual layer was used; conflicts are tabled in the style guide.
- Tokens as Tailwind 4 `@theme static` in `libs/ui`; app imports them through `styles.scss`; PrimeNG preset points at `var(--…)`.
- Nine components + card restyle, specs, stories, token gallery story.
- Mistake caught: a heredoc typo emptied `card.component.ts`; rewritten with tokens and the SCSS file removed (Tailwind first).

## Commands
- `npx nx test ui` before: 2 tests. After: `npm run test:coverage` 3 projects pass, 100 % statements/branches/functions/lines (ui 76/76, 6/6).
- `npm run lint`: pass after allowing attribute component selectors in `libs/ui`.
- `npx nx build shell`: first failed (`borderRadius` is not in `Semantic`; it is a primitive) then passed; built CSS contains `--color-accent-600`, `.bg-accent-tint`, `.shadow-card`.
- `npx nx build-storybook ui`: passes; CSS has tokens and utilities.
- Not run: `npm run integration`, `npm run e2e` (no route or page changed; Docker unavailable here).

## Open issues
- Inter not loaded/self-hosted. Dark mode removed on request (light only). Visual check of Storybook in a browser not done (build only).
