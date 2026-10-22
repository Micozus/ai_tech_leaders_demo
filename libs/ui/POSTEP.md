# POSTEP — DevMentor design system

Last updated: 2026-10-22 · Current stage: **2 done (batch 3 included); stage 3 in progress. The requester said to continue without stopping (2026-10-22), so stage gates are skipped; decisions that are the requester's are logged as proposals**
Location: `libs/ui/` (Storybook in `libs/ui/.storybook`, docs in `libs/ui/src/docs`). Branch `feat/design-tokens-and-base-components` (PR #51, open, not merged). Nothing is pushed by this work.

## Stages

| Stage                                   | Status           |
| --------------------------------------- | ---------------- |
| 0 Inventory and plan                    | done, approved   |
| 1 Foundations                           | done             |
| 2 Base components                       | done (3 batches) |
| 3 Product components, patterns, screens | not started      |
| 4 Teaching pages                        | not started      |
| 5 Verification and report               | not started      |

## Approved decisions

- Base and location: PrimeNG 21 styled by our tokens, in `libs/ui` (no shadcn/Radix, no `packages/ui`). (2026-10-22)
- Theme: light only. No theme switch; tests run once. (2026-10-22)
- Icons: PrimeIcons. Font: Inter, self-hosted. (2026-10-22)
- Stage 2 answers (2026-10-22): disabled = 50% opacity plus the reason as text beside it (D9); skeleton pulses and is static under reduced motion (D19); only optional fields are marked, with "Optional" in `muted` (D22/Field); new token `scrim` (`inverse` at 40% via `color-mix`, no blur) for the dialog backdrop (D12).
- Accent: solid violet is allowed (`accent-600`); A01 forbids violet gradients, not the colour. (2026-10-22)
- Docs pages use Inter (docs theme sets fonts only, no colours). (2026-10-22)
- Tokens: `lekcja-06/tokeny.md` approved in bulk (T1–T10). Source of decisions: `lekcja-06/referencje.md` (R01, R02, A01–A05, P1–P11 accepted). (2026-10-22)
- Product UI language and documentation language: English.

## Open questions

- **No type reference and no tone-of-voice reference:** Inter and the type roles are proposals. The requester confirmed Inter and solid violet on 2026-10-22.
- **No screenshots** for R01, R02: observations are paraphrases. Four questions in `referencje.md` (Luki) are unanswered: screenshots, hierarchy on the list row and booking screen, type and tone reference, slot and payment references. The colour question is answered (solid violet allowed; A01 forbids violet gradients).

## Done in stage 1

- Storybook 10.2.4 (Angular): addon-docs (with `remark-gfm` so MDX tables render), addon-a11y with `a11y: { test: 'error' }`, interaction tests via `play`, product name only in the interface (title, heading, icon overridden in `manager-head.html`; checklist, telemetry and update notices off).
- Tokens rewritten in three layers with sources in comments (`libs/ui/src/lib/styles/tokens.css`); existing components migrated to them; the PrimeNG preset follows.
- Foundations pages: Color (roles and a live, measured contrast table), Typography, Spacing and layout, Shape and depth, Motion, Icons, Themes (light only).
- `npm run tokens:lint` (colours, palette classes, arbitrary values; `-- --all` includes the app) and `npm run test-storybook` (every story: render, `play`, axe WCAG 2.2 A/AA).

## Checks (stage 1)

- `npm run lint` pass · `npm run test:coverage` 100% (ui 76/76 statements, 6/6 branches) · `npx nx build shell` pass · `npx nx build-storybook ui` pass.
- `npm run test-storybook`: 35 of 35 stories pass; the negative probe failed as it should (contrast, button name, image alt, throwing `play`).
- `npm run tokens:lint`: clean for the design system; the negative probe detected every rule. With `--all` it finds `text-slate-500` in `apps/shell/src/app/features/admin/components/admin-page.component.ts` (app code, not changed per rule 11).
- Browser: Color, Typography and Spacing pages at 1440 px; Color at 320 px without horizontal scroll.

## Not checked yet

- Other Foundations pages at 320 and 768 px, keyboard use and overlays (stage 5).
- `npm run integration`, `npm run e2e` (no route changed).

## Deviations from the brief, for the requester

- **Test runner:** `@storybook/addon-vitest` does not support Angular (webpack) and `@storybook/test-runner` fails on Node 24 with any config file, so story tests run through `scripts/storybook-test.mjs` (Playwright and axe-playwright). Details: `.ai/lessons/2026-10-22-storybook-angular-testing-and-branding.md`.
- **PrimeIcons:** the package was not in the repo, so `primeicons` was added, pinned to 7.0.0 (MIT); 8.x ships under a licence-key licence.
- **Components:** the 9 existing components and `ui-card` were migrated to the new tokens now (the old tokens were removed), so the app keeps building. Their shape, density, states and full documentation are stage 2.
- **Pre-existing app code:** `admin-page.component.ts` uses `text-slate-500`; not changed.
- **`msw`** (API simulation) is not installed yet; it is added in stage 3 for the form pattern.

## Stage 2 state (2026-10-22)

- D1–D24 (differences from the PrimeNG default) approved by "dalej"; Q-A…Q-D answered (see Approved decisions).
- **Batch 1 done:** button (+ text action = ghost variant), link (new), text field (new), textarea (new), select (new), checkbox (new), radio group (new). Each has a documentation page with the 13 sections (`*.mdx` next to the component), stories (Playground, variants, state matrix with frozen hover/focus/pressed, long text, narrow screen, do and don't, interaction test), a unit spec at 100% coverage.
- **New tokens:** `scrim` (dialog backdrop, not used yet), `accent-pressed`.
- **Preview states:** `data-preview-state` works through custom `hover`, `active` and `focus-visible` variants defined only in `libs/ui/.storybook/styles.scss`. Verified that the frozen hover and focus computed styles equal the real ones.
- Batches left: 2 field (restyle, optional marking), card/panel, status badge, avatar, alert, skeleton (pulse), empty state, error state · 3 dialog, confirm dialog, menu, popover, tooltip, tabs, toast.

### Deviations (batch 1), for the requester

- **Select, checkbox and radio are native elements** (`<select>`, `<input type="checkbox|radio">`) styled with tokens, not PrimeNG components. Reason: the platform control is keyboard, touch and screen-reader complete, and fewer parts to keep accessible. A PrimeNG combobox is for searchable lists and is not built ("What is missing"). The arrow of the select and the box of the checkbox/radio are the platform's (accent colour only).
- **Components as attribute selectors:** `input[ui-text-field]`, `textarea[ui-textarea]`, `select[ui-select]`, `a[ui-link]`, `label[ui-checkbox]`, `label[ui-radio]`, `fieldset[ui-radio-group]`.
- **Pressed `danger`** has only a border change (a red fill would fail contrast with red text).
- **PrimeNG preset (D24 surface scale)** is deferred to batch 3, when the first PrimeNG component (dialog) appears.
- **Docs tables** scroll inside themselves at 320 px (one CSS rule in `preview-head.html`); component pages themselves have a narrow-screen story.

### Batch 2 (done, 2026-10-22)

- **Components:** field (restyled: optional marking, error with icon and text, sets `aria-describedby` on the control itself), card (dense and roomy, heading level), status badge, avatar (flat, square), alert (icon per tone, optional heading), skeleton (pulse, static under reduced motion), empty state, error state (new).
- Each has the 13-section page, the story set (Playground, variants, state matrix, long text, narrow screen, do and don't, interaction test), a unit spec at 100% coverage.
- **Not given a 13-section page** (not in the planned minimal list): page header and spinner keep their autodocs stories. Add pages if a screen needs them.
- **Checks:** lint pass · `test:coverage` 100% (ui 134/134 statements, 22/22 branches) · `nx build shell` pass · `tokens:lint` clean · `test-storybook` 125 of 125 stories pass render, `play` and axe · all 15 component docs pages checked at 1440 and 320 px (tables render, no raw pipes, no horizontal page scroll).
- **Deviation:** the card heading is `role="heading"` with `aria-level` (a div), so the level can follow the page outline; a native `h2` to `h4` would need a template per level.

### Checks (batch 1)

- `npm run lint` pass · `npm run test:coverage` 100% (ui 107/107 statements, 12/12 branches) · `npx nx build shell` pass · `npx nx build-storybook ui` pass · `npm run tokens:lint` clean.
- `npm run test-storybook`: 80 of 80 stories pass render, `play` and axe. Earlier runs caught real defects that were fixed: loading button at reduced opacity failed contrast; ghost hover and danger pressed failed contrast; a select keyboard test that cannot work with synthetic events was removed.
- Browser: the seven docs pages at 1440 and 320 px: tables render as tables (no raw pipes), no horizontal page scroll at 320.

### Batch 3 (done)

- Dialog, confirm dialog, menu, popover, tooltip (`uiTooltip`), tabs, toast (+ `ToastService`, `provideToast`), all on PrimeNG, themed by the extended `DEVMENTOR_PRESET`: warm surface scale (D24), 3px focus ring, 50% disabled, overlay and modal shapes, `scrim` backdrop, tooltip, tabs, toast without blur.
- Storybook gets PrimeNG through a global `applicationConfig` decorator; story tests run axe on the whole body so overlays are checked.
- 167 of 167 stories pass render, `play` and axe; lint, 100% coverage (ui 205/205 statements, 27/27 branches), shell build and `tokens:lint` pass.
- Notes: the confirm dialog moves focus to the way-out button when shown (no `autofocus`, lint forbids it); `ResizeObserver` is stubbed in the lib's test setup (jsdom); `ToastService` has no error tone by design.

## Next step

After "dalej": batch 3 of stage 2 (dialog, confirm dialog, menu, popover, tooltip, tabs, toast) with the PrimeNG preset (D24 surface scale, shapes, scrim), then stop.

---

## Inventory (stage 0, approved)

### Components derived from specs and backlog

**Base (about 18):** button, text action and link, text field, textarea, select, checkbox, radio group, field, card, status badge, avatar, alert, dialog and confirm dialog, menu, skeleton and spinner, empty state, error state, page header. Proposals that need a screen to justify them: toast (only "Share link copied", E02-S02), tooltip (explain a disabled "Pay"), tabs.

**Product by epic:** E01 sign-in panel, app header with role and sign-out, access-denied state · E02 invitation accept panel, mentor-page form, share-link field, slot publisher, price form, payout status (1.1) · E03 mentor list row (no score), stack-tag filter, slot picker with length, booking summary, payment status, upcoming-session row, cancellation notice (24 h) · E04 text session panel with "text only" notice, written answer, note draft, note approve/decline panel · E05 (1.1) invitation batch table, price-bounds and fee form, dispute record form.

**Patterns:** form (with API-state stories), list with filters, detail view, destructive confirmation, booking flow, note approval, slot publication.

### Storybook tree

Design system (Start here, Components, How to choose, Usage and accessibility, Content, What to avoid, What is missing, Contributing, one page per epic E00–E06) · Foundations (Color, Typography, Spacing and layout, Shape and depth, Motion, Icons, Themes) · Primitives · Product · Patterns. Estimate: about 60 pages, 320 stories, 45 interaction tests.

### Existing design system (rule 12)

Kept: `base.css`, preset, 9 components and card with specs and stories. Changed with approval: token values and names (`tokeny.md`). Removed with approval: `mint-300`, four shadows, radius scale, `text-2xl`, hover lift, avatar gradient, `--color-subtle`. `.ai/docs/style-guide.md` is now a pointer.
