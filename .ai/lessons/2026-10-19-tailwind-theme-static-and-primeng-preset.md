# Tailwind 4 tokens shared with PrimeNG and attribute components

Context: moving design tokens into `libs/ui` and theming PrimeNG from them.

- Tailwind 4 only emits `@theme` variables that a utility uses. A PrimeNG preset that references `var(--color-accent-500)` needs them always: declare `@theme static`.
- Tailwind scans from the app root; utilities used only inside `libs/ui` inline templates are missing unless the app stylesheet has `@source '../../../libs/ui/src'`. Storybook needs its own stylesheet plus a `.postcssrc.json` in `libs/ui`.
- In `@primeuix/themes`, `borderRadius` is a **primitive** token (`definePreset(..., { primitive: { borderRadius } })`); under `semantic` it fails the app build with TS2353 although Vitest passes (specs do not type-check).
- `@angular-eslint/component-selector` rejects `button[uiButton]`: type must allow `attribute`, and the style then applies to attributes too, so use kebab-case (`ui-button`).
- Prettier rewraps inline templates and can add whitespace around `{{ }}` in headings; assert with `textContent?.trim()`.
