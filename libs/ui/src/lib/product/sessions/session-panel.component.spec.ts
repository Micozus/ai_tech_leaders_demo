import { TestBed } from '@angular/core/testing';
import {
  SessionPanelComponent,
  type SessionMessage,
} from './session-panel.component';

const MESSAGES: readonly SessionMessage[] = [
  {
    id: '1',
    author: 'Maciej',
    at: '14:03',
    text: 'My generics error:\nType instantiation is excessively deep.',
  },
  {
    id: '2',
    author: 'Ada Lovelace',
    at: '14:11',
    text: 'Constrain the parameter first.',
  },
];

describe('SessionPanelComponent', () => {
  async function render(
    options: {
      state?: 'loading' | 'empty' | 'error' | 'ready';
      canWrite?: boolean;
    } = {},
  ) {
    const fixture = TestBed.createComponent(SessionPanelComponent);
    fixture.componentRef.setInput('messages', MESSAGES);
    if (options.state) fixture.componentRef.setInput('state', options.state);
    if (options.canWrite !== undefined)
      fixture.componentRef.setInput('canWrite', options.canWrite);
    const sent = vi.fn();
    fixture.componentInstance.sent.subscribe(sent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const area = root.querySelector('textarea') as HTMLTextAreaElement;
    const write = (text: string) => {
      area.value = text;
      area.dispatchEvent(new Event('input'));
    };
    return { fixture, root, sent, area, write };
  }

  it('says first that sessions are text only, then shows author and time on every message', async () => {
    const { root } = await render();
    const items = root.querySelectorAll('li');

    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Sessions are text only',
    );
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('Maciej · 14:03');
    expect(items[1].textContent).toContain('Ada Lovelace · 14:11');
  });

  it('sends a message with the button and clears the composer', async () => {
    const { fixture, root, sent, area, write } = await render();
    write('  Thanks, that works.  ');
    await fixture.whenStable();
    (root.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { cancelable: true }),
    );
    await fixture.whenStable();

    expect(sent).toHaveBeenCalledWith('Thanks, that works.');
    expect(area.value).toBe('');
  });

  it('sends with Ctrl+Enter or Cmd+Enter, but not with Enter alone', async () => {
    const { area, sent, write } = await render();
    write('one');
    area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(sent).not.toHaveBeenCalled();
    area.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true }),
    );
    write('two');
    area.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', metaKey: true }),
    );
    area.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }),
    );

    expect(sent.mock.calls.map((c) => c[0])).toEqual(['one', 'two']);
  });

  it('ignores an empty message', async () => {
    const { root, sent, write } = await render();
    write('   ');
    (root.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { cancelable: true }),
    );

    expect(sent).not.toHaveBeenCalled();
  });

  it('does not let a closed session be written to, and says why', async () => {
    const { root, area, sent, write } = await render({ canWrite: false });
    write('late');
    (root.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { cancelable: true }),
    );

    expect(area.disabled).toBe(true);
    expect(root.textContent).toContain('The session has ended');
    expect(sent).not.toHaveBeenCalled();
  });

  it('shows the data states and a retry on error', async () => {
    expect(
      (await render({ state: 'loading' })).root.querySelector(
        '[aria-busy="true"]',
      ),
    ).not.toBeNull();
    expect((await render({ state: 'empty' })).root.textContent).toContain(
      'No messages yet',
    );
    const error = await render({ state: 'error' });
    const retried = vi.fn();
    error.fixture.componentInstance.retry.subscribe(retried);
    (
      Array.from(error.root.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Try again'),
      ) as HTMLButtonElement
    ).click();
    expect(retried).toHaveBeenCalledTimes(1);
  });
});
