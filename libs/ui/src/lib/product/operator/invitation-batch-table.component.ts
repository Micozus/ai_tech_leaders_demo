import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  AsyncRegionComponent,
  type AsyncState,
} from '../../components/async-region/async-region.component';
import { BadgeComponent } from '../../components/badge/badge.component';
import type { BadgeTone } from '../../components/badge/badge.model';

export type InvitationStatus = 'invited' | 'accepted' | 'published';

export interface InvitationRow {
  readonly email: string;
  readonly status: InvitationStatus;
}

const STATUS: Record<InvitationStatus, { tone: BadgeTone; label: string }> = {
  invited: { tone: 'accent', label: 'Invited' },
  accepted: { tone: 'warning', label: 'Accepted, no slot yet' },
  published: { tone: 'success', label: 'Published a slot' },
};

/** A batch of 20 invitations and who published a slot within two weeks (E05-S01, R17). A real table with a caption. */
@Component({
  selector: 'ui-invitation-batch-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncRegionComponent, BadgeComponent],
  template: `
    <ui-async-region
      [state]="state()"
      loadingLabel="Loading the batch"
      emptyHeading="No invitations in this batch"
      emptyDescription="Invite senior engineers from the beachhead pool."
      errorHeading="The batch did not load"
    >
      <table class="w-full border-collapse text-body">
        <caption class="mb-group text-left text-section-title">
          Invitation batch:
          {{
            published()
          }}
          of
          {{
            rows().length
          }}
          published a slot
        </caption>
        <thead>
          <tr class="text-left text-label text-muted">
            <th scope="col" class="px-row-x py-group">Email</th>
            <th scope="col" class="px-row-x py-group">Status</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.email) {
            <tr class="border-t border-solid border-line">
              <th scope="row" class="px-row-x py-row-y text-left font-normal">
                {{ row.email }}
              </th>
              <td class="px-row-x py-row-y">
                <ui-badge [tone]="tone(row.status)">{{
                  label(row.status)
                }}</ui-badge>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </ui-async-region>
  `,
})
export class InvitationBatchTableComponent {
  readonly rows = input<readonly InvitationRow[]>([]);
  readonly state = input<AsyncState>('ready');

  protected published(): number {
    return this.rows().filter((row) => row.status === 'published').length;
  }

  protected tone(status: InvitationStatus): BadgeTone {
    return STATUS[status].tone;
  }

  protected label(status: InvitationStatus): string {
    return STATUS[status].label;
  }
}
