import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import { ButtonComponent } from '../../components/button/button.component';
import { LinkComponent } from '../../components/link/link.component';
import type { MentorSummary } from '../models/product.model';

/**
 * One mentor in the list (E03-S01): who, what they mentor, public work, the lowest price and the
 * next free slot. No rating, no score, no rank (N02, R13): the person chooses from the work and the tags.
 */
@Component({
  selector: 'ui-mentor-list-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, BadgeComponent, ButtonComponent, LinkComponent],
  template: `
    <article
      class="flex flex-wrap items-start gap-groups border-t border-solid border-line px-row-x py-row-y"
    >
      <ui-avatar [name]="mentor().name" />
      <div class="min-w-0 flex-1">
        <h3 class="text-section-title">{{ mentor().name }}</h3>
        <div class="my-group flex flex-wrap gap-group">
          @for (tag of mentor().tags; track tag) {
            <ui-badge>{{ tag }}</ui-badge>
          }
        </div>
        <p class="text-body">
          Public work:
          <a
            ui-link
            class="font-mono text-code break-all"
            [attr.href]="mentor().publicWorkUrl"
            >{{ mentor().publicWorkUrl }}</a
          >
        </p>
      </div>
      <div class="grid justify-items-end gap-group text-right">
        <p class="text-body tabular-nums">From {{ mentor().priceFrom }}</p>
        <p class="text-meta text-muted">
          @if (mentor().nextSlot; as slot) {
            Next free slot: {{ slot }}
          } @else {
            No free slots now
          }
        </p>
        <button
          ui-button
          size="sm"
          type="button"
          (click)="view.emit(mentor().id)"
        >
          View mentor
        </button>
      </div>
    </article>
  `,
})
export class MentorListRowComponent {
  readonly mentor = input.required<MentorSummary>();
  readonly view = output<string>();
}
