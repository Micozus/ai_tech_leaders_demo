import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHOICE_ROW_CLASSES } from './checkbox.model';

/** `<label ui-checkbox><input type="checkbox" /> Label text</label>`: the label is the row. */
@Component({
  selector: 'label[ui-checkbox]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: CHOICE_ROW_CLASSES },
  template: `<ng-content />`,
})
export class CheckboxComponent {}
