import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { formatMoney } from '../models/format.helper';
import type { SessionLength } from '../models/product.model';

/** What the mentee is about to pay for (E03-S03). Sessions are text only: every summary says so (N01). */
@Component({
  selector: 'ui-booking-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent],
  template: `
    <ui-card heading="Your booking" density="roomy">
      <dl class="m-0 grid gap-group text-body">
        <div class="flex justify-between gap-groups">
          <dt class="text-muted">Mentor</dt>
          <dd class="m-0 text-right">{{ mentorName() }}</dd>
        </div>
        <div class="flex justify-between gap-groups">
          <dt class="text-muted">When</dt>
          <dd class="m-0 text-right">{{ when() }}</dd>
        </div>
        <div class="flex justify-between gap-groups">
          <dt class="text-muted">Length</dt>
          <dd class="m-0 text-right">{{ length() }} minutes, text only</dd>
        </div>
        <div
          class="flex justify-between gap-groups border-t border-solid border-line pt-group"
        >
          <dt class="text-label">Total</dt>
          <dd class="m-0 text-right text-label tabular-nums">{{ total() }}</dd>
        </div>
      </dl>
    </ui-card>
  `,
})
export class BookingSummaryComponent {
  readonly mentorName = input.required<string>();
  readonly when = input.required<string>();
  readonly length = input.required<SessionLength>();
  readonly price = input.required<number>();

  protected readonly total = computed(() => formatMoney(this.price()));
}
