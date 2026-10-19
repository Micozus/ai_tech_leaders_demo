import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The shared "nothing here yet" block: heading, optional explanation, projected actions. */
@Component({
  selector: 'ui-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="rounded-lg border border-dashed border-neutral-300 bg-surface px-6 py-14 text-center"
    >
      <h3 class="mb-1.5 text-lg font-bold tracking-tight">{{ heading() }}</h3>
      @if (description(); as text) {
        <p class="mb-4 text-sm text-muted">{{ text }}</p>
      }
      <div class="flex flex-wrap justify-center gap-2"><ng-content /></div>
    </section>
  `,
})
export class EmptyStateComponent {
  readonly heading = input.required<string>();
  readonly description = input('');
}
