import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { AlertComponent } from '../../components/alert/alert.component';
import { formatSlot, hoursUntil } from '../models/format.helper';
import { FREE_CANCELLATION_HOURS } from '../models/product.model';

/** The cancellation rule in words (E03-S05, R09): free up to 24 hours before, later the fee is forfeited. */
@Component({
  selector: 'ui-cancellation-notice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent],
  template: `
    <ui-alert tone="info" [heading]="heading()">{{ text() }}</ui-alert>
  `,
})
export class CancellationNoticeComponent {
  readonly startsAt = input.required<string>();
  readonly now = input.required<string>();
  readonly timeZone = input('Europe/Warsaw');

  protected readonly isFree = computed(
    () => hoursUntil(this.startsAt(), this.now()) >= FREE_CANCELLATION_HOURS,
  );
  protected readonly heading = computed(() =>
    this.isFree() ? 'Free cancellation' : 'Cancelling now forfeits the fee',
  );
  protected readonly text = computed(() => {
    if (!this.isFree())
      return 'The session starts in less than 24 hours, so the mentor keeps the fee.';
    const until = new Date(
      new Date(this.startsAt()).getTime() - FREE_CANCELLATION_HOURS * 3_600_000,
    ).toISOString();
    return `You can cancel for free until ${formatSlot(until, this.timeZone())}.`;
  });
}
