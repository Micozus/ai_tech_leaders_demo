import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Page title block: optional eyebrow, heading, optional description, projected actions. */
@Component({
  selector: 'ui-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="mb-6 flex flex-wrap items-end justify-between gap-5">
      <div>
        @if (eyebrow(); as text) {
          <p class="text-xs font-bold tracking-tight text-accent">{{ text }}</p>
        }
        <h1 class="text-xl font-extrabold tracking-tighter">{{ heading() }}</h1>
        @if (description(); as text) {
          <p class="mt-2 text-sm text-muted">{{ text }}</p>
        }
      </div>
      <div class="flex flex-wrap items-center gap-2"><ng-content /></div>
    </header>
  `,
})
export class PageHeaderComponent {
  readonly heading = input.required<string>();
  readonly eyebrow = input('');
  readonly description = input('');
}
