import { ChangeDetectionStrategy, Component, effect, inject, input, untracked } from '@angular/core';
import {
  AccessDeniedComponent,
  AppHeaderComponent,
  PageHeaderComponent,
  SpinnerComponent,
  type MenuEntry,
  type Role,
} from '@org/ui';
import { PrototypeState } from './prototype-state.service';
import { ROLE_REDIRECT_DELAY_MS, type ScreenId } from './prototype.model';
import { ScreenFrameComponent } from './screen-frame.component';

/** s03: `/home` has no UI of its own; it resolves the role and redirects. Shown briefly here so the step is visible. */
@Component({
  selector: 'proto-resolve-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScreenFrameComponent, SpinnerComponent],
  template: `
    <proto-screen sid="s03">
      <main class="grid min-h-screen place-items-center p-panel-roomy">
        <div class="grid justify-items-center gap-groups">
          <ui-spinner />
          <h2 class="text-section-title">Finding your home</h2>
          <p class="text-meta text-muted">
            In the product this is a server redirect with no screen (open question SPEC-4).
          </p>
        </div>
      </main>
    </proto-screen>
  `,
})
export class ResolveScreenComponent {
  readonly #state = inject(PrototypeState);

  constructor() {
    effect((onCleanup) => {
      if (this.#state.current() !== 's03') return;
      const timer = setTimeout(
        () => this.#state.navigate(untracked(() => this.#state.resolveHome())),
        ROLE_REDIRECT_DELAY_MS,
      );
      onCleanup(() => clearTimeout(timer));
    });
  }
}

/** s04, s05, s06: placeholder role homes (heading, signed-in name, sign out). Sessions belong to E03/E04. */
@Component({
  selector: 'proto-home-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScreenFrameComponent, AppHeaderComponent, PageHeaderComponent],
  template: `
    <proto-screen [sid]="sid()">
      <ui-app-header [userName]="name()" [userRole]="role()" [entries]="entries" />
      <main class="mx-auto max-w-page p-panel-roomy">
        <ui-page-header [heading]="heading()" description="This is a placeholder home for Epic 01. Role-specific content arrives in later epics." />
      </main>
    </proto-screen>
  `,
})
export class HomeScreenComponent {
  readonly sid = input.required<ScreenId>();
  readonly role = input.required<Role>();
  readonly heading = input.required<string>();
  readonly #state = inject(PrototypeState);
  protected readonly entries: readonly MenuEntry[] = [
    { label: 'Sign out', icon: 'pi-sign-out', command: () => this.#state.signOut() },
  ];
  protected readonly name = () => this.#state.account()?.name ?? '—';
}

/** s07: a signed-in person opened another role's route. */
@Component({
  selector: 'proto-no-access-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScreenFrameComponent, AccessDeniedComponent],
  template: `
    <proto-screen sid="s07">
      <main class="grid min-h-screen place-items-center p-panel-roomy">
        <ui-access-denied reason="no-access" homeHref="#s03" />
      </main>
    </proto-screen>
  `,
})
export class NoAccessScreenComponent {}

/**
 * s08: a signed-out visitor opened a protected route. The product redirects to
 * `/sign-in?returnTo=<route>` (no screen); the prototype stops here so the redirect is visible
 * (open question SPEC-2). After sign-in the person lands on the route they asked for.
 */
@Component({
  selector: 'proto-signed-out-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScreenFrameComponent, AccessDeniedComponent],
  template: `
    <proto-screen sid="s08">
      <main class="grid min-h-screen place-items-center p-panel-roomy">
        <div class="grid max-w-md gap-groups">
          <ui-access-denied reason="signed-out" signInHref="#s01" />
          @if (state.returnTo(); as route) {
            <p class="text-meta text-muted">
              Redirect target: <code>/sign-in?returnTo=/{{ routes[route] }}</code>
            </p>
          }
        </div>
      </main>
    </proto-screen>
  `,
})
export class SignedOutScreenComponent {
  protected readonly state = inject(PrototypeState);
  protected readonly routes: Readonly<Partial<Record<ScreenId, string>>> = {
    s03: 'home',
    s04: 'mentee',
    s05: 'mentor',
    s06: 'operator',
  };
}
