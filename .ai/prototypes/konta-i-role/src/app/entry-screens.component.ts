import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import {
  AlertComponent,
  ButtonComponent,
  CardComponent,
  FieldComponent,
  FormSubmitState,
  InvitationAcceptPanelComponent,
  SignInPanelComponent,
  TextFieldComponent,
  focusFirstInvalid,
  type Credentials,
  type SubmitOutcome,
} from '@org/ui';
import { PrototypeState } from './prototype-state.service';
import { ScreenFrameComponent } from './screen-frame.component';

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX = 120;
const PASSWORD_MIN = 12;
const PASSWORD_MAX = 128;

interface RegisterValue {
  readonly displayName: string;
  readonly email: string;
  readonly password: string;
}

function validateRegister(value: RegisterValue): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = value.displayName.trim();
  if (!name) errors['displayName'] = 'Enter your name.';
  else if (name.length > NAME_MAX)
    errors['displayName'] = `Use at most ${NAME_MAX} characters.`;
  if (!EMAIL_SHAPE.test(value.email.trim()))
    errors['email'] = 'Enter an email like name@example.com.';
  if (value.password.length < PASSWORD_MIN || value.password.length > PASSWORD_MAX)
    errors['password'] = `Use ${PASSWORD_MIN} to ${PASSWORD_MAX} characters.`;
  return errors;
}

/** s09: mentor invitation. The panel is the design system's; decline and "no invitation" are prototype-only (gap DS-5). */
@Component({
  selector: 'proto-invite-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScreenFrameComponent, InvitationAcceptPanelComponent, ButtonComponent, AlertComponent, CardComponent],
  template: `
    <proto-screen sid="s09">
      <main class="grid min-h-screen place-items-center p-panel-roomy">
        <div class="grid w-full max-w-md gap-groups">
          @switch (view()) {
            @case ('declined') {
              <ui-card heading="Invitation declined" density="roomy">
                <p class="mb-groups text-body">
                  We recorded that you declined. Nothing else happens in this prototype.
                </p>
                <button ui-button variant="quiet" type="button" (click)="view.set('invite')">
                  Back to the invitation
                </button>
              </ui-card>
            }
            @case ('no-invite') {
              <ui-card heading="Mentors join by invitation only" density="roomy">
                <ui-alert tone="info">
                  DevMentor 1.0 has no open mentor registration (R07/D08). Ask the operators for an invitation.
                </ui-alert>
                <div class="mt-groups">
                  <button ui-button variant="quiet" type="button" (click)="view.set('invite')">
                    Back to the invitation
                  </button>
                </div>
              </ui-card>
            }
            @default {
              <ui-invitation-accept-panel (accept)="state.navigate('s01')" />
              <div class="flex flex-wrap gap-group">
                <button ui-button variant="quiet" type="button" (click)="view.set('declined')">
                  Decline
                </button>
                <button ui-button variant="ghost" type="button" (click)="view.set('no-invite')">
                  I do not have an invitation
                </button>
              </div>
            }
          }
        </div>
      </main>
    </proto-screen>
  `,
})
export class InviteScreenComponent {
  protected readonly state = inject(PrototypeState);
  protected readonly view = signal<'invite' | 'declined' | 'no-invite'>('invite');
}

/** s01: sign in. Simulated: GitHub and email sign-in resolve to demo accounts, nothing leaves this page. */
@Component({
  selector: 'proto-sign-in-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScreenFrameComponent, SignInPanelComponent, ButtonComponent],
  template: `
    <proto-screen sid="s01">
      <main class="grid min-h-screen place-items-center p-panel-roomy">
        <div class="grid w-full max-w-md gap-groups">
          <ui-sign-in-panel
            [submitter]="submitter"
            [githubFailed]="state.githubFailed()"
            (githubSignIn)="state.signInWithGithub()"
            (signedIn)="state.navigate('s03')"
          />
          <p class="text-meta text-muted">
            Simulation: no real GitHub or password check happens. Any valid-looking email and password work.
          </p>
          <button ui-button variant="ghost" type="button" (click)="state.navigate('s02')">
            Create account with email
          </button>
        </div>
      </main>
    </proto-screen>
  `,
})
export class SignInScreenComponent {
  protected readonly state = inject(PrototypeState);
  protected readonly submitter = (value: Credentials): Promise<SubmitOutcome> =>
    this.state.signInWithEmail(value);
}

/**
 * s02: create account with email (mentee only). GAP DS-1: the design system has no registration
 * panel, so this is the simplest version built from its fields, alerts and buttons.
 */
@Component({
  selector: 'proto-register-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScreenFrameComponent, CardComponent, FieldComponent, TextFieldComponent, ButtonComponent, AlertComponent],
  template: `
    <proto-screen sid="s02">
      <main class="grid min-h-screen place-items-center p-panel-roomy">
        <div class="grid w-full max-w-md gap-groups">
          <ui-card heading="Create account with email" density="roomy">
            <form class="grid gap-0" novalidate (submit)="submit($event)">
              @if (form.formError() || form.fieldErrors()['form']; as message) {
                <div class="mb-groups"><ui-alert tone="danger">{{ message }}</ui-alert></div>
              }
              <ui-field label="Name" controlId="rg-name" [error]="error('displayName')">
                <input ui-text-field id="rg-name" autocomplete="name"
                  [invalid]="!!error('displayName')" [value]="displayName()"
                  (input)="displayName.set($any($event.target).value)" />
              </ui-field>
              <ui-field label="Email" controlId="rg-email" [error]="error('email')">
                <input ui-text-field id="rg-email" type="email" autocomplete="email"
                  [invalid]="!!error('email')" [value]="email()"
                  (input)="email.set($any($event.target).value)" />
              </ui-field>
              <ui-field label="Password" controlId="rg-password" hint="12 to 128 characters." [error]="error('password')">
                <input ui-text-field id="rg-password" type="password" autocomplete="new-password"
                  [invalid]="!!error('password')" [value]="password()"
                  (input)="password.set($any($event.target).value)" />
              </ui-field>
              <button ui-button type="submit" [block]="true" [loading]="form.status() === 'submitting'">
                Create account
              </button>
            </form>
          </ui-card>
          <p class="text-meta text-muted">
            Simulation: no account is created and no password is stored. New accounts are always mentees.
          </p>
          <button ui-button variant="ghost" type="button" (click)="state.navigate('s01')">
            I already have an account
          </button>
        </div>
      </main>
    </proto-screen>
  `,
})
export class RegisterScreenComponent {
  protected readonly state = inject(PrototypeState);
  protected readonly form = new FormSubmitState();
  protected readonly displayName = signal('');
  protected readonly email = signal('');
  protected readonly password = signal('');
  readonly #submitted = signal(false);
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

  protected error(name: string): string {
    const local = this.#submitted() ? (validateRegister(this.#value())[name] ?? '') : '';
    return local || this.form.fieldErrors()[name] || '';
  }

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.#submitted.set(true);
    const value = this.#value();
    if (Object.keys(validateRegister(value)).length === 0) {
      await this.form.submit(() => this.state.register(value.displayName));
      if (this.form.status() === 'success') {
        this.state.navigate('s03');
        return;
      }
    }
    afterNextRender(() => focusFirstInvalid(this.#host.nativeElement), { injector: this.#injector });
  }

  #value(): RegisterValue {
    return { displayName: this.displayName(), email: this.email(), password: this.password() };
  }
}
