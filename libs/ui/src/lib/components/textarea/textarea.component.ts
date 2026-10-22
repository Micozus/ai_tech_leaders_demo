import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  FIELD_CONTROL_CLASSES,
  FIELD_CONTROL_INVALID_CLASSES,
  FIELD_CONTROL_MULTI_LINE_CLASSES,
} from '../../models/field-control.model';

/** Styles a native `<textarea>`; rows, value, forms and `disabled` stay native. */
@Component({
  selector: 'textarea[ui-textarea]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.aria-invalid]': 'invalid() ? "true" : null',
  },
  template: ``,
})
export class TextareaComponent {
  readonly invalid = input(false);

  protected readonly classes = computed(() =>
    [
      FIELD_CONTROL_CLASSES,
      FIELD_CONTROL_MULTI_LINE_CLASSES,
      this.invalid() ? FIELD_CONTROL_INVALID_CLASSES : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
