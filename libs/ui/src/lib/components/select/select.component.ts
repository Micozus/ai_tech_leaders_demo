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

/**
 * Styles a native `<select>`. The list and the arrow are the platform's: they work with
 * keyboard, touch and screen readers without extra code. For 8 or more options, or a search,
 * a combobox is needed (not built yet: see "What is missing").
 */
@Component({
  selector: 'select[ui-select]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'classes()',
    '[attr.aria-invalid]': 'invalid() ? "true" : null',
  },
  template: `<ng-content />`,
})
export class SelectComponent {
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
