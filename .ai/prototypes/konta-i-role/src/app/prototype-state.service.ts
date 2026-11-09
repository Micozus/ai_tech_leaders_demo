import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import type { Credentials, Role, SubmitOutcome } from '@org/ui';
import {
  DEFAULT_EMAIL_ACCOUNT_ID,
  DEMO_ACCOUNTS,
  HOME_SCREEN_BY_ROLE,
  INVALID_CREDENTIALS_MESSAGE,
  NAVIGATE_EVENT,
  OPERATOR_ACCOUNT_ID,
  RATE_LIMIT_MESSAGE,
  REGISTER_CONFLICT_MESSAGE,
  REGISTER_FIELD_ERRORS,
  ROLE_BY_SCREEN,
  SCREEN_CHANGE_EVENT,
  SIGNED_OUT_ONLY_SCREENS,
  SIMULATED_DELAY_MS,
  type DemoAccount,
  type EmailScenario,
  type GithubScenario,
  type RegisterScenario,
  type ScreenId,
} from './prototype.model';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function accountById(id: string): DemoAccount {
  return DEMO_ACCOUNTS.find((account) => account.id === id) ?? DEMO_ACCOUNTS[0];
}

/** Simulated session, scenarios, access gates and navigation. Nothing here talks to a server. */
@Injectable({ providedIn: 'root' })
export class PrototypeState {
  readonly account = signal<DemoAccount | null>(null);
  readonly current = signal<ScreenId | null>(null);
  /** Protected screen a signed-out visitor tried to open (`/sign-in?returnTo=`). */
  readonly returnTo = signal<ScreenId | null>(null);
  readonly githubFailed = signal(false);

  readonly githubScenario = signal<GithubScenario>('ada');
  readonly emailScenario = signal<EmailScenario>('ok');
  readonly registerScenario = signal<RegisterScenario>('ok');
  /** Scenario 5: the operator was removed from OPERATOR_GITHUB_IDS between requests. */
  readonly operatorRemoved = signal(false);

  /** The role in effect now. A removed founder counts as a mentee immediately, even mid-session. */
  readonly effectiveRole = computed<Role | null>(() => {
    const account = this.account();
    if (!account) return null;
    return account.id === OPERATOR_ACCOUNT_ID && this.operatorRemoved() ? 'mentee' : account.role;
  });

  constructor() {
    const onScreenChange = (event: Event) => {
      const id = (event as CustomEvent<ScreenId>).detail;
      this.current.set(id);
      const allowed = this.#gate(id);
      if (allowed !== id) this.#dispatch(allowed);
    };
    document.addEventListener(SCREEN_CHANGE_EVENT, onScreenChange);
    inject(DestroyRef).onDestroy(() =>
      document.removeEventListener(SCREEN_CHANGE_EVENT, onScreenChange),
    );
  }

  /** Goes through the review engine so history, Back and pins stay consistent. Applies the access gates first. */
  navigate(id: ScreenId): void {
    this.#dispatch(this.#gate(id));
  }

  async signInWithGithub(): Promise<void> {
    this.githubFailed.set(false);
    await delay(SIMULATED_DELAY_MS);
    const scenario = this.githubScenario();
    if (scenario === 'denied' || scenario === 'unavailable') {
      this.githubFailed.set(true);
      return;
    }
    this.account.set(accountById(scenario));
    this.navigate('s03');
  }

  async signInWithEmail(_credentials: Credentials): Promise<SubmitOutcome> {
    await delay(SIMULATED_DELAY_MS);
    switch (this.emailScenario()) {
      case '401':
        return { kind: 'field-errors', errors: { form: INVALID_CREDENTIALS_MESSAGE } };
      case '429':
        return { kind: 'field-errors', errors: { form: RATE_LIMIT_MESSAGE } };
      case 'offline':
        return { kind: 'offline' };
      case 'ok':
        this.account.set(accountById(DEFAULT_EMAIL_ACCOUNT_ID));
        return { kind: 'ok' };
    }
  }

  async register(displayName: string): Promise<SubmitOutcome> {
    await delay(SIMULATED_DELAY_MS);
    switch (this.registerScenario()) {
      case '409':
        return { kind: 'field-errors', errors: { form: REGISTER_CONFLICT_MESSAGE } };
      case '429':
        return { kind: 'field-errors', errors: { form: RATE_LIMIT_MESSAGE } };
      case 'field-errors':
        return { kind: 'field-errors', errors: REGISTER_FIELD_ERRORS };
      case 'offline':
        return { kind: 'offline' };
      case 'ok':
        this.account.set({ id: 'new', name: displayName.trim(), role: 'mentee', method: 'email' });
        return { kind: 'ok' };
    }
  }

  signOut(): void {
    this.account.set(null);
    this.navigate('s01');
  }

  /** Scenario 6: unknown or expired session is treated as signed out. */
  expireSession(): void {
    this.account.set(null);
    this.#enforceCurrent();
  }

  /** Scenario 5. */
  toggleOperatorRemoved(): void {
    this.operatorRemoved.update((removed) => !removed);
    this.#enforceCurrent();
  }

  /** Scenario 8 (deep link) and 7 (other role's route): open a protected screen directly. */
  openRoute(id: ScreenId, signedOut: boolean): void {
    if (signedOut) this.account.set(null);
    this.navigate(id);
  }

  /** Where /home sends the person now: the route they asked for if their role owns it, else their role's home. */
  resolveHome(): ScreenId {
    const role = this.effectiveRole();
    const wanted = this.returnTo();
    this.returnTo.set(null);
    if (!role) return 's08';
    return wanted && ROLE_BY_SCREEN[wanted] === role ? wanted : HOME_SCREEN_BY_ROLE[role];
  }

  #gate(target: ScreenId): ScreenId {
    const role = this.effectiveRole();
    if (role && SIGNED_OUT_ONLY_SCREENS.includes(target)) return 's03';
    const required = ROLE_BY_SCREEN[target];
    if (!required && target !== 's03') return target;
    if (!role) {
      this.returnTo.set(target);
      return 's08';
    }
    return !required || role === required ? target : 's07';
  }

  #enforceCurrent(): void {
    const current = this.current();
    if (!current) return;
    const allowed = this.#gate(current);
    if (allowed !== current) this.#dispatch(allowed);
  }

  #dispatch(id: ScreenId): void {
    document.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail: id }));
  }
}
