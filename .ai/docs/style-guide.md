# DevMentor style guide

Status: active · Applies to: `libs/ui`, `apps/shell` · Source of the visual language: the clickable concept prototype (`devmentor-prototype`, Oct 2026) — **visual layer only**; its product scope is not a decision (see "What the prototype does not decide").

Browse it live: `npm run storybook` → *Foundations / Design tokens* and the `UI/*` stories.

## 1. Tokens — one source of truth

All visual values are declared once, in [`libs/ui/src/lib/styles/tokens.css`](../../libs/ui/src/lib/styles/tokens.css), inside `@theme static`. Tailwind 4 turns each variable into a utility and keeps it as a runtime CSS custom property (`static` makes it always emitted, which the PrimeNG preset relies on). Nothing else may contain a hex colour, radius or shadow literal.

| Namespace | Tokens | Utilities |
| --- | --- | --- |
| `--color-accent-50…900` | brand violet scale (600 = brand) | `bg-accent-100`, `text-accent-800` |
| `--color-neutral-50…950` | blue-grey scale | `bg-neutral-100` |
| `--color-mint-300`, `green/red/amber-*` | accents and status tints | `text-green-800` |
| **Semantic roles** | `ink`, `muted`, `subtle`, `line`, `canvas`, `surface`, `inverse`, `on-inverse`, `accent`, `accent-strong`, `accent-tint`, `on-accent`, `success`/`danger`/`warning` (+ `-tint`), `focus` | `text-ink`, `bg-surface`, `border-line`, `bg-accent` |
| `--font-sans` | Inter, system fallbacks | `font-sans` |
| `--text-xs…2xl` (+ `--line-height`) | 12, 14, 16, 19, 27, 46 px | `text-sm`, `text-xl` |
| `--tracking-*` | `tight`, `tighter`, `display` | `tracking-tight` |
| `--radius-sm…2xl` | 8, 11, 15, 18, 25 px | `rounded-md`, `rounded-xl` |
| `--shadow-*` | `card`, `float`, `toast`, `dialog` | `shadow-card` |
| `--ease-*`, `--duration-*` | `standard`; `fast` 130 ms, `base` 150 ms | `ease-standard`, `duration-fast` |
| `--breakpoint-sm/md/lg` | 640, 760, 1020 px | `md:grid-cols-2` |
| `--container-page` | 1200 px | `max-w-page` |
| `--z-sticky/overlay/toast` | 40, 80, 100 (plain `:root`, Tailwind has no z namespace) | `z-(--z-overlay)` |

Spacing uses Tailwind's default 4 px scale; the prototype's 7/9/13 px gaps round to it.

### Rules

1. **Use roles, not scales, in templates** (`text-muted`, not `text-neutral-500`). Reach for a scale step only for a tint no role covers.
2. **A new colour is a token first.** Add it to `tokens.css`, then use the utility. A literal in a template or SCSS file is a review blocker.
3. **Retune in one place.** The PrimeNG preset ([`devmentor.preset.ts`](../../libs/ui/src/lib/theme/devmentor.preset.ts)) points Aura's primary palette and radii at `var(--…)` references, and a spec fails if it references a token that does not exist.
4. **Tailwind first, BEM SCSS only for what utilities cannot express** (AGENTS.md). Variant class maps live in `*.model.ts` so Tailwind's scanner sees every class.
5. **Accessibility is part of the token set:** `--color-focus` drives a 3 px focus ring on `a`, `button`, `[tabindex]`; `prefers-reduced-motion` shortens transitions (`styles/base.css`).

### Wiring

- App: `apps/shell/src/styles.scss` `@use`s `tailwindcss`, `tokens.css` and `base.css`, and adds `@source` for `libs/ui` (Tailwind only scans the app root otherwise). `providePrimeNG` gets `DEVMENTOR_PRESET`.
- Storybook: `libs/ui/.storybook/styles.scss` is the same three lines for the lib; `libs/ui/.postcssrc.json` enables Tailwind there.

## 2. Base components (`libs/ui`)

| Component | Selector | Inputs | Notes |
| --- | --- | --- | --- |
| Button | `button[ui-button]`, `a[ui-button]` | `variant` primary/soft/quiet/danger/ghost, `size` md/sm, `block`, `loading` | Enhances the native element; `loading` sets `aria-busy` and shows a spinner |
| Badge | `ui-badge` | `tone` neutral/accent/success/warning/danger | stack tags, payout state |
| Avatar | `ui-avatar` | `name` (required), `size` sm/md/lg | initials, `role="img"` labelled with the name |
| Alert | `ui-alert` | `tone` info/success/danger | `danger` → `role="alert"`, else `status` |
| Spinner / Skeleton | `ui-spinner`, `ui-skeleton` | `width`, `height` | loading states |
| Empty state | `ui-empty-state` | `heading`, `description` | projected actions |
| Field | `ui-field` | `label`, `controlId`, `hint`, `error` | label + hint + announced error around one control |
| Page header | `ui-page-header` | `heading`, `eyebrow`, `description` | projected actions |
| Card | `ui-card` | `heading` | restyled with tokens |

Each has a spec (100 % coverage) and a Storybook story. `libs/ui/eslint.config.mjs` allows attribute selectors for components so native elements keep their semantics; attributes are kebab-case with the `ui` prefix.

Next, when a second feature needs them: `ui-field` wrapping PrimeNG `InputText`/`Select`, tabs, dialog and toast (theme the PrimeNG parts through the preset, do not restyle them with CSS).

## 3. What the prototype does not decide

The prototype's markup and CSS were mined for tokens and component shapes only. Its product behaviour **conflicts with the signed-off brief** and was not carried over:

| Prototype | Brief / specs |
| --- | --- |
| Ratings and reviews on mentors | N02: no ratings or reviews profile |
| Chat threads, video-room framing | N01: text-only sessions, no video; messaging is not in scope |
| Search with free-text, rating and availability filters | R13: list filtered by stack tag, no search, no ranking |
| Price for 25 min = 50 % of the 50-min rate; USD | R08: each mentor sets both prices; EUR (mentors-bookable spec) |
| 12 h free-cancellation window | R09: 24 h |
| Admin console with moderation queue | D19: the operator is two founders, no admin screens in 1.0 |
| Saved mentors | no story in the backlog |

Domain components (mentor card, slot picker, booking summary, chat bubble) are therefore not built here; they come with their feature stories.

## 4. Token provenance (prototype → token)

Prototype `--accent #6858ef` → `accent-600`; `--accentDark` → `accent-700`; `--accentTint` → `accent-100`; `--ink` → `neutral-900`; `--muted` → `neutral-500`; `--muted2` → `neutral-400`; `--line` → `neutral-200`; `--bg` → `neutral-50`; `--navy` → `neutral-950`; `--mint` → `mint-300`; `--green/--red/--amber` → `green-600/red-600/amber-600`; `--radius 18px` → `radius-xl`; `--shadow` → `shadow-card`. Near-duplicates in the prototype (a dozen greys within ±3 % lightness) were merged into the neutral scale.
