#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isAgentBrowserHealthy,
  isChromiumInstalled,
  isHuskyInstalled,
  needsDependencyInstall,
  playwrightCacheDir,
} from './setup.helper.mjs';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const onWindows = process.platform === 'win32';

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: onWindows,
  });
  return result.status ?? 1;
}

function probe(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'ignore',
    shell: onWindows,
  });
  return result.status ?? 1;
}

function step(label, isDone, doIt) {
  if (isDone()) {
    console.log(`skip  — ${label}: already done`);
    return true;
  }
  console.log(`run   — ${label}`);
  return doIt();
}

function main() {
  const dependenciesReady = step(
    'install dependencies',
    () => !needsDependencyInstall(rootDir),
    () => run('npm', ['install']) === 0,
  );
  if (!dependenciesReady) {
    console.error(
      '✖ npm install failed — fix the error above, then re-run `npm run setup`.',
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    isHuskyInstalled(rootDir)
      ? "skip  — git hooks: already installed (via npm install's prepare script)"
      : 'note  — git hooks were not found after npm install; re-run `npm install` manually if hooks misbehave',
  );

  step(
    'install the agent-browser runtime (needed for npm run integration)',
    () =>
      isAgentBrowserHealthy(
        probe('npx', ['agent-browser', 'doctor', '--json']),
      ),
    () => {
      const status = run('npx', ['agent-browser', 'install', '--with-deps']);
      if (status !== 0) {
        console.warn(
          '⚠ agent-browser install failed (Docker/root access may be unavailable here) — ' +
            'run `npx agent-browser install --with-deps` manually before `npm run integration`.',
        );
      }
      return true;
    },
  );

  step(
    'install the Playwright Chromium browser (needed for npm run e2e)',
    () => isChromiumInstalled(playwrightCacheDir()),
    () => {
      const status = run('npx', ['playwright', 'install', 'chromium']);
      if (status !== 0) {
        console.warn(
          '⚠ Playwright browser install failed — run `npx playwright install chromium` ' +
            'manually before `npm run e2e`.',
        );
      }
      return true;
    },
  );

  console.log('\n✔ Setup complete. Run `npm start` to launch the dev server.');
}

main();
