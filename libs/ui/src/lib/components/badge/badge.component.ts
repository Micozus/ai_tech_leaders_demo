import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  BADGE_BASE_CLASSES,
  BADGE_TONE_CLASSES,
  type BadgeTone,
} from './badge.model';

/** A small status or category label (a stack tag, a payout state). */
@Component({
  selector: 'ui-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="classes()"><ng-content /></span>`,
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('neutral');

  protected readonly classes = computed(
    () => `${BADGE_BASE_CLASSES} ${BADGE_TONE_CLASSES[this.tone()]}`,
  );
}
