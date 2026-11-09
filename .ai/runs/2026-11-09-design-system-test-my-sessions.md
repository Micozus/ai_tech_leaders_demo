# Run: design-system sufficiency test — "My sessions" with a status filter, 2026-11-09

Objective: build a mentee "My sessions" test screen (list filtered by status; states: loading,
empty, error, no-results-for-filter) using only existing design-system components, tokens and
patterns, to find out whether the design system is sufficient. Not a shipped screen.
Spec: none (design-system-sufficiency exercise, not a product feature).
Output: `libs/ui/src/screens/design-system-sufficiency-test-my-sessions.stories.ts`.

## Step 1 — decisions before writing code

| # | Decision | Tag | Source / note |
| - | -------- | --- | -------------- |
| 1 | Layout: `ui-app-header` + `ui-page-header` + `grid gap-panel-roomy md:grid-cols-4` (filter `md:col-span-1`, list `md:col-span-3`) | REGUŁA | copied from `mentor-list.component.ts` |
| 2 | One row: `ui-session-row` | REGUŁA | its own mdx: "Lists of sessions on the mentee and mentor homes" |
| 3 | Loading / error / ready via `ui-async-region` | REGUŁA | component doc: "Every list and detail in the product uses it" |
| 4 | Two distinct empty copies (nothing yet vs. nothing for the filter), computed from whether a filter is active | REGUŁA | identical logic already in `mentor-list.component.ts`'s `region()` |
| 5 | Status-filter markup (fieldset/legend, checkbox rows, selected chips, clear button) | PRZYKŁAD | copied by hand from `stack-tag-filter.component.ts`, which is hardcoded to `StackTag`; no generic filter-group component or rule exists |
| 6 | The 4 status values and their labels | ZGADUJĘ | duplicated the module-private `STATUS` map from `session-row.component.ts`; no exported `SessionStatus[]` list exists (unlike `STACK_TAGS` for mentors) |
| 7 | Spacing/typography tokens throughout | REGUŁA | existing token classes, used as documented |
| 8 | Error-state retry button left unwired | PRZYKŁAD | matches the existing `MySessionsError` story in `e03-booking.stories.ts`, which also leaves it unwired |
| 9 | Mobile: grid collapses to one column below `md:` | REGUŁA | same breakpoint already used by `MentorListComponent`; no separate design needed |
| 10 | Interface language: English | REGUŁA | `libs/ui/POSTEP.md`: "Product UI language and documentation language: English" |
| 11 | File placed in `libs/ui/src/screens/` under its own title, not merged into the existing `MySessions` story in `e03-booking.stories.ts` | ZGADUJĘ | no rule dictates where a sufficiency-test screen belongs; chosen to keep it clearly separate from shipped screens |

Counts: REGUŁA 7, PRZYKŁAD 2, ZGADUJĘ 2.

## Step 2 — build and check

- Built with: `ui-app-header`, `ui-page-header`, `ui-async-region`, `ui-session-row`, `label[ui-checkbox]`, `ui-badge`, `button[ui-button]`. No new reusable component created; the local `@Component` in the story file (`MySessionsComponent`) only holds the demo's local filter state (precedent: `libs/ui/src/patterns/slot-publication.stories.ts`).
- Hardcoded-value check: `node scripts/tokens-lint.mjs --all` → clean ("no values outside tokens.css"). No hex/rgb/hsl/oklch, no Tailwind palette classes, no arbitrary values in the new file.
- `npx nx lint ui`: pass (one pre-existing, unrelated warning in `skeleton.component.stories.ts`).
- `npx nx test ui --coverage`: 100% unchanged (story files are excluded from coverage).
- `npm run build-storybook`: pass.
- `node scripts/storybook-test.mjs --filter "My sessions"`: 7 of 7 new stories pass (render, `play`, axe WCAG 2.2 A/AA).
- Full `npm run test-storybook` run across all stories: see the sibling run log / chat summary for the combined result with the favorite-mentors screen.

## Result

### 1. Gaps, grouped

- **Missing component:** no generic "filter by an arbitrary set of values" component. `StackTagFilterComponent` is the only existing filter and is hardcoded to `StackTag`. I guessed its exact markup generalizes to `SessionStatus` and reproduced it by hand. **To add:** either a generic `ui-filter-group<T>` (values, selected, label-fn) or a written rule describing how to build a one-off filter for a new axis, so the next agent does not have to copy markup.
- **Missing rule / model gap:** no exported list of `SessionStatus` values (unlike `STACK_TAGS`) and no exported status→label (or status→tone) map — `session-row.component.ts` keeps one, but it is module-private. I guessed its 4 labels are canonical and duplicated them. **To add:** export `SESSION_STATUSES` and a status→label (and status→badge-tone) map from `product.model.ts`, so every consumer (this screen, any future one) shares one source instead of copying it.
- **Missing state:** none. All four required states (loading, empty, error, no-results-for-filter) were buildable from existing primitives (`ui-async-region` already distinguishes "nothing yet" from a filtered-empty result, once the caller computes which one applies).
- **Unclear or conflicting documentation:** none found.

### 2. Decision counts

REGUŁA: 7 · PRZYKŁAD: 2 · ZGADUJĘ: 2.

### 3. Hardcoded-value check

Clean. `node scripts/tokens-lint.mjs --all` reports no values outside `tokens.css` for the new file (and the rest of the design system and app, after the unrelated `text-slate-500` fix landed separately).

No changes were made to the design system itself; gaps above are reported, not fixed.
