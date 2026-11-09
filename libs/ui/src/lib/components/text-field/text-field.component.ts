import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  FIELD_CONTROL_CLASSES,
  FIELD_CONTROL_INVALID_CLASSES,
  FIELD_CONTROL_SINGLE_LINE_CLASSES,
} from '../../models/field-control.model';

/** Styles a native `<input>`; type, value, forms and `disabled` stay native. */
@Component({
  selector: 'input[ui-text-field]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.aria-invalid]': 'invalid() ? "true" : null',
  },
  template: ``,
})
export class TextFieldComponent {
  readonly invalid = input(false);

  protected readonly classes = computed(() =>
    [
      FIELD_CONTROL_CLASSES,
      FIELD_CONTROL_SINGLE_LINE_CLASSES,
      this.invalid() ? FIELD_CONTROL_INVALID_CLASSES : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
