import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  isAgentBrowserHealthy,
  isChromiumInstalled,
  isHuskyInstalled,
  needsDependencyInstall,
  playwrightCacheDir,
} from './setup.helper.mjs';

test('needsDependencyInstall: true when the npm marker file is missing', () => {
  const fs = {
    existsSync: (path) => !path.endsWith('.package-lock.json'),
    statSync: () => ({ mtimeMs: 0 }),
  };

  assert.equal(needsDependencyInstall('/repo', fs), true);
});

test('needsDependencyInstall: true when package-lock.json is missing', () => {
  const fs = {
    existsSync: (path) => path.endsWith('.package-lock.json'),
    statSync: () => ({ mtimeMs: 0 }),
  };

  assert.equal(needsDependencyInstall('/repo', fs), true);
});

test('needsDependencyInstall: true when the lockfile is newer than the installed marker', () => {
  const fs = {
    existsSync: () => true,
    statSync: (path) => ({
      mtimeMs: path.endsWith('.package-lock.json') ? 1 : 2,
    }),
  };

  assert.equal(needsDependencyInstall('/repo', fs), true);
});

test('needsDependencyInstall: false when the installed marker is at least as new as the lockfile', () => {
  const fs = {
    existsSync: () => true,
    statSync: (path) => ({
      mtimeMs: path.endsWith('.package-lock.json') ? 1 : 1,
    }),
  };

  assert.equal(needsDependencyInstall('/repo', fs), false);
});

test('isHuskyInstalled: true only once .husky/_/husky.sh exists', () => {
  assert.equal(isHuskyInstalled('/repo', { existsSync: () => true }), true);
  assert.equal(isHuskyInstalled('/repo', { existsSync: () => false }), false);
});

test('playwrightCacheDir: resolves per platform', () => {
  assert.equal(
    playwrightCacheDir('darwin', {}, '/home/dev'),
    '/home/dev/Library/Caches/ms-playwright',
  );
  assert.equal(
    playwrightCacheDir('win32', {}, '/home/dev'),
    '/home/dev/AppData/Local/ms-playwright',
  );
  assert.equal(
    playwrightCacheDir('linux', {}, '/home/dev'),
    '/home/dev/.cache/ms-playwright',
  );
  assert.equal(
    playwrightCacheDir(
      'linux',
      { XDG_CACHE_HOME: '/custom/cache' },
      '/home/dev',
    ),
    '/custom/cache/ms-playwright',
  );
});

test('isChromiumInstalled: false when the cache directory does not exist', () => {
  assert.equal(
    isChromiumInstalled('/cache', { existsSync: () => false }),
    false,
  );
});

test('isChromiumInstalled: false when the cache has no chromium build', () => {
  const fs = { existsSync: () => true, readdirSync: () => ['firefox-1234'] };

  assert.equal(isChromiumInstalled('/cache', fs), false);
});

test('isChromiumInstalled: true when a chromium build is cached', () => {
  const fs = { existsSync: () => true, readdirSync: () => ['chromium-1234'] };

  assert.equal(isChromiumInstalled('/cache', fs), true);
});

test('isAgentBrowserHealthy: true only on exit code 0', () => {
  assert.equal(isAgentBrowserHealthy(0), true);
  assert.equal(isAgentBrowserHealthy(1), false);
});
