import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { AsyncRegionComponent } from '../../components/async-region/async-region.component';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { LinkComponent } from '../../components/link/link.component';
import { AccessDeniedComponent } from '../accounts/access-denied.component';
import type { MentorSummary } from '../models/product.model';

export type MentorDetailState = 'loading' | 'ready' | 'not-found';

/**
 * A mentor's page (E02-S02, E03-S01). The name, the work and the main action, "Book a session", are in
 * the first screen without scrolling. A page that does not exist or is not yours says so and gives a way on.
 */
@Component({
  selector: 'ui-mentor-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AccessDeniedComponent,
    AsyncRegionComponent,
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    LinkComponent,
  ],
  template: `
    @if (state() === 'not-found') {
      <ui-access-denied reason="no-access" />
    } @else {
      <ui-async-region
        [state]="state() === 'loading' ? 'loading' : 'ready'"
        loadingLabel="Loading the mentor page"
      >
        @if (mentor(); as m) {
          <header
            class="mb-groups flex flex-wrap items-center justify-between gap-groups"
          >
            <div class="flex items-center gap-groups">
              <ui-avatar [name]="m.name" size="lg" />
              <div>
                <h1 class="text-page-title">{{ m.name }}</h1>
                <div class="mt-group flex flex-wrap gap-group">
                  @for (tag of m.tags; track tag) {
                    <ui-badge>{{ tag }}</ui-badge>
                  }
                </div>
              </div>
            </div>
            <button ui-button type="button" (click)="book.emit(m.id)">
              Book a session
            </button>
          </header>
          <ui-card heading="Public work" density="roomy" [headingLevel]="2">
            <p class="text-body">
              <a
                ui-link
                class="font-mono text-code break-all"
                [attr.href]="m.publicWorkUrl"
                >{{ m.publicWorkUrl }}</a
              >
            </p>
            <p class="mt-groups max-w-measure text-body-long">{{ about() }}</p>
            <p class="mt-groups text-body tabular-nums">
              From {{ m.priceFrom }} · text sessions, 25 or 50 minutes
            </p>
          </ui-card>
        }
      </ui-async-region>
    }
  `,
})
export class MentorDetailComponent {
  readonly mentor = input<MentorSummary>();
  readonly about = input('');
  readonly state = input<MentorDetailState>('ready');
  readonly book = output<string>();
}
