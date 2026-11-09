#!/usr/bin/env node
/**
 * Finds values that must come from design tokens and exits non-zero when it finds one:
 *   1. colour literals (hex, rgb(), hsl(), hwb(), lab(), lch(), oklab(), oklch(), color()),
 *   2. Tailwind palette classes (bg-zinc-900, text-white, text-neutral-500, border-accent-300…),
 *      so templates use roles (text-muted, bg-surface) and never a scale step or a raw palette,
 *   3. Tailwind arbitrary values (p-[13px], w-[calc(…)], grid-cols-[…]).
 * The one file allowed to hold raw values is libs/ui/src/lib/styles/tokens.css.
 * Add to CI: `npm run tokens:lint` (design system) or `npm run tokens:lint -- --all` (also the app). Decisions: lekcja-06/tokeny.md, rule 3 of the design-system brief.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

// The design system is checked by default; `--all` also checks the application (apps/shell).
const ROOTS = ['libs/ui/src', 'libs/ui/.storybook', 'libs/form-engine/src'];
if (process.argv.includes('--all')) ROOTS.push('apps/shell/src');
const EXTENSIONS = new Set(['.ts', '.html', '.scss', '.css', '.mdx']);
const TOKENS_FILE = join('libs', 'ui', 'src', 'lib', 'styles', 'tokens.css');
const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', '.angular']);

const PALETTES =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|accent|mint';
const UTILITIES =
  'bg|text|border|border-[trblxy]|ring|ring-offset|outline|divide|from|via|to|fill|stroke|shadow|decoration|accent|caret|placeholder';

const RULES = [
  {
    id: 'color-literal',
    pattern:
      /#[0-9a-fA-F]{3,8}\b(?![\w-])|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(|\bcolor\(\s*(?:srgb|display-p3|xyz)/g,
  },
  {
    id: 'palette-class',
    pattern: new RegExp(
      `(?<![\\w-])(?:[a-z-]+:)*(?:${UTILITIES})-(?:(?:${PALETTES})-\\d{2,3}|white|black)(?![\\w-])`,
      'g',
    ),
  },
  {
    id: 'arbitrary-value',
    pattern: /(?<![\w-])(?:[a-z-]+:)*-?[a-z][\w-]*-\[(?!var\(--)[^\]\s]+\]/g,
  },
];

function* walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (SKIP_DIRS.has(entry)) continue;
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

const isSource = (path) =>
  EXTENSIONS.has(path.slice(path.lastIndexOf('.'))) &&
  !/\.(spec|test)\.ts$/.test(path) &&
  path !== TOKENS_FILE;

const findings = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (!isSource(file)) continue;
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((text, index) => {
      for (const { id, pattern } of RULES) {
        for (const match of text.matchAll(pattern)) {
          findings.push(
            `${relative('.', file).split(sep).join('/')}:${index + 1}  ${id}  ${match[0]}`,
          );
        }
      }
    });
  }
}

if (findings.length === 0) {
  console.log('tokens:lint: no values outside tokens.css.');
} else {
  console.error(findings.join('\n'));
  console.error(
    `\ntokens:lint: ${findings.length} value(s) outside tokens. Use a semantic token (see Foundations in Storybook).`,
  );
  process.exit(1);
}
