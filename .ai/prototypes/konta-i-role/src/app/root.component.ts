import { ChangeDetectionStrategy, Component, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import {
  InviteScreenComponent,
  RegisterScreenComponent,
  SignInScreenComponent,
} from './entry-screens.component';
import { PrototypeState } from './prototype-state.service';
import {
  EMAIL_SCENARIOS,
  GITHUB_SCENARIOS,
  REGISTER_SCENARIOS,
  SCREENS,
  type ScreenId,
} from './prototype.model';
import {
  HomeScreenComponent,
  NoAccessScreenComponent,
  ResolveScreenComponent,
  SignedOutScreenComponent,
} from './role-screens.component';

declare global {
  interface Window {
    /** Provided by the review engine (public/prototype.js). */
    __PROTOTYPE_START__?: () => boolean;
  }
}

/**
 * Review bar (engine toolbar plus scenario controls) and all screens. Scenario controls live in
 * the bar, apart from product navigation (rule 5). The engine adds its own buttons to `.doc-toolbar`.
 */
@Component({
  selector: 'proto-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InviteScreenComponent,
    SignInScreenComponent,
    RegisterScreenComponent,
    ResolveScreenComponent,
    HomeScreenComponent,
    NoAccessScreenComponent,
    SignedOutScreenComponent,
  ],
  template: `
    <div class="doc-toolbar">
      <span class="proto-badge">Prototyp</span>
      <label>
        Ekran
        <select aria-label="Wybór ekranu" [value]="state.current() ?? ''" (change)="goTo($any($event.target).value)">
          @for (screen of screens; track screen.id) {
            <option [value]="screen.id" [selected]="screen.id === state.current()">
              {{ screen.id }} · {{ screen.title }}
            </option>
          }
        </select>
      </label>
      <button id="theme-toggle" class="btn btn-outline btn-sm" type="button" disabled
        title="Design system ma tylko jasny motyw (decyzja z 2026-10-22).">
        Motyw: jasny
      </button>
      <span class="proto-note">Ciemny motyw: brak w design systemie.</span>
    </div>
    <div class="doc-scenarios" role="group" aria-label="Scenariusze (kontrolki przeglądu, nie funkcje produktu)">
      <strong>Scenariusze</strong>
      <label>
        GitHub
        <select aria-label="Wynik logowania GitHubem" [value]="state.githubScenario()"
          (change)="state.githubScenario.set($any($event.target).value)">
          @for (o of githubScenarios; track o.value) {
            <option [value]="o.value" [selected]="o.value === state.githubScenario()">{{ o.label }}</option>
          }
        </select>
      </label>
      <label>
        Logowanie e-mail
        <select aria-label="Wynik logowania e-mailem" [value]="state.emailScenario()"
          (change)="state.emailScenario.set($any($event.target).value)">
          @for (o of emailScenarios; track o.value) {
            <option [value]="o.value" [selected]="o.value === state.emailScenario()">{{ o.label }}</option>
          }
        </select>
      </label>
      <label>
        Rejestracja
        <select aria-label="Wynik rejestracji" [value]="state.registerScenario()"
          (change)="state.registerScenario.set($any($event.target).value)">
          @for (o of registerScenarios; track o.value) {
            <option [value]="o.value" [selected]="o.value === state.registerScenario()">{{ o.label }}</option>
          }
        </select>
      </label>
      <button class="btn btn-outline btn-sm" type="button" [attr.aria-pressed]="state.operatorRemoved()"
        (click)="state.toggleOperatorRemoved()">
        {{ state.operatorRemoved() ? 'Przywróć Oliwię na allowlistę' : 'Usuń Oliwię z allowlisty' }}
      </button>
      <button class="btn btn-outline btn-sm" type="button" (click)="state.expireSession()">Wygaś sesję</button>
      <label>
        Trasa
        <select aria-label="Trasa chroniona do otwarcia" [value]="route()"
          (change)="route.set($any($event.target).value)">
          @for (r of routes; track r.id) {
            <option [value]="r.id" [selected]="r.id === route()">{{ r.label }}</option>
          }
        </select>
      </label>
      <button class="btn btn-outline btn-sm" type="button" (click)="state.openRoute(route(), false)">
        Otwórz trasę (jako zalogowany)
      </button>
      <button class="btn btn-outline btn-sm" type="button" (click)="state.openRoute(route(), true)">
        Wyloguj i otwórz (głęboki link)
      </button>
      <span class="proto-note" aria-live="polite">{{ who() }}</span>
    </div>
    <p class="proto-banner" role="note">
      Prototyp, symulacja: logowanie GitHubem i e-mailem jest udawane, nic nie wychodzi poza tę
      stronę. Nie wpisuj prawdziwych haseł. Dane są fikcyjne.
    </p>
    <div class="doc">
      <proto-invite-screen />
      <proto-sign-in-screen />
      <proto-register-screen />
      <proto-resolve-screen />
      <proto-home-screen sid="s04" role="mentee" heading="Welcome to your sessions" />
      <proto-home-screen sid="s05" role="mentor" heading="Welcome to your mentor page" />
      <proto-home-screen sid="s06" role="operator" heading="Welcome to the operator desk" />
      <proto-no-access-screen />
      <proto-signed-out-screen />
    </div>
  `,
})
export class RootComponent {
  protected readonly state = inject(PrototypeState);
  protected readonly screens = SCREENS;
  protected readonly githubScenarios = GITHUB_SCENARIOS;
  protected readonly emailScenarios = EMAIL_SCENARIOS;
  protected readonly registerScenarios = REGISTER_SCENARIOS;
  protected readonly routes: readonly { id: ScreenId; label: string }[] = [
    { id: 's04', label: '/mentee' },
    { id: 's05', label: '/mentor' },
    { id: 's06', label: '/operator' },
  ];
  protected readonly route = signal<ScreenId>('s05');
  protected readonly who = computed(() => {
    const account = this.state.account();
    const role = this.state.effectiveRole();
    return account ? `Zalogowany: ${account.name} (${role})` : 'Niezalogowany';
  });

  constructor() {
    afterNextRender(() => window.__PROTOTYPE_START__?.(), { injector: inject(Injector) });
  }

  protected goTo(id: ScreenId): void {
    this.state.navigate(id);
  }
}
