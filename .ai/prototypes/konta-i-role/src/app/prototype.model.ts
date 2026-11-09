import type { Role } from '@org/ui';

/** Fixed demo clock: same value as libs/ui/.storybook/blocks/sample-data.ts. */
export const NOW = '2026-11-04T10:00:00Z';

export type SignInMethod = 'github' | 'email';

export interface DemoAccount {
  readonly id: string;
  readonly name: string;
  readonly role: Role;
  readonly method: SignInMethod;
  /** Fictitious address on a reserved domain (RFC 2606). */
  readonly email?: string;
}

/** Demo accounts from the screen map, section 3. One role per account (spec Q7). */
export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  { id: 'ada', name: 'Ada Lovelace', role: 'mentee', method: 'github' },
  {
    id: 'grace',
    name: 'Grace Hopper',
    role: 'mentee',
    method: 'email',
    email: 'grace.hopper@example.com',
  },
  { id: 'linus', name: 'Linus Torvalds', role: 'mentor', method: 'github' },
  { id: 'oliwia', name: 'Oliwia (founder A)', role: 'operator', method: 'github' },
];

export const DEFAULT_EMAIL_ACCOUNT_ID = 'grace';
export const SIMULATED_DELAY_MS = 450;
export const ROLE_REDIRECT_DELAY_MS = 600;

/** Screen ids come from lekcja-07/mapa-ekranow.md and never change. */
export type ScreenId =
  | 's01' | 's02' | 's03' | 's04' | 's05' | 's06' | 's07' | 's08' | 's09';

export interface ScreenInfo {
  readonly id: ScreenId;
  readonly title: string;
  readonly route: string;
  readonly stories: string;
}

export const SCREENS: readonly ScreenInfo[] = [
  { id: 's09', title: 'Mentor invitation', route: '/invite', stories: 'E02-S01 (outside Epic 01), R07/D08' },
  { id: 's01', title: 'Sign in', route: '/sign-in', stories: 'E01-S01 (#17), E01-S02 (#18)' },
  { id: 's02', title: 'Create account with email', route: '/sign-in (register view)', stories: 'E01-S02 (#18)' },
  { id: 's03', title: 'Role home resolver', route: '/home', stories: 'E01-S01 (#17)' },
  { id: 's04', title: 'Mentee home', route: '/mentee', stories: 'E01-S01 (#17)' },
  { id: 's05', title: 'Mentor home', route: '/mentor', stories: 'E01-S03 (#19)' },
  { id: 's06', title: 'Operator home', route: '/operator', stories: 'E01-S03 (#19)' },
  { id: 's07', title: 'No access (403)', route: '(other role’s route)', stories: 'E01-S03 (#19)' },
  { id: 's08', title: 'Signed out on a protected route', route: '/sign-in?returnTo=', stories: 'E01-S03 (#19)' },
];

export const HOME_SCREEN_BY_ROLE: Readonly<Record<Role, ScreenId>> = {
  mentee: 's04',
  mentor: 's05',
  operator: 's06',
};

export const NAVIGATE_EVENT = 'prototype:navigate';
export const SCREEN_CHANGE_EVENT = 'prototype:screen-change';

/** Review-bar scenario controls (map section 2). They are not product features. */
export type GithubScenario = 'ada' | 'linus' | 'oliwia' | 'denied' | 'unavailable';
export type EmailScenario = 'ok' | '401' | '429' | 'offline';
export type RegisterScenario = 'ok' | '409' | 'field-errors' | '429' | 'offline';

export interface ScenarioOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

export const GITHUB_SCENARIOS: readonly ScenarioOption<GithubScenario>[] = [
  { value: 'ada', label: 'Sukces: nowy mentee (Ada)' },
  { value: 'linus', label: 'Sukces: mentor (Linus)' },
  { value: 'oliwia', label: 'Sukces: operator z allowlisty (Oliwia)' },
  { value: 'denied', label: 'Odmowa użytkownika' },
  { value: 'unavailable', label: 'GitHub niedostępny (5xx/sieć)' },
];
export const EMAIL_SCENARIOS: readonly ScenarioOption<EmailScenario>[] = [
  { value: 'ok', label: 'Dobre dane' },
  { value: '401', label: 'Złe hasło / nieznany e-mail (401)' },
  { value: '429', label: 'Limit prób (429)' },
  { value: 'offline', label: 'Offline' },
];
export const REGISTER_SCENARIOS: readonly ScenarioOption<RegisterScenario>[] = [
  { value: 'ok', label: 'Sukces' },
  { value: '409', label: 'E-mail już istnieje (409)' },
  { value: 'field-errors', label: 'Błędy pól z serwera (400)' },
  { value: '429', label: 'Limit prób (429)' },
  { value: 'offline', label: 'Offline' },
];

/** The role each protected screen belongs to. */
export const ROLE_BY_SCREEN: Readonly<Partial<Record<ScreenId, Role>>> = {
  s04: 'mentee',
  s05: 'mentor',
  s06: 'operator',
};
/** Signed-in people are sent to /home from these (spec: s01 redirects a signed-in user). */
export const SIGNED_OUT_ONLY_SCREENS: readonly ScreenId[] = ['s01', 's02'];
export const OPERATOR_ACCOUNT_ID = 'oliwia';

/** Same wording for a wrong password and an unknown email (spec: 401). */
export const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password.';
/** Wording of the rate-limit message is open (SPEC-3); design-system gap DS-3 (no `rate-limited` outcome). */
export const RATE_LIMIT_MESSAGE = 'Too many attempts. Try again in 15 minutes.';
/** Generic on purpose: does not say the email exists (spec: 409). */
export const REGISTER_CONFLICT_MESSAGE = 'We could not create this account.';
export const REGISTER_FIELD_ERRORS: Readonly<Record<string, string>> = {
  email: 'Enter an email like name@example.com.',
  password: 'Use 12 to 128 characters.',
};

export interface ScreenNote {
  readonly stories: string;
  readonly simulated: string;
  readonly open: string;
}

/** Notes under every screen (shown outside presentation mode): stories, what is simulated, what is not decided. */
export const SCREEN_NOTES: Readonly<Record<ScreenId, ScreenNote>> = {
  s09: {
    stories: 'E02-S01 (poza Epikiem 01), R07/D08, R17/D18. Dodany do mapy na decyzję właściciela produktu.',
    simulated: 'Zaproszenie jest udawane: nie ma tokenu ani sprawdzania ważności. „Przyjmij” prowadzi do logowania, „odrzuć” i „nie mam zaproszenia” tylko pokazują widok.',
    open: 'Co dzieje się po przyjęciu (konto mentora powstaje dopiero po logowaniu) należy do E02-S01. Luka DS-5: „odrzuć” i „nie mam zaproszenia” to prototypowe składanie z tokenów.',
  },
  s01: {
    stories: 'E01-S01 (#17), E01-S02 (#18).',
    simulated: 'GitHub i logowanie mailem są udawane. Wynik wybiera pasek scenariuszy. Prawdziwe hasło nigdzie nie jest sprawdzane ani zapisywane.',
    open: 'SPEC-3: treść i zachowanie przycisku przy limicie prób (429). DS-3: design system nie ma wyniku „rate-limited”, więc 401 i 429 idą jako błąd formularza.',
  },
  s02: {
    stories: 'E01-S02 (#18).',
    simulated: 'Konto nie powstaje, hasło nie jest przechowywane. Nowe konto jest zawsze mentee (R07).',
    open: 'DS-1: brak panelu rejestracji w design systemie; złożony z pól i przycisków. SPEC-1: weryfikacja maila jest poza zakresem 1.0 (Q6), więc jej nie ma.',
  },
  s03: {
    stories: 'E01-S01 (#17).',
    simulated: 'W produkcie to przekierowanie po stronie serwera bez ekranu; tu widać je przez ułamek sekundy.',
    open: 'SPEC-4: czy klient kiedykolwiek renderuje ten ekran.',
  },
  s04: {
    stories: 'E01-S01 (#17).',
    simulated: 'Wylogowanie czyści tylko stan prototypu. Imię pochodzi z konta demo.',
    open: 'Pełny dom mentee (lista sesji) należy do E03/E04 (DS-4).',
  },
  s05: {
    stories: 'E01-S03 (#19).',
    simulated: 'Rola mentora pochodzi z konta demo; w produkcie nadaje ją zaproszenie (E02-S01).',
    open: 'DS-2: brak historii Storybooka dla domu mentora; komponenty są te same co w s04.',
  },
  s06: {
    stories: 'E01-S03 (#19).',
    simulated: 'Operator wynika z „allowlisty”, którą przełącza pasek scenariuszy. W produkcie to zmienna środowiskowa, bez ścieżki w UI.',
    open: 'DS-2: brak historii Storybooka dla domu operatora.',
  },
  s07: {
    stories: 'E01-S03 (#19).',
    simulated: 'Kod 403 nie istnieje, to tylko ekran. Trafia tu zalogowana osoba na trasie innej roli.',
    open: 'Tekst „write to the operators” pochodzi z design systemu; spec nie mówi, do kogo i jak.',
  },
  s08: {
    stories: 'E01-S03 (#19).',
    simulated: 'W produkcie to przekierowanie na /sign-in?returnTo=. Prototyp zatrzymuje się tu, żeby było widać, dokąd by prowadziło.',
    open: 'SPEC-2: czy ten ekran kiedykolwiek jest widoczny dla użytkownika.',
  },
};
