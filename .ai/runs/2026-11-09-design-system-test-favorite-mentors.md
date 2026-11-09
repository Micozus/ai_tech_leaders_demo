# Run: design-system sufficiency test — "Favorite mentors", 2026-11-09

Objective: build a mentee "Favorite mentors" test screen (saved mentors, filtered by stack tag,
with "remove from favorites" and "view profile" per card; states: loading, empty, error,
no-results-for-filter) using only existing design-system components, tokens and patterns, to
find out whether the design system is sufficient. Not a shipped screen; "favorites" is not a
backlog feature (checked `.ai/specs/` and `.ai/specs/backlog.md` — not present).
Sample data only, no backend.
Output: `libs/ui/src/screens/design-system-sufficiency-test-favorite-mentors.stories.ts`.

## Step 1 — decisions before writing code

| # | Decision | Tag | Source / note |
| - | -------- | --- | -------------- |
| 1 | Layout: `ui-app-header` + `ui-page-header` + `grid gap-panel-roomy md:grid-cols-4` | REGUŁA | copied from `mentor-list.component.ts` |
| 2 | Filter: reuse `ui-stack-tag-filter` as-is, two-way bound | REGUŁA | exact existing reusable component, built for `MentorSummary`/`StackTag`; no gap here |
| 3 | Loading / error / empty-vs-empty-for-filter via `ui-async-region` | REGUŁA | same established pattern as the mentor list and the sessions test screen |
| 4 | One favorite's layout: avatar, name, headline, tag badges, two buttons | PRZYKŁAD | closest precedent is `mentor-list-row.component.ts` ("one mentor in a list"), but it shows price/next-slot and one button, has no headline, and is not reusable here; copied its visual shape by hand instead of reusing the component |
| 5 | "View profile" button, soft variant, emits an id (no real navigation) | PRZYKŁAD | mirrors `MentorListRowComponent`'s "View mentor" button convention |
| 6 | "Remove from favorites" button, quiet variant, no confirmation dialog | ZGADUJĘ | no rule says when a removal needs `ui-confirm-dialog`; the only destructive-confirmation precedent is cancelling a paid booking (costlier). Assumed unfavoriting is low-stakes enough not to need one |
| 7 | Headline field, typed as a local `FavoriteMentor` (`Pick<MentorSummary,...> & {headline}`), not added to the shared model | ZGADUJĘ / gap | `MentorSummary` has no headline field |
| 8 | "Favorite" concept itself (save/remove) not represented anywhere in `product.model.ts` or the backlog | gap, see below | — |
| 9 | Spacing/typography tokens throughout | REGUŁA | existing token classes, used as documented |
| 10 | Interface language: English | REGUŁA | `libs/ui/POSTEP.md` |
| 11 | File placed in `libs/ui/src/screens/` under its own title | ZGADUJĘ | same reasoning as the sessions test screen: no rule dictates placement |

Counts: REGUŁA 5, PRZYKŁAD 2, ZGADUJĘ 4.

## Step 2 — build and check

- Built with: `ui-app-header`, `ui-page-header`, `ui-async-region`, `ui-avatar`, `ui-badge`,
  `button[ui-button]`, `ui-stack-tag-filter`. No new reusable component created; the local
  `@Component` in the story file (`FavoriteMentorsComponent`) only holds the demo's local
  selection/removal state (precedent: `libs/ui/src/patterns/slot-publication.stories.ts`).
- Hardcoded-value check: `node scripts/tokens-lint.mjs --all` → clean. No hex/rgb/hsl/oklch, no
  Tailwind palette classes, no arbitrary values in the new file.
- `npx nx lint ui`: pass (one pre-existing, unrelated warning in `skeleton.component.stories.ts`).
- `npx nx test ui --coverage`: 100% unchanged (story files are excluded from coverage).
- `npm run build-storybook`: pass.
- `node scripts/storybook-test.mjs --filter "Favorite mentors"`: 8 of 8 new stories pass (render,
  `play`, axe WCAG 2.2 A/AA).

## Result

### 1. Gaps, grouped

- **Missing component:** no "one favorite in a list" row. The closest is `MentorListRowComponent`
  ("one mentor in a list," E03-S01), but it is shaped for the booking list (price, next free slot,
  a single "View mentor" button) and has no headline field or a second action slot. I hand-built
  the row from primitives instead of reusing it. **To add:** either make the row component
  configurable (optional price/slot, a projectable actions slot) or write a rule for building a
  mentor-row variant without those fields, so it is not re-invented per screen.
- **Missing model / rule:** `MentorSummary` has no professional-headline field, and "favorite
  mentor" (save/remove) does not exist anywhere in `product.model.ts`, the specs, or the backlog —
  it is outside the current product scope. I added a local, display-only type for this screen's
  sample data only. **To add, if this becomes a real feature:** a headline field on `MentorSummary`
  (or a dedicated type), and a `FavoriteMentor`/mentee-mentor relation in the model.
- **Missing rule:** no documented threshold for when a removal action needs
  `ui-confirm-dialog`. The only precedent (`destructive-confirmation` pattern) is cancelling a
  paid booking — a costlier action than unfavoriting. I guessed unfavoriting does not need one.
  **To add:** a short rule in the design system ("confirm destructive actions above X cost/
  irreversibility; a toggle like favoriting does not need one") so the next agent does not have
  to guess.
- **Missing state:** none. All four required states were buildable from `ui-async-region` plus
  the existing `ui-stack-tag-filter`, which already distinguishes a plain empty list from a
  filtered-to-nothing one when the caller computes which applies.
- **Unclear or conflicting documentation:** none found.

### 2. Decision counts

REGUŁA: 5 · PRZYKŁAD: 2 · ZGADUJĘ: 4.

### 3. Hardcoded-value check

Clean. `node scripts/tokens-lint.mjs --all` reports no values outside `tokens.css` for the new
file.

No changes were made to the design system itself; gaps above are reported, not fixed.

## Cross-screen observation

The two test screens together show the design system is sufficient for an axis it was already
built for (stack-tag filtering, via `StackTagFilterComponent`, reused as-is for favorites) but not
for a new axis (status filtering for sessions): the "filter" idea exists only as one hardcoded
component, not as a documented, reusable pattern, so a second filter axis has to be copied by
hand. That is the single highest-value gap to close before a third filtered list is built.
