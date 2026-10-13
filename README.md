# Angular Nx Monorepo

Angular 21 + Nx 22 workspace with NgRx, PrimeNG, Vitest, Playwright and Storybook. See [AGENTS.md](AGENTS.md) for architecture and conventions.

| Project       | Path               | Role                                  |
| ------------- | ------------------ | ------------------------------------- |
| `shell`       | `apps/shell`       | Application (routing, NgRx, API)      |
| `shell-e2e`   | `apps/shell-e2e`   | Playwright tests                      |
| `ui`          | `libs/ui`          | Generic visual components + Storybook |
| `form-engine` | `libs/form-engine` | Config-driven form renderer           |

The sample `tasks` feature shows component → ViewModel service → NgRx → API abstraction (`TasksApi`, in-memory by default).

## Commands

```sh
npm install
npm start            # dev server on 0.0.0.0:3000
npm run build
npm run lint
npm test
npm run e2e          # first run: npx playwright install chromium
npm run storybook    # ui library stories on :6006
```
