import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Page title block: optional eyebrow, heading, optional description, projected actions. */
@Component({
  selector: 'ui-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="mb-panel-roomy flex flex-wrap items-end justify-between gap-panel-roomy"
    >
      <div>
        @if (eyebrow(); as text) {
          <p class="text-label text-accent">{{ text }}</p>
        }
        <h1 class="text-page-title">{{ heading() }}</h1>
        @if (description(); as text) {
          <p class="mt-group text-body text-muted">{{ text }}</p>
        }
      </div>
      <div class="flex flex-wrap items-center gap-group"><ng-content /></div>
    </header>
  `,
})
export class PageHeaderComponent {
  readonly heading = input.required<string>();
  readonly eyebrow = input('');
  readonly description = input('');
}
