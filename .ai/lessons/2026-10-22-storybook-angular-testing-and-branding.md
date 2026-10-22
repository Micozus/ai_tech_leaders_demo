# Storybook 10 on Angular: testing stories and branding

Context: building the design-system Storybook in `libs/ui` (`@storybook/angular` 10.2.4, Node 24).

- `@storybook/addon-vitest` needs a Vite-based framework; `@storybook/angular` is webpack, so stories cannot run as Vitest tests.
- `@storybook/test-runner` 0.26 renders stories, but **any** `.storybook/test-runner.(js|ts)` config makes Jest fail with `module.register() is not supported in Jest` on Node 24. Without a config file it works but has no axe. We use `scripts/storybook-test.mjs` (Playwright + `axe-playwright`) instead: it serves `dist/storybook/ui`, hooks the preview channel for `storyRendered` and failure events, then runs axe. Retry axe while the a11y addon's own run is active ("Axe is already running").
- `addon-docs` 10 does not bundle `remark-gfm`: without it MDX tables render as raw pipes. Add `remark-gfm` through `mdxPluginOptions`.
- Storybook's tab title (`… ⋅ Storybook`) and an sr-only `h1` say "Storybook". Override `document.title` with a property setter in `manager-head.html`. A `MutationObserver` that rewrites the title freezes the page (it ping-pongs with Storybook's own title sync).
- Disable the checklist and update notices with `features.sidebarOnboardingChecklist: false` and `core.disableWhatsNewNotifications`, `disableTelemetry`.
- `primeicons` 8 ships under the PrimeUI licence (licence key, eligibility limits); 7.0.0 is MIT. Pin `7.0.0` exactly.
- Docs-only Angular blocks live in `libs/ui/.storybook/blocks` and are shown through `!dev` stories embedded in MDX with `<Canvas of>`; their selectors still need the `ui` prefix for lint.
