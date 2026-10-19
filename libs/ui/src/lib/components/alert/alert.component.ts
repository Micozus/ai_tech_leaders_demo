import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  ALERT_BASE_CLASSES,
  ALERT_TONE_CLASSES,
  type AlertTone,
} from './alert.model';

/** Inline notice. `danger` is announced assertively (`alert`), the rest politely (`status`). */
@Component({
  selector: 'ui-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="classes()" [attr.role]="role()">
    <ng-content />
  </div>`,
})
export class AlertComponent {
  readonly tone = input<AlertTone>('info');

  protected readonly role = computed(() =>
    this.tone() === 'danger' ? 'alert' : 'status',
  );
  protected readonly classes = computed(
    () => `${ALERT_BASE_CLASSES} ${ALERT_TONE_CLASSES[this.tone()]}`,
  );
}
