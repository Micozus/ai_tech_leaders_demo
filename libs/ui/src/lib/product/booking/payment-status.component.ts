import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { AlertComponent } from '../../components/alert/alert.component';
import type { AlertTone } from '../../components/alert/alert.model';
import { ButtonComponent } from '../../components/button/button.component';

export type PaymentState = 'awaiting' | 'processing' | 'paid' | 'failed';

interface PaymentCopy {
  readonly tone: AlertTone;
  readonly heading: string;
  readonly text: string;
}

const COPY: Record<PaymentState, PaymentCopy> = {
  awaiting: {
    tone: 'info',
    heading: 'Pay to confirm your booking',
    text: 'The slot is held for 10 minutes.',
  },
  processing: {
    tone: 'info',
    heading: 'Waiting for your bank',
    text: 'Do not close this page. This usually takes a few seconds.',
  },
  paid: {
    tone: 'success',
    heading: 'Booking confirmed',
    text: 'You and the mentor are told, and the session is in your list.',
  },
  failed: {
    tone: 'danger',
    heading: 'Payment failed',
    text: 'Your bank declined the payment. Try another card; the slot is held for 10 minutes.',
  },
};

/** The result of paying (E03-S03). A booking is confirmed only after payment, never before. */
@Component({
  selector: 'ui-payment-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, ButtonComponent],
  template: `
    <ui-alert [tone]="copy().tone" [heading]="copy().heading">
      {{ copy().text }}
      @if (status() === 'failed') {
        <div class="mt-group">
          <button ui-button size="sm" type="button" (click)="retry.emit()">
            Try another card
          </button>
        </div>
      }
    </ui-alert>
  `,
})
export class PaymentStatusComponent {
  readonly status = input.required<PaymentState>();
  readonly retry = output<void>();

  protected readonly copy = computed(() => COPY[this.status()]);
}
