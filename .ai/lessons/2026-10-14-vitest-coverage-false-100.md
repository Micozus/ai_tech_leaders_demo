# Vitest reports unimported files as 100% covered

Context: adding a 100% coverage gate to the Analog/Vitest projects.

Root cause: with `@analogjs/vite-plugin-angular`, source files that are not part of the spec TypeScript program (`tsconfig.spec.json` only listed `*.spec.ts`) are compiled to empty modules. They show 0 statements, so coverage is 100% for a file that has no test at all. `coverage.include` alone does not fix it, and both v8 and istanbul behaved the same.

Fix / rule: `tsconfig.spec.json` includes `src/**/*.ts`, and each project has `src/coverage-guard.spec.ts` that eagerly `import.meta.glob`s every source module. Keep both. Verify the gate after touching coverage config by adding a temporary untested file and checking that `npm run test:coverage` fails.
