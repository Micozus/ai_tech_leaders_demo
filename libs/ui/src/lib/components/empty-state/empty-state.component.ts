import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The shared "nothing here yet" block: heading, optional explanation, projected actions. */
@Component({
  selector: 'ui-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="rounded-panel border border-dashed border-border-control bg-surface px-panel-roomy py-section text-center"
    >
      <h3 class="mb-group text-section-title">{{ heading() }}</h3>
      @if (description(); as text) {
        <p class="mb-groups text-body text-muted">{{ text }}</p>
      }
      <div class="flex flex-wrap justify-center gap-group"><ng-content /></div>
    </section>
  `,
})
export class EmptyStateComponent {
  readonly heading = input.required<string>();
  readonly description = input('');
}
