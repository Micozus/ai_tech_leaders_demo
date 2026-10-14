import { defineConfig } from 'vitest/config';

/** Black-box suite: boots the built server against a throwaway PostgreSQL and drives it with agent-browser. */
export default defineConfig({
  root: import.meta.dirname,
  test: {
    name: 'shell-integration',
    environment: 'node',
    globals: true,
    include: ['src/**/*.integration.spec.ts'],
    globalSetup: ['src/support/global-setup.ts'],
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 180_000,
    reporters: ['default'],
  },
});
