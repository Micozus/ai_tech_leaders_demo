import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  ALERT_BASE_CLASSES,
  ALERT_TONE_CLASSES,
  ALERT_TONE_ICONS,
  type AlertTone,
} from './alert.model';

/**
 * Inline notice. `danger` is announced assertively (`alert`), the rest politely (`status`).
 * Text is the message; the icon repeats the tone and is decorative.
 */
@Component({
  selector: 'ui-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="classes()" [attr.role]="role()">
    <i [class]="'pi mt-0.5 shrink-0 ' + icon()" aria-hidden="true"></i>
    <div>
      @if (heading(); as text) {
        <p class="font-bold">{{ text }}</p>
      }
      <ng-content />
    </div>
  </div>`,
})
export class AlertComponent {
  readonly tone = input<AlertTone>('info');
  readonly heading = input('');

  protected readonly role = computed(() =>
    this.tone() === 'danger' ? 'alert' : 'status',
  );
  protected readonly icon = computed(() => ALERT_TONE_ICONS[this.tone()]);
  protected readonly classes = computed(
    () => `${ALERT_BASE_CLASSES} ${ALERT_TONE_CLASSES[this.tone()]}`,
  );
}
