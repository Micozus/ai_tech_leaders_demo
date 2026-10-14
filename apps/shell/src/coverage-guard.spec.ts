/**
 * Vitest reports a never-imported file as 100% covered (it has no measurable code),
 * so a feature shipped without a spec would slip past the 100% threshold.
 * Loading every source module here makes such a file show up as uncovered.
 */
const sourceModules = import.meta.glob(
  [
    './**/*.ts',
    '!./**/*.spec.ts',
    '!./**/*.d.ts',
    '!./main.ts',
    '!./main.server.ts',
    '!./server.ts',
    '!./test-setup.ts',
  ],
  { eager: true },
);

describe('coverage guard', () => {
  it('loads every source module', () => {
    expect(Object.keys(sourceModules).length).toBeGreaterThan(0);
  });
});
