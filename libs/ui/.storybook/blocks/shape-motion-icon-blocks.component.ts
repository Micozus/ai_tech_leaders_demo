import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonComponent } from '../../src/lib/components/button/button.component';
import { resolveLengthPx } from './token-reader.helper';

interface RadiusRow {
  readonly token: string;
  readonly utility: string;
  readonly use: string;
}

const RADIUS_ROWS: readonly RadiusRow[] = [
  {
    token: '--radius-control',
    utility: 'rounded-control',
    use: 'Button, field, badge, avatar',
  },
  {
    token: '--radius-panel',
    utility: 'rounded-panel',
    use: 'Panel, alert, dialog',
  },
  {
    token: '--radius-overlay',
    utility: 'rounded-overlay',
    use: 'Menu, popover',
  },
];

/** Radius scale and the single overlay shadow. */
@Component({
  selector: 'ui-doc-shape-depth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-panel-roomy p-panel-roomy">
      <section>
        <h3 class="mb-group text-section-title">
          Radius (proposal, no reference: A01 forbids pills)
        </h3>
        <div class="flex flex-wrap gap-groups">
          @for (row of radii; track row.token) {
            <div class="w-48">
              <div
                class="mb-group h-control-md border border-solid border-border-control bg-surface"
                [style.border-radius]="'var(' + row.token + ')'"
              ></div>
              <p class="font-mono text-code">{{ row.utility }}</p>
              <p class="text-meta text-muted">
                {{ px(row.token) }}px · {{ row.use }}
              </p>
            </div>
          }
        </div>
      </section>
      <section>
        <h3 class="mb-group text-section-title">Depth</h3>
        <div class="flex flex-wrap gap-groups">
          <div class="w-48">
            <div
              class="mb-group h-control-md rounded-panel border border-solid border-line bg-surface"
            ></div>
            <p class="font-mono text-code">border-line</p>
            <p class="text-meta text-muted">
              Panels, rows, cards: a 1px line, no shadow
            </p>
          </div>
          <div class="w-48">
            <div
              class="mb-group h-control-md rounded-overlay border border-solid border-line bg-surface shadow-overlay"
            ></div>
            <p class="font-mono text-code">shadow-overlay + border-line</p>
            <p class="text-meta text-muted">
              Dialog, menu, popover, toast only. Never the only separator (A01)
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class ShapeDepthComponent {
  protected readonly radii = RADIUS_ROWS;

  protected px(token: string): number {
    return Math.round(resolveLengthPx('borderRadius', token));
  }
}

/** Motion tokens with a real button to feel the 130 ms feedback. */
@Component({
  selector: 'ui-doc-motion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    <div class="grid gap-groups p-panel-roomy">
      <table class="w-full border-collapse text-body">
        <thead>
          <tr class="text-left text-label text-muted">
            <th class="py-group pr-groups">Token</th>
            <th class="py-group pr-groups">Value</th>
            <th class="py-group pr-groups">Use for</th>
            <th class="py-group">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t border-solid border-line align-top">
            <td class="py-group pr-groups font-mono text-code">
              duration-fast
            </td>
            <td class="py-group pr-groups font-mono text-code">130ms</td>
            <td class="py-group pr-groups">
              Colour and border change on hover, focus, press
            </td>
            <td class="py-group text-muted">R02.3</td>
          </tr>
          <tr class="border-t border-solid border-line align-top">
            <td class="py-group pr-groups font-mono text-code">
              duration-base
            </td>
            <td class="py-group pr-groups font-mono text-code">150ms</td>
            <td class="py-group pr-groups">Opening a dialog, menu or toast</td>
            <td class="py-group text-muted">R02.3</td>
          </tr>
          <tr class="border-t border-solid border-line align-top">
            <td class="py-group pr-groups font-mono text-code">
              ease-standard
            </td>
            <td class="py-group pr-groups font-mono text-code">
              cubic-bezier(0.2, 0, 0, 1)
            </td>
            <td class="py-group pr-groups">Every transition</td>
            <td class="py-group text-muted">proposal</td>
          </tr>
        </tbody>
      </table>
      <p class="text-body">
        <strong>prefers-reduced-motion:</strong> transitions and animations
        shrink to 0.01ms and run once (<span class="font-mono text-code"
          >base.css</span
        >). No animation carries meaning that is not also in text (WCAG 2.3.3).
      </p>
      <div class="flex items-center gap-groups">
        <button ui-button (click)="toggle()">Toggle the state</button>
        <p class="text-body" role="status">State: {{ on() ? 'on' : 'off' }}</p>
      </div>
    </div>
  `,
})
export class MotionComponent {
  protected readonly on = signal(false);

  protected toggle(): void {
    this.on.update((value) => !value);
  }
}

interface IconRow {
  readonly icon: string;
  readonly use: string;
}

const ICON_ROWS: readonly IconRow[] = [
  { icon: 'pi-github', use: 'Sign in with GitHub (E01-S01)' },
  { icon: 'pi-sign-out', use: 'Sign out' },
  { icon: 'pi-user', use: 'Account menu' },
  { icon: 'pi-link', use: 'Public-work link, share link (E02-S02)' },
  { icon: 'pi-copy', use: 'Copy the share link' },
  { icon: 'pi-calendar', use: 'Slot date (E02-S03, E03-S02)' },
  { icon: 'pi-clock', use: 'Session length, 25 or 50 minutes' },
  { icon: 'pi-credit-card', use: 'Payment (E03-S03)' },
  { icon: 'pi-check', use: 'Done, selected' },
  { icon: 'pi-info-circle', use: 'Information' },
  {
    icon: 'pi-exclamation-triangle',
    use: 'Warning, error with a word next to it',
  },
  { icon: 'pi-times', use: 'Close, clear a filter' },
  { icon: 'pi-chevron-down', use: 'Open a menu or select' },
  { icon: 'pi-lock', use: 'No access (E01-S03)' },
];

/** The icon set in use, at both sizes. */
@Component({
  selector: 'ui-doc-icons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-panel-roomy">
      <table class="w-full border-collapse text-body">
        <thead>
          <tr class="text-left text-label text-muted">
            <th class="py-group pr-groups">Icon</th>
            <th class="py-group pr-groups">Class</th>
            <th class="py-group">Used for</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.icon) {
            <tr class="border-t border-solid border-line align-top">
              <td class="py-group pr-groups">
                <i
                  [class]="'pi text-section-title ' + row.icon"
                  aria-hidden="true"
                ></i>
              </td>
              <td class="py-group pr-groups font-mono text-code">
                {{ row.icon }}
              </td>
              <td class="py-group">{{ row.use }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class IconsComponent {
  protected readonly rows = ICON_ROWS;
}
