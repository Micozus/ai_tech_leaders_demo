import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import type { BadgeTone } from '../../components/badge/badge.model';
import { ButtonComponent } from '../../components/button/button.component';
import type { SessionStatus, SessionSummary } from '../models/product.model';

const STATUS: Record<SessionStatus, { tone: BadgeTone; label: string }> = {
  'awaiting-payment': { tone: 'warning', label: 'Awaiting payment' },
  booked: { tone: 'success', label: 'Booked' },
  cancelled: { tone: 'neutral', label: 'Cancelled' },
  completed: { tone: 'neutral', label: 'Completed' },
};

/** One session in a list (E03-S04): who, what, when, status, and what you can do. */
@Component({
  selector: 'ui-session-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, BadgeComponent, ButtonComponent],
  template: `
    <article
      class="flex flex-wrap items-center gap-groups border-t border-solid border-line px-row-x py-row-y"
    >
      <ui-avatar [name]="session().withName" size="sm" />
      <div class="min-w-0 flex-1">
        <h3 class="text-body font-bold">{{ session().title }}</h3>
        <p class="text-meta text-muted">
          {{ session().withName }} · {{ session().startsAt }} ·
          {{ session().length }} minutes
        </p>
      </div>
      <ui-badge [tone]="status().tone">{{ status().label }}</ui-badge>
      <div class="flex gap-group">
        <button
          ui-button
          size="sm"
          type="button"
          (click)="openSession.emit(session().id)"
        >
          Open session
        </button>
        @if (session().status === 'booked') {
          <button
            ui-button
            variant="quiet"
            size="sm"
            type="button"
            (click)="cancelBooking.emit(session().id)"
          >
            Cancel booking
          </button>
        }
      </div>
    </article>
  `,
})
export class SessionRowComponent {
  readonly session = input.required<SessionSummary>();
  readonly openSession = output<string>();
  readonly cancelBooking = output<string>();

  protected readonly status = computed(() => STATUS[this.session().status]);
}
