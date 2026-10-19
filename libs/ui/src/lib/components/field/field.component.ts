import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Label, hint and error around one projected control. The control keeps its own `id`;
 * pass the same value as `controlId` so the label targets it. The error is announced
 * (`role="alert"`); the control should reference them through `aria-describedby`
 * using the ids `<controlId>-hint` and `<controlId>-error`.
 */
@Component({
  selector: 'ui-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-4 last:mb-0">
      <label
        class="mb-1.5 block text-xs font-bold text-neutral-700"
        [attr.for]="controlId()"
        >{{ label() }}</label
      >
      <ng-content />
      @if (hint(); as text) {
        <p class="mt-1 text-xs text-muted" [id]="controlId() + '-hint'">
          {{ text }}
        </p>
      }
      @if (error(); as text) {
        <p
          class="mt-1.5 text-xs text-danger"
          role="alert"
          [id]="controlId() + '-error'"
        >
          {{ text }}
        </p>
      }
    </div>
  `,
})
export class FieldComponent {
  readonly label = input.required<string>();
  readonly controlId = input.required<string>();
  readonly hint = input('');
  readonly error = input('');
}
