import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The shared "this part could not load" block: what happened, what to do, projected actions
 * (usually a retry button). It replaces the content that failed and is announced as an alert.
 * An error that needs action is never a toast.
 */
@Component({
  selector: 'ui-error-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      role="alert"
      class="rounded-panel border border-solid border-danger-border bg-danger-tint px-panel-roomy py-panel-roomy"
    >
      <h3
        class="mb-group flex items-center gap-group text-section-title text-ink"
      >
        <i
          class="pi pi-exclamation-triangle text-danger"
          aria-hidden="true"
        ></i>
        {{ heading() }}
      </h3>
      @if (description(); as text) {
        <p class="mb-groups text-body text-ink">{{ text }}</p>
      }
      <div class="flex flex-wrap gap-group"><ng-content /></div>
    </section>
  `,
})
export class ErrorStateComponent {
  readonly heading = input.required<string>();
  readonly description = input('');
}
