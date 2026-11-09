/** Docs-only helpers: read live token values from the CSS cascade and measure contrast (WCAG 2.x). */

/** Resolves a colour token (a `var(--…)` name) to an `[r, g, b]` triple by letting the browser compute it. */
export function resolveColor(token: string): [number, number, number] {
  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const channels = computed
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number) ?? [0, 0, 0];
  return [channels[0], channels[1], channels[2]];
}

function channelLuminance(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function luminance([r, g, b]: [number, number, number]): number {
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

export function contrastRatio(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Computed length of a spacing/radius token in px. */
export function resolveLengthPx(
  property: 'width' | 'borderRadius',
  token: string,
): number {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  if (property === 'width') probe.style.width = `var(${token})`;
  else probe.style.borderTopLeftRadius = `var(${token})`;
  document.body.appendChild(probe);
  const style = getComputedStyle(probe);
  const value = parseFloat(
    property === 'width' ? style.width : style.borderTopLeftRadius,
  );
  probe.remove();
  return value;
}

export function rawToken(token: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
}
