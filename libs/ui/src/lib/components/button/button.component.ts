import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import {
  BUTTON_BASE_CLASSES,
  BUTTON_BLOCK_CLASSES,
  BUTTON_BUSY_CLASSES,
  BUTTON_SIZE_CLASSES,
  BUTTON_VARIANT_CLASSES,
  type ButtonSize,
  type ButtonVariant,
} from './button.model';

/** Styles a native `<button>` or `<a>`; the host element keeps its own semantics. */
@Component({
  selector: 'button[ui-button], a[ui-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpinnerComponent],
  host: {
    '[class]': 'classes()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
  template: `
    @if (loading()) {
      <ui-spinner />
    }
    <ng-content />
  `,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly block = input(false);
  readonly loading = input(false);

  protected readonly classes = computed(() =>
    [
      BUTTON_BASE_CLASSES,
      BUTTON_VARIANT_CLASSES[this.variant()],
      BUTTON_SIZE_CLASSES[this.size()],
      this.block() ? BUTTON_BLOCK_CLASSES : '',
      this.loading() ? BUTTON_BUSY_CLASSES : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
