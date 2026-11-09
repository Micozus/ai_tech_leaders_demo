import { ChangeDetectionStrategy, Component } from '@angular/core';
import { resolveLengthPx } from './token-reader.helper';

interface SpacingRow {
  readonly relation: string;
  readonly token: string;
  readonly utility: string;
  readonly use: string;
  readonly source: string;
}

const SPACING_ROWS: readonly SpacingRow[] = [
  {
    relation: 'Within a group',
    token: '--spacing-group',
    utility: 'gap-group',
    use: 'Label and field, tags in a row, buttons in a row',
    source: 'R01.1',
  },
  {
    relation: 'Between groups',
    token: '--spacing-groups',
    utility: 'gap-groups',
    use: 'Field groups inside one panel',
    source: 'R01.1',
  },
  {
    relation: 'Inside a dense panel or row',
    token: '--spacing-panel',
    utility: 'p-panel',
    use: 'Lists and data',
    source: 'P10',
  },
  {
    relation: 'Inside a roomy panel',
    token: '--spacing-panel-roomy',
    utility: 'p-panel-roomy',
    use: 'Sessions, forms, detail views',
    source: 'P10',
  },
  {
    relation: 'Between page sections',
    token: '--spacing-section',
    utility: 'my-section',
    use: 'Separate sections of a page',
    source: 'proposal',
  },
  {
    relation: 'List row, vertical',
    token: '--spacing-row-y',
    utility: 'py-row-y',
    use: 'Rows separated by a 1px line',
    source: 'R01.1',
  },
  {
    relation: 'List row, horizontal',
    token: '--spacing-row-x',
    utility: 'px-row-x',
    use: 'Rows separated by a 1px line',
    source: 'R01.1',
  },
];

/** Spacing relations with the bar drawn at the real token width. */
@Component({
  selector: 'ui-doc-spacing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-panel-roomy">
      <table class="w-full border-collapse text-body">
        <thead>
          <tr class="text-left text-label text-muted">
            <th class="py-group pr-groups">Relation</th>
            <th class="py-group pr-groups">Token</th>
            <th class="py-group pr-groups">Size</th>
            <th class="py-group pr-groups">Use for</th>
            <th class="py-group">Source</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.token) {
            <tr class="border-t border-solid border-line align-top">
              <td class="py-group pr-groups">{{ row.relation }}</td>
              <td class="py-group pr-groups font-mono text-code">
                {{ row.utility }}
              </td>
              <td class="py-group pr-groups">
                <span class="flex items-center gap-group">
                  <span
                    class="block h-3 rounded-control bg-accent"
                    [style.width]="'var(' + row.token + ')'"
                    aria-hidden="true"
                  ></span>
                  <span class="font-mono text-code">{{ px(row.token) }}px</span>
                </span>
              </td>
              <td class="py-group pr-groups">{{ row.use }}</td>
              <td class="py-group text-muted">{{ row.source }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class SpacingComponent {
  protected readonly rows = SPACING_ROWS;

  protected px(token: string): number {
    return Math.round(resolveLengthPx('width', token));
  }
}

interface LayoutRow {
  readonly width: string;
  readonly behaviour: string;
}

const LAYOUT_ROWS: readonly LayoutRow[] = [
  {
    width: '320 px',
    behaviour:
      'One column. Filters collapse above the list. Actions stack full width. Nothing scrolls sideways.',
  },
  {
    width: '768 px',
    behaviour:
      'Lists keep one column. Forms keep one column at the measure. Side panels move under the content.',
  },
  {
    width: '1440 px',
    behaviour:
      'Content is capped at the page width token; extra space stays empty. Detail views use a content column and one side column.',
  },
];

/** Layout widths and the content-width tokens. */
@Component({
  selector: 'ui-doc-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-groups p-panel-roomy">
      <table class="w-full border-collapse text-body">
        <thead>
          <tr class="text-left text-label text-muted">
            <th class="py-group pr-groups">Width</th>
            <th class="py-group">
              Behaviour (proposal, to be confirmed on real screens)
            </th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.width) {
            <tr class="border-t border-solid border-line align-top">
              <td class="py-group pr-groups font-mono text-code">
                {{ row.width }}
              </td>
              <td class="py-group">{{ row.behaviour }}</td>
            </tr>
          }
        </tbody>
      </table>
      <p class="text-body text-muted">
        Page width <span class="font-mono text-code">max-w-page</span> (75rem).
        Running text
        <span class="font-mono text-code">max-w-measure</span> (65ch).
      </p>
    </div>
  `,
})
export class LayoutComponent {
  protected readonly rows = LAYOUT_ROWS;
}
