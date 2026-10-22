# POSTEP — DevMentor design system

Last updated: 2026-10-22 · Current stage: **1 (foundations) done — waiting for the requester's "dalej" before stage 2**
Location: `libs/ui/` (Storybook in `libs/ui/.storybook`, docs in `libs/ui/src/docs`). Branch `feat/design-tokens-and-base-components` (PR #51, open, not merged). Nothing is pushed by this work.

## Stages

| Stage                                   | Status                 |
| --------------------------------------- | ---------------------- |
| 0 Inventory and plan                    | done, approved         |
| 1 Foundations                           | done, awaiting "dalej" |
| 2 Base components                       | not started            |
| 3 Product components, patterns, screens | not started            |
| 4 Teaching pages                        | not started            |
| 5 Verification and report               | not started            |

## Approved decisions

- Base and location: PrimeNG 21 styled by our tokens, in `libs/ui` (no shadcn/Radix, no `packages/ui`). (2026-10-22)
- Theme: light only. No theme switch; tests run once. (2026-10-22)
- Icons: PrimeIcons. Font: Inter, self-hosted. (2026-10-22)
- Tokens: `lekcja-06/tokeny.md` approved in bulk (T1–T10). Source of decisions: `lekcja-06/referencje.md` (R01, R02, A01–A05, P1–P11 accepted). (2026-10-22)
- Product UI language and documentation language: English.

## Open questions

- **Accent colour:** is solid violet allowed under A01? Value `accent-600` is provisional.
- **Type:** only Inter (provisional, no type reference). Tone of voice: no reference.
- **No screenshots** for R01, R02: observations are paraphrases. Five questions in `referencje.md` (Luki) are unanswered: screenshots, hierarchy on the list row and booking screen, colour reference, type and tone reference, slot and payment references.
- **Docs prose font:** Storybook's docs pages use Storybook's own text font, not Inter. Decide whether to theme it.

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

## Next step

After "dalej": stage 2. List the differences from the default PrimeNG look with the decision behind each (control height, radius, borders, padding, focus), then build base components in batches of about six, each with the 13-section page, state matrix and `play` tests.

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
