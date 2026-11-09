import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CHOICE_ROW_CLASSES } from '../checkbox/checkbox.model';

/** One radio row: `<label ui-radio><input type="radio" name="…" /> Label text</label>`. */
@Component({
  selector: 'label[ui-radio]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: CHOICE_ROW_CLASSES },
  template: `<ng-content />`,
})
export class RadioComponent {}

/**
 * A group of radios in a native `<fieldset>`. The first child must be a `<legend>`: it names
 * the group for assistive technology and is the visible question.
 */
@Component({
  selector: 'fieldset[ui-radio-group]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'm-0 grid min-w-0 gap-group border-0 p-0 [&>legend]:mb-group [&>legend]:p-0 [&>legend]:text-label [&>legend]:text-ink',
  },
  template: `<ng-content />`,
})
export class RadioGroupComponent {}
