/// <reference types='vitest' />
// Navigation tests for the prototype. Not part of the repo-wide test run (no `vite.config` name on purpose):
//   npx vitest run -c .ai/prototypes/konta-i-role/nav.vitest.mts
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/prototypes/konta-i-role',
  plugins: [angular({ tsconfig: 'tsconfig.spec.json' }), nxViteTsPaths()],
  test: {
    name: 'konta-i-role',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
  },
});
