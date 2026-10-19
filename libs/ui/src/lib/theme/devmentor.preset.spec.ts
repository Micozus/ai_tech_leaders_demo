import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEVMENTOR_PRESET } from './devmentor.preset';

const TOKENS_CSS = readFileSync(
  resolve(import.meta.dirname, '../styles/tokens.css'),
  'utf8',
);

function collectVarReferences(value: unknown): string[] {
  if (typeof value === 'string') {
    return Array.from(value.matchAll(/var\((--[\w-]+)\)/g), (m) => m[1]);
  }
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectVarReferences);
  }
  return [];
}

describe('DEVMENTOR_PRESET', () => {
  it('maps the primary palette onto the accent scale', () => {
    expect(DEVMENTOR_PRESET.semantic?.primary).toMatchObject({
      500: 'var(--color-accent-500)',
      600: 'var(--color-accent-600)',
    });
  });

  it('maps the radius scale onto the radius tokens', () => {
    expect(DEVMENTOR_PRESET.primitive?.borderRadius).toMatchObject({
      md: 'var(--radius-md)',
      xl: 'var(--radius-xl)',
    });
  });

  it('only references tokens that tokens.css declares', () => {
    const references = collectVarReferences([
      DEVMENTOR_PRESET.semantic,
      DEVMENTOR_PRESET.primitive,
    ]);

    expect(references.length).toBeGreaterThan(0);
    for (const name of references) {
      expect(TOKENS_CSS).toContain(`${name}:`);
    }
  });
});
