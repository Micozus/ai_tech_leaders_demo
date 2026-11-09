import { TestBed } from '@angular/core/testing';
import { PrototypeState } from './prototype-state.service';
import { RootComponent } from './root.component';
import {
  NAVIGATE_EVENT,
  SCREENS,
  SCREEN_CHANGE_EVENT,
  type ScreenId,
} from './prototype.model';

/** Stands in for the review engine: answers a navigate request with a screen-change event. */
function fakeEngine(initial: ScreenId): { visited: ScreenId[]; stop: () => void } {
  const visited: ScreenId[] = [];
  const onNavigate = (event: Event) => {
    const id = (event as CustomEvent<ScreenId>).detail;
    visited.push(id);
    document.dispatchEvent(new CustomEvent(SCREEN_CHANGE_EVENT, { detail: id }));
  };
  document.addEventListener(NAVIGATE_EVENT, onNavigate);
  return { visited, stop: () => document.removeEventListener(NAVIGATE_EVENT, onNavigate) };
}

describe('screen map', () => {
  it('renders every screen of the map, once, with the map ids', () => {
    const fixture = TestBed.createComponent(RootComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const ids = Array.from(root.querySelectorAll('.screen')).map((node) => node.id);
    expect(ids.sort()).toEqual(SCREENS.map((screen) => screen.id).sort());
    expect(ids).toHaveLength(9);
    root.querySelectorAll('.screen').forEach((node) => {
      expect(node.querySelector('.frame'), node.id).not.toBeNull();
    });
  });
});

describe('navigation gates', () => {
  let engine: ReturnType<typeof fakeEngine>;
  let state: PrototypeState;

  beforeEach(() => {
    state = TestBed.inject(PrototypeState);
    engine = fakeEngine('s09');
  });
  afterEach(() => engine.stop());

  it('sends a signed-out visitor from a protected route to s08 and remembers the route', () => {
    state.navigate('s05');
    expect(engine.visited).toEqual(['s08']);
    expect(state.returnTo()).toBe('s05');
  });

  it('lands on the requested route after sign-in when the role owns it', async () => {
    state.navigate('s05');
    state.githubScenario.set('linus');
    await state.signInWithGithub();
    expect(state.resolveHome()).toBe('s05');
  });

  it('lands on the role home when the requested route belongs to another role', async () => {
    state.navigate('s06');
    await state.signInWithGithub();
    expect(state.resolveHome()).toBe('s04');
  });

  it('shows the 403 screen to a signed-in person on another role’s route', async () => {
    await state.signInWithGithub();
    engine.visited.length = 0;
    state.navigate('s05');
    expect(engine.visited).toEqual(['s07']);
  });

  it('sends a signed-in person from sign-in to /home', async () => {
    await state.signInWithGithub();
    engine.visited.length = 0;
    state.navigate('s01');
    expect(engine.visited).toEqual(['s03']);
  });

  it('demotes a founder removed from the allowlist at once, mid-session', async () => {
    state.githubScenario.set('oliwia');
    await state.signInWithGithub();
    state.navigate('s06');
    state.toggleOperatorRemoved();
    expect(engine.visited.at(-1)).toBe('s07');
    expect(state.effectiveRole()).toBe('mentee');
  });

  it('treats an expired session as signed out', async () => {
    await state.signInWithGithub();
    state.navigate('s04');
    state.expireSession();
    expect(engine.visited.at(-1)).toBe('s08');
    expect(state.returnTo()).toBe('s04');
  });

  it('redirects a stale protected screen reached by Back', () => {
    document.dispatchEvent(new CustomEvent(SCREEN_CHANGE_EVENT, { detail: 's04' }));
    expect(engine.visited).toEqual(['s08']);
  });

  it('openRoute signs out first for a deep link', async () => {
    await state.signInWithGithub();
    state.openRoute('s05', true);
    expect(state.account()).toBeNull();
    expect(engine.visited.at(-1)).toBe('s08');
  });
});

describe('sign-in scenarios', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  async function run<T>(promise: Promise<T>): Promise<T> {
    await vi.advanceTimersByTimeAsync(1000);
    return promise;
  }

  it('gives the same 401 for any bad credentials and keeps the session empty', async () => {
    const state = TestBed.inject(PrototypeState);
    state.emailScenario.set('401');
    const outcome = await run(state.signInWithEmail({ email: 'a@example.com', password: 'x' }));
    expect(outcome).toEqual({ kind: 'field-errors', errors: { form: 'Invalid email or password.' } });
    expect(state.account()).toBeNull();
  });

  it.each([
    ['429', 'field-errors'],
    ['offline', 'offline'],
    ['ok', 'ok'],
  ] as const)('email scenario %s', async (scenario, kind) => {
    const state = TestBed.inject(PrototypeState);
    state.emailScenario.set(scenario);
    const outcome = await run(state.signInWithEmail({ email: 'a@example.com', password: 'x' }));
    expect(outcome.kind).toBe(kind);
  });

  it.each([
    ['409', 'field-errors'],
    ['field-errors', 'field-errors'],
    ['429', 'field-errors'],
    ['offline', 'offline'],
    ['ok', 'ok'],
  ] as const)('register scenario %s', async (scenario, kind) => {
    const state = TestBed.inject(PrototypeState);
    state.registerScenario.set(scenario);
    const outcome = await run(state.register('Margaret'));
    expect(outcome.kind).toBe(kind);
    expect(state.account()?.name ?? null).toBe(scenario === 'ok' ? 'Margaret' : null);
  });

  it('GitHub denial or outage leaves no session and raises the banner', async () => {
    const state = TestBed.inject(PrototypeState);
    state.githubScenario.set('denied');
    await run(state.signInWithGithub());
    expect(state.githubFailed()).toBe(true);
    expect(state.account()).toBeNull();
  });
});
