import { ChangeDetectionStrategy, Component } from '@angular/core';
import { contrastRatio, rawToken, resolveColor } from './token-reader.helper';

interface RoleRow {
  readonly token: string;
  readonly use: string;
  readonly avoid: string;
  readonly source: string;
}

interface RoleGroup {
  readonly title: string;
  readonly rows: readonly RoleRow[];
}

const ROLE_GROUPS: readonly RoleGroup[] = [
  {
    title: 'Surfaces',
    rows: [
      {
        token: '--color-canvas',
        use: 'Page background',
        avoid: 'Inside panels',
        source: 'R01.3',
      },
      {
        token: '--color-surface',
        use: 'Panel, row, field background',
        avoid: 'Inside another panel (A01: no card in card)',
        source: 'R01.1, A01',
      },
      {
        token: '--color-surface-muted',
        use: 'Row hover, section background, neutral badge',
        avoid: 'Page background',
        source: 'R01.1, P10',
      },
      {
        token: '--color-inverse',
        use: 'Reserved: inverse surface',
        avoid: 'Hero panels or decoration',
        source: 'proposal',
      },
    ],
  },
  {
    title: 'Text and lines',
    rows: [
      {
        token: '--color-ink',
        use: 'Primary text',
        avoid: 'Decoration',
        source: 'R01.3',
      },
      {
        token: '--color-muted',
        use: 'Metadata, hints, secondary text',
        avoid: 'Main content',
        source: 'R01.3',
      },
      {
        token: '--color-line',
        use: '1px line between rows',
        avoid: 'The only boundary of a field or button (1.35:1)',
        source: 'R01.1',
      },
      {
        token: '--color-border-control',
        use: 'Border of a field, select, checkbox',
        avoid: 'Text',
        source: 'WCAG 1.4.11',
      },
    ],
  },
  {
    title: 'Action and focus',
    rows: [
      {
        token: '--color-accent',
        use: 'The main action of a screen area, links',
        avoid: 'Decoration, gradients (A01)',
        source: 'R01.3 (provisional value)',
      },
      {
        token: '--color-accent-strong',
        use: 'Hover of the main action',
        avoid: 'Resting state',
        source: 'existing',
      },
      {
        token: '--color-accent-tint',
        use: 'Selected row, active item',
        avoid: 'Page background',
        source: 'existing',
      },
      {
        token: '--color-focus',
        use: 'Focus ring (3px)',
        avoid: 'Anything else',
        source: 'WCAG 2.4.7, 1.4.11',
      },
    ],
  },
  {
    title: 'Status',
    rows: [
      {
        token: '--color-success',
        use: 'Success text and icon, with a word',
        avoid: 'Colour as the only signal',
        source: 'WCAG 1.4.1',
      },
      {
        token: '--color-danger',
        use: 'Error text, destructive action',
        avoid: 'Decoration',
        source: 'WCAG 1.4.1',
      },
      {
        token: '--color-warning',
        use: 'Warning text (amber-800)',
        avoid: 'amber-600 as text (4.38:1)',
        source: 'WCAG 1.4.3',
      },
    ],
  },
];

/** Colour roles with a live swatch, what they are for and what they are not for. */
@Component({
  selector: 'ui-doc-color-roles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-panel-roomy p-panel-roomy">
      @for (group of groups; track group.title) {
        <section>
          <h3 class="mb-group text-section-title">{{ group.title }}</h3>
          <table class="w-full border-collapse text-body">
            <thead>
              <tr class="text-left text-label text-muted">
                <th class="py-group pr-groups">Swatch</th>
                <th class="py-group pr-groups">Token</th>
                <th class="py-group pr-groups">Value</th>
                <th class="py-group pr-groups">Use for</th>
                <th class="py-group pr-groups">Do not use for</th>
                <th class="py-group">Source</th>
              </tr>
            </thead>
            <tbody>
              @for (row of group.rows; track row.token) {
                <tr class="border-t border-solid border-line align-top">
                  <td class="py-group pr-groups">
                    <span
                      class="block size-control-sm rounded-control border border-solid border-line"
                      [style.background]="'var(' + row.token + ')'"
                    ></span>
                  </td>
                  <td class="py-group pr-groups font-mono text-code">
                    {{ row.token }}
                  </td>
                  <td class="py-group pr-groups font-mono text-code">
                    {{ value(row.token) }}
                  </td>
                  <td class="py-group pr-groups">{{ row.use }}</td>
                  <td class="py-group pr-groups">{{ row.avoid }}</td>
                  <td class="py-group text-muted">{{ row.source }}</td>
                </tr>
              }
            </tbody>
          </table>
        </section>
      }
    </div>
  `,
})
export class ColorRolesComponent {
  protected readonly groups = ROLE_GROUPS;

  protected value(token: string): string {
    const [r, g, b] = resolveColor(token);
    const hex = [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
    return rawToken(token) ? `#${hex}` : '';
  }
}

interface ContrastPair {
  readonly label: string;
  readonly foreground: string;
  readonly background: string;
  /** 4.5 for text, 3 for interface elements. */
  readonly threshold: 4.5 | 3;
  readonly note: string;
}

const CONTRAST_PAIRS: readonly ContrastPair[] = [
  {
    label: 'Primary text on canvas',
    foreground: '--color-ink',
    background: '--color-canvas',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Primary text on surface',
    foreground: '--color-ink',
    background: '--color-surface',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Primary text on muted surface',
    foreground: '--color-ink',
    background: '--color-surface-muted',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Muted text on canvas',
    foreground: '--color-muted',
    background: '--color-canvas',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Muted text on surface',
    foreground: '--color-muted',
    background: '--color-surface',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Muted text on muted surface',
    foreground: '--color-muted',
    background: '--color-surface-muted',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Text on the main action',
    foreground: '--color-on-accent',
    background: '--color-accent',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Text on the main action, hover',
    foreground: '--color-on-accent',
    background: '--color-accent-strong',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Link on surface',
    foreground: '--color-accent',
    background: '--color-surface',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Link on canvas',
    foreground: '--color-accent',
    background: '--color-canvas',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Accent badge text',
    foreground: '--color-accent-strong',
    background: '--color-accent-tint',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Success text on its tint',
    foreground: '--color-success',
    background: '--color-success-tint',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Danger text on surface',
    foreground: '--color-danger',
    background: '--color-surface',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Danger text on its tint',
    foreground: '--color-danger',
    background: '--color-danger-tint',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Warning text on its tint',
    foreground: '--color-warning',
    background: '--color-warning-tint',
    threshold: 4.5,
    note: '',
  },
  {
    label: 'Amber 600 as text on surface',
    foreground: '--color-amber-600',
    background: '--color-surface',
    threshold: 4.5,
    note: 'Fails: icon only, never text',
  },
  {
    label: 'Field border on surface',
    foreground: '--color-border-control',
    background: '--color-surface',
    threshold: 3,
    note: 'Interface element',
  },
  {
    label: 'Field border on canvas',
    foreground: '--color-border-control',
    background: '--color-canvas',
    threshold: 3,
    note: 'Interface element',
  },
  {
    label: 'Field border on muted surface',
    foreground: '--color-border-control',
    background: '--color-surface-muted',
    threshold: 3,
    note: 'Interface element',
  },
  {
    label: 'Focus ring on surface',
    foreground: '--color-focus',
    background: '--color-surface',
    threshold: 3,
    note: 'Interface element',
  },
  {
    label: 'Focus ring on canvas',
    foreground: '--color-focus',
    background: '--color-canvas',
    threshold: 3,
    note: 'Interface element',
  },
  {
    label: 'Main action fill on surface',
    foreground: '--color-accent',
    background: '--color-surface',
    threshold: 3,
    note: 'Interface element',
  },
  {
    label: 'Row line on canvas',
    foreground: '--color-line',
    background: '--color-canvas',
    threshold: 3,
    note: 'Decorative separator, exempt: never the only boundary of a control',
  },
];

interface MeasuredPair extends ContrastPair {
  readonly ratio: number;
  readonly passes: boolean;
}

/** Every text/background and interface pair we use, measured from the live tokens. */
@Component({
  selector: 'ui-doc-contrast-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-panel-roomy">
      <table class="w-full border-collapse text-body">
        <caption class="mb-group text-left text-muted">
          Measured from the live token values (WCAG 2.x contrast). Text needs
          4.5:1, interface elements 3:1.
        </caption>
        <thead>
          <tr class="text-left text-label text-muted">
            <th class="py-group pr-groups">Pair</th>
            <th class="py-group pr-groups">Sample</th>
            <th class="py-group pr-groups">Ratio</th>
            <th class="py-group pr-groups">Needs</th>
            <th class="py-group pr-groups">Result</th>
            <th class="py-group">Note</th>
          </tr>
        </thead>
        <tbody>
          @for (pair of pairs; track pair.label) {
            <tr class="border-t border-solid border-line align-top">
              <td class="py-group pr-groups">{{ pair.label }}</td>
              <td class="py-group pr-groups">
                <span
                  class="flex size-control-sm items-center justify-center rounded-control border border-solid border-line"
                  [style.background]="'var(' + pair.background + ')'"
                  aria-hidden="true"
                >
                  <span
                    class="block size-3 rounded-control"
                    [style.background]="'var(' + pair.foreground + ')'"
                  ></span>
                </span>
              </td>
              <td class="py-group pr-groups font-mono text-code">
                {{ pair.ratio.toFixed(2) }}:1
              </td>
              <td class="py-group pr-groups font-mono text-code">
                {{ pair.threshold }}:1
              </td>
              <td class="py-group pr-groups font-bold">
                {{ pair.passes ? 'Pass' : 'Fail' }}
              </td>
              <td class="py-group text-muted">{{ pair.note }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class ContrastTableComponent {
  protected readonly pairs: readonly MeasuredPair[] = CONTRAST_PAIRS.map(
    (pair) => {
      const ratio = contrastRatio(
        resolveColor(pair.foreground),
        resolveColor(pair.background),
      );
      return { ...pair, ratio, passes: ratio >= pair.threshold };
    },
  );
}
