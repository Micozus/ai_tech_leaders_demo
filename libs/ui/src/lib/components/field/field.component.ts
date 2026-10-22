import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
} from '@angular/core';

/**
 * Label, hint and error around one projected control. Pass the control's `id` as `controlId`:
 * the label targets it, and `aria-describedby` on the control is kept in sync with the hint
 * (`<controlId>-hint`) and the error (`<controlId>-error`, announced with `role="alert"`).
 * Only optional fields are marked, with "Optional" in the muted colour (decision Q-C).
 */
@Component({
  selector: 'ui-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-groups last:mb-0">
      <label class="mb-group block text-label text-ink" [attr.for]="controlId()"
        >{{ label() }}
        @if (optional()) {
          <span class="font-normal text-muted">(Optional)</span>
        }
      </label>
      <ng-content />
      @if (hint(); as text) {
        <p class="mt-group text-meta text-muted" [id]="controlId() + '-hint'">
          {{ text }}
        </p>
      }
      @if (error(); as text) {
        <p
          class="mt-group flex items-start gap-group text-meta text-danger"
          role="alert"
          [id]="controlId() + '-error'"
        >
          <i
            class="pi pi-exclamation-triangle mt-0.5 shrink-0"
            aria-hidden="true"
          ></i>
          <span>{{ text }}</span>
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
  readonly optional = input(false);

  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    effect(() => {
      const id = this.controlId();
      const ids = [
        this.hint() ? `${id}-hint` : '',
        this.error() ? `${id}-error` : '',
      ].filter(Boolean);
      const control = Array.from(
        this.#host.nativeElement.querySelectorAll('[id]'),
      ).find((element) => element.id === id);
      if (!control) return;
      if (ids.length > 0)
        control.setAttribute('aria-describedby', ids.join(' '));
      else control.removeAttribute('aria-describedby');
    });
  }
}
