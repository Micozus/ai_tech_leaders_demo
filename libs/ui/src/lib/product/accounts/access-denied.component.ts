import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ErrorStateComponent } from '../../components/error-state/error-state.component';
import { LinkComponent } from '../../components/link/link.component';

export type AccessReason = 'no-access' | 'signed-out';

/** What a person sees on a screen that is not theirs (E01-S03): the reason and the way on. */
@Component({
  selector: 'ui-access-denied',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ErrorStateComponent, LinkComponent],
  template: `
    <ui-error-state [heading]="heading()" [description]="description()">
      <a ui-link [attr.href]="href()">{{ linkText() }}</a>
    </ui-error-state>
  `,
})
export class AccessDeniedComponent {
  readonly reason = input<AccessReason>('no-access');
  readonly homeHref = input('/home');
  readonly signInHref = input('/sign-in');

  protected readonly heading = computed(() =>
    this.reason() === 'signed-out'
      ? 'Sign in to open this page'
      : 'You do not have access to this page',
  );
  protected readonly description = computed(() =>
    this.reason() === 'signed-out'
      ? 'This page is for signed-in users.'
      : 'It belongs to another role. If you think this is a mistake, write to the operators.',
  );
  protected readonly href = computed(() =>
    this.reason() === 'signed-out' ? this.signInHref() : this.homeHref(),
  );
  protected readonly linkText = computed(() =>
    this.reason() === 'signed-out' ? 'Go to sign in' : 'Go to your home',
  );
}
