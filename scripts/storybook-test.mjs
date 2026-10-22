#!/usr/bin/env node
/**
 * Runs every story as a test against the built Storybook (`npm run build-storybook` first):
 *   1. the story renders without an error and its `play` function (interaction test) passes,
 *   2. axe finds no accessibility violation in the story (WCAG 2.2 A and AA rules).
 * A story opts out of step 2 with `parameters.a11y.test = 'off'` and must say why in its docs.
 *
 * Why not @storybook/test-runner or the Vitest addon: the Vitest addon needs a Vite-based
 * framework (@storybook/angular is webpack), and the test-runner's Jest cannot load its config
 * on Node 24 (module.register). This script uses Playwright and axe directly.
 */
import { chromium } from '@playwright/test';
import { getViolations, injectAxe } from 'axe-playwright';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve('dist/storybook/ui');
const PORT = Number(process.env.STORYBOOK_TEST_PORT ?? 6007);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const RENDER_TIMEOUT_MS = 30_000;
const AXE_RETRIES = 20;
const AXE_RETRY_DELAY_MS = 250;
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
};

if (!existsSync(join(ROOT, 'index.json'))) {
  console.error(`No built Storybook at ${ROOT}. Run: npm run build-storybook`);
  process.exit(1);
}

const server = createServer((request, response) => {
  const path = normalize(
    decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname),
  );
  let file = join(ROOT, path);
  if (!file.startsWith(ROOT)) return response.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory())
    file = join(file, 'index.html');
  if (!existsSync(file)) return response.writeHead(404).end();
  response.writeHead(200, {
    'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
  });
  createReadStream(file).pipe(response);
});

/** Registered before the preview boots: records how the render ended. */
const HOOK = () => {
  window.__result = { done: false, error: null };
  const FAILURES = [
    'storyThrewException',
    'storyErrored',
    'storyMissing',
    'playFunctionThrewException',
  ];
  const timer = setInterval(() => {
    const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
    if (!channel) return;
    clearInterval(timer);
    channel.on('storyRendered', () => (window.__result.done = true));
    for (const name of FAILURES) {
      channel.on(name, (payload) => {
        window.__result.error = `${name}: ${payload?.message ?? JSON.stringify(payload)}`;
        window.__result.done = true;
      });
    }
  }, 5);
};

/** The a11y addon runs its own axe pass on render; axe allows one run at a time, so retry while it is busy. */
async function runAxe(page) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await getViolations(page, 'body', {
        runOnly: { type: 'tag', values: WCAG_TAGS },
      });
    } catch (error) {
      if (
        attempt >= AXE_RETRIES ||
        !String(error.message).includes('already running')
      )
        throw error;
      await page.waitForTimeout(AXE_RETRY_DELAY_MS);
    }
  }
}

async function runStory(browser, entry) {
  const page = await browser.newPage();
  try {
    await page.addInitScript(HOOK);
    await page.goto(`${ORIGIN}/iframe.html?id=${entry.id}&viewMode=story`);
    await page.waitForFunction(() => window.__result?.done, null, {
      timeout: RENDER_TIMEOUT_MS,
    });
    const { error } = await page.evaluate(() => window.__result);
    if (error) return [error];
    const optedOut = await page.evaluate(
      () =>
        window.__STORYBOOK_PREVIEW__?.currentRender?.story?.parameters?.a11y
          ?.test === 'off',
    );
    if (optedOut) return [];
    await injectAxe(page);
    const violations = await runAxe(page);
    return violations.map(
      (v) =>
        `a11y ${v.id} (${v.impact}): ${v.help} — ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
    );
  } catch (error) {
    return [`runner: ${error.message}`];
  } finally {
    await page.close();
  }
}

await new Promise((done) => server.listen(PORT, '127.0.0.1', done));
const index = JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter(
  (e) => e.type === 'story' && e.tags?.includes('test'),
);
const browser = await chromium.launch();
let failed = 0;
for (const entry of stories) {
  const problems = await runStory(browser, entry);
  console.log(
    `${problems.length === 0 ? 'PASS' : 'FAIL'}  ${entry.title} / ${entry.name}`,
  );
  for (const problem of problems) console.log(`      ${problem}`);
  if (problems.length > 0) failed += 1;
}
await browser.close();
server.close();
console.log(
  `\n${stories.length - failed} of ${stories.length} stories passed.`,
);
process.exit(failed === 0 ? 0 : 1);
