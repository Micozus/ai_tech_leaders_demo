import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  AsyncRegionComponent,
  type AsyncState,
} from '../../components/async-region/async-region.component';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';

export type InvitationState = 'loading' | 'ready' | 'invalid';

/** An invited senior engineer accepts and gets a mentor account (E02-S01, R07: no open registration). */
@Component({
  selector: 'ui-invitation-accept-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncRegionComponent, ButtonComponent, CardComponent],
  template: `
    <ui-card heading="You are invited to mentor on DevMentor" density="roomy">
      <ui-async-region
        [state]="region()"
        loadingLabel="Checking your invitation"
        errorHeading="This invitation cannot be used"
        errorDescription="It may have expired or already been used. Ask the operators for a new one."
      >
        <p class="mb-groups max-w-measure text-body-long">
          {{ inviter() }} invited you to mentor. Accepting creates your mentor
          account. We ask you to publish at least one bookable session within
          two weeks.
        </p>
        <button ui-button type="button" (click)="accept.emit()">
          Accept the invitation
        </button>
      </ui-async-region>
    </ui-card>
  `,
})
export class InvitationAcceptPanelComponent {
  readonly state = input<InvitationState>('ready');
  readonly inviter = input('The DevMentor operators');
  readonly accept = output<void>();

  protected readonly region = computed<AsyncState>(() => {
    const state = this.state();
    return state === 'invalid' ? 'error' : state;
  });
}
