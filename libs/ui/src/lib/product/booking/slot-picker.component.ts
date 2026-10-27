import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import {
  RadioComponent,
  RadioGroupComponent,
} from '../../components/radio-group/radio-group.component';
import { formatMoney, formatSlot, hoursUntil } from '../models/format.helper';
import {
  MIN_BOOKING_LEAD_HOURS,
  type SessionLength,
  type Slot,
} from '../models/product.model';

interface SlotChoice {
  readonly slot: Slot;
  readonly label: string;
  /** Why the slot cannot be chosen, in words. Empty when it can. */
  readonly reason: string;
}

/**
 * Choose a length (25 or 50 minutes, at the mentor's price) and a slot (E03-S02). A slot that starts
 * in under two hours (R14) or is booked cannot be chosen, and the reason is written next to it.
 */
@Component({
  selector: 'ui-slot-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RadioComponent, RadioGroupComponent],
  template: `
    <fieldset ui-radio-group class="mb-groups">
      <legend>Session length</legend>
      <label ui-radio
        ><input
          type="radio"
          name="sp-length"
          [checked]="length() === 25"
          (change)="length.set(25)"
        />
        25 minutes · {{ money(price25()) }}</label
      >
      <label ui-radio
        ><input
          type="radio"
          name="sp-length"
          [checked]="length() === 50"
          (change)="length.set(50)"
        />
        50 minutes · {{ money(price50()) }}</label
      >
    </fieldset>
    <fieldset ui-radio-group>
      <legend>Choose a slot</legend>
      @for (choice of choices(); track choice.slot.id) {
        <label ui-radio>
          <input
            type="radio"
            name="sp-slot"
            [checked]="selectedId() === choice.slot.id"
            [disabled]="!!choice.reason"
            (change)="selectedId.set(choice.slot.id)"
          />
          {{ choice.label }}
          @if (choice.reason) {
            <span class="text-meta text-muted">({{ choice.reason }})</span>
          }
        </label>
      }
    </fieldset>
  `,
})
export class SlotPickerComponent {
  readonly slots = input.required<readonly Slot[]>();
  /** Now, as an ISO time: passed in so the same inputs always give the same screen. */
  readonly now = input.required<string>();
  readonly price25 = input.required<number>();
  readonly price50 = input.required<number>();
  readonly timeZone = input('Europe/Warsaw');
  readonly length = model<SessionLength>(50);
  readonly selectedId = model('');

  protected readonly choices = computed<readonly SlotChoice[]>(() =>
    this.slots().map((slot) => ({
      slot,
      label: formatSlot(slot.startsAt, this.timeZone()),
      reason: this.#reason(slot),
    })),
  );

  protected money(amount: number): string {
    return formatMoney(amount);
  }

  #reason(slot: Slot): string {
    if (slot.state === 'booked') return 'booked';
    if (hoursUntil(slot.startsAt, this.now()) < MIN_BOOKING_LEAD_HOURS)
      return 'starts in less than 2 hours';
    return '';
  }
}
