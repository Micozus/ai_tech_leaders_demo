import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { FormSubmitState } from '../../helpers/form-submit.helper';
import type { SubmitOutcome } from '../../helpers/submit-outcome.helper';
import { formatMoney, formatSlot } from '../models/format.helper';
import type { SessionLength, Slot } from '../models/product.model';
import { BookingSummaryComponent } from './booking-summary.component';
import { CancellationNoticeComponent } from './cancellation-notice.component';
import {
  PaymentStatusComponent,
  type PaymentState,
} from './payment-status.component';
import { SlotPickerComponent } from './slot-picker.component';

export type BookingStep = 'pick' | 'pay' | 'done';

/**
 * Book a session in three steps: pick a length and a slot, review and pay, confirmation (E03-S02,
 * E03-S03). Nothing is confirmed until the payment provider confirms: the confirmation step only
 * appears after a successful payment, and a failed one stays on the payment step with a retry.
 */
@Component({
  selector: 'ui-booking-flow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BookingSummaryComponent,
    ButtonComponent,
    CancellationNoticeComponent,
    PaymentStatusComponent,
    SlotPickerComponent,
  ],
  template: `
    <p class="mb-groups text-meta text-muted" role="status">
      Step {{ stepNumber() }} of 3: {{ stepLabel() }}
    </p>
    @switch (step()) {
      @case ('pick') {
        <ui-slot-picker
          [slots]="slots()"
          [now]="now()"
          [price25]="price25()"
          [price50]="price50()"
          [timeZone]="timeZone()"
          [(length)]="length"
          [(selectedId)]="selectedId"
        />
        <div class="mt-groups">
          <button
            ui-button
            type="button"
            [disabled]="!chosen()"
            (click)="step.set('pay')"
          >
            Continue to payment
          </button>
          @if (!chosen()) {
            <span class="ml-group text-meta text-muted"
              >Choose a slot first.</span
            >
          }
        </div>
      }
      @case ('pay') {
        <div class="grid gap-groups">
          @if (chosen(); as slot) {
            <ui-booking-summary
              [mentorName]="mentorName()"
              [when]="whenOf(slot)"
              [length]="length()"
              [price]="price()"
            />
            <ui-cancellation-notice
              [startsAt]="slot.startsAt"
              [now]="now()"
              [timeZone]="timeZone()"
            />
          }
          @if (paymentState(); as payment) {
            <ui-payment-status [status]="payment" (retry)="pay()" />
          }
          <div class="flex flex-wrap gap-group">
            <button
              ui-button
              variant="quiet"
              type="button"
              (click)="step.set('pick')"
            >
              Change slot
            </button>
            <button
              ui-button
              type="button"
              [loading]="state.status() === 'submitting'"
              (click)="pay()"
            >
              Pay {{ priceText() }}
            </button>
          </div>
        </div>
      }
      @case ('done') {
        <div class="grid gap-groups">
          <ui-payment-status status="paid" />
          @if (chosen(); as slot) {
            <ui-booking-summary
              [mentorName]="mentorName()"
              [when]="whenOf(slot)"
              [length]="length()"
              [price]="price()"
            />
          }
        </div>
      }
    }
  `,
})
export class BookingFlowComponent {
  readonly mentorName = input.required<string>();
  readonly slots = input.required<readonly Slot[]>();
  readonly now = input.required<string>();
  readonly price25 = input.required<number>();
  readonly price50 = input.required<number>();
  readonly timeZone = input('Europe/Warsaw');
  /** Takes the payment; the flow never talks to the network itself. */
  readonly payer = input.required<() => Promise<SubmitOutcome>>();
  readonly confirmed = output<void>();

  protected readonly step = signal<BookingStep>('pick');
  protected readonly length = signal<SessionLength>(50);
  protected readonly selectedId = signal('');
  protected readonly state = new FormSubmitState();

  protected readonly chosen = computed(() =>
    this.slots().find((slot) => slot.id === this.selectedId()),
  );
  protected readonly price = computed(() =>
    this.length() === 25 ? this.price25() : this.price50(),
  );
  protected readonly priceText = computed(() => formatMoney(this.price()));
  protected whenOf(slot: Slot): string {
    return formatSlot(slot.startsAt, this.timeZone());
  }
  protected readonly stepNumber = computed(
    () => ({ pick: 1, pay: 2, done: 3 })[this.step()],
  );
  protected readonly stepLabel = computed(
    () =>
      ({ pick: 'choose a slot', pay: 'pay', done: 'confirmed' })[this.step()],
  );
  protected readonly paymentState = computed<PaymentState | undefined>(() => {
    switch (this.state.status()) {
      case 'submitting':
        return 'processing';
      case 'failed':
        return 'failed';
      default:
        return undefined;
    }
  });

  protected async pay(): Promise<void> {
    await this.state.submit(() => this.payer()());
    if (this.state.status() === 'success') {
      this.step.set('done');
      this.confirmed.emit();
    }
  }
}
