import { existsSync, readdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * True when `npm install` is needed: npm's own installed-state marker
 * (`node_modules/.package-lock.json`) is missing, or `package-lock.json`
 * has been touched more recently than it.
 */
export function needsDependencyInstall(rootDir, fs = { existsSync, statSync }) {
  const lockPath = join(rootDir, 'package-lock.json');
  const markerPath = join(rootDir, 'node_modules', '.package-lock.json');
  if (!fs.existsSync(markerPath)) return true;
  if (!fs.existsSync(lockPath)) return true;
  return fs.statSync(lockPath).mtimeMs > fs.statSync(markerPath).mtimeMs;
}

/** True once `npm install`'s `prepare` script has installed the git hooks. */
export function isHuskyInstalled(rootDir, fs = { existsSync }) {
  return fs.existsSync(join(rootDir, '.husky', '_', 'husky.sh'));
}

/** Resolves the per-OS directory Playwright caches downloaded browsers in. */
export function playwrightCacheDir(
  platform = process.platform,
  env = process.env,
  home = homedir(),
) {
  if (platform === 'darwin') {
    return join(home, 'Library', 'Caches', 'ms-playwright');
  }
  if (platform === 'win32') {
    return join(home, 'AppData', 'Local', 'ms-playwright');
  }
  return join(env.XDG_CACHE_HOME || join(home, '.cache'), 'ms-playwright');
}

/** True when a Chromium build already sits in Playwright's browser cache. */
export function isChromiumInstalled(
  cacheDir,
  fs = { existsSync, readdirSync },
) {
  if (!fs.existsSync(cacheDir)) return false;
  return fs.readdirSync(cacheDir).some((name) => name.startsWith('chromium'));
}

/** True when `agent-browser doctor` reports a healthy, already-installed browser. */
export function isAgentBrowserHealthy(doctorExitCode) {
  return doctorExitCode === 0;
}
