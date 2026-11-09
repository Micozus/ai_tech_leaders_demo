import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { BadgeComponent } from '../../components/badge/badge.component';
import type { BadgeTone } from '../../components/badge/badge.model';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';

export type PayoutState = 'not-started' | 'pending' | 'enabled' | 'restricted';

interface PayoutCopy {
  readonly tone: BadgeTone;
  readonly label: string;
  readonly text: string;
  readonly action: string;
}

const COPY: Record<PayoutState, PayoutCopy> = {
  'not-started': {
    tone: 'warning',
    label: 'Payouts not set up',
    text: 'Set up payouts with Stripe before your first payout.',
    action: 'Set up payouts',
  },
  pending: {
    tone: 'warning',
    label: 'Payouts pending',
    text: 'Stripe is checking your details. This can take a few days.',
    action: 'Continue setup',
  },
  enabled: {
    tone: 'success',
    label: 'Payouts enabled',
    text: 'You can be paid for sessions.',
    action: 'View payout settings',
  },
  restricted: {
    tone: 'danger',
    label: 'Payouts restricted',
    text: 'Stripe needs more information before it can pay you.',
    action: 'Fix payout details',
  },
};

/** Whether payouts are enabled through Stripe Connect (E02-S05, 1.1). The state is a word, not only a colour. */
@Component({
  selector: 'ui-payout-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, ButtonComponent, CardComponent],
  template: `
    <ui-card heading="Payouts">
      <p class="mb-group">
        <ui-badge [tone]="copy().tone">{{ copy().label }}</ui-badge>
      </p>
      <p class="mb-groups text-body">{{ copy().text }}</p>
      <button
        ui-button
        [variant]="status() === 'enabled' ? 'quiet' : 'primary'"
        type="button"
        (click)="act.emit()"
      >
        {{ copy().action }}
      </button>
    </ui-card>
  `,
})
export class PayoutStatusComponent {
  readonly status = input.required<PayoutState>();
  readonly act = output<void>();

  protected readonly copy = computed(() => COPY[this.status()]);
}
