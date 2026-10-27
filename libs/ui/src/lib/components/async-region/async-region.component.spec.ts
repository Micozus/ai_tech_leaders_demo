import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  AsyncRegionComponent,
  type AsyncState,
} from './async-region.component';

@Component({
  imports: [AsyncRegionComponent],
  template: `
    <ui-async-region
      [state]="state()"
      loadingLabel="Loading sessions"
      emptyHeading="No sessions yet"
      errorHeading="Sessions did not load"
    >
      <p id="content">Thursday 14:00</p>
      <button uiEmptyAction>Find a mentor</button>
      <button uiErrorAction>Try again</button>
    </ui-async-region>
  `,
})
class HostComponent {
  readonly state = signal<AsyncState>('ready');
}

describe('AsyncRegionComponent', () => {
  async function render(state: AsyncState) {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.state.set(state);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows the content when ready', async () => {
    const root = await render('ready');

    expect(root.querySelector('#content')?.textContent).toBe('Thursday 14:00');
    expect(root.querySelector('[role="status"]')).toBeNull();
  });

  it('shows a busy region with a status text and skeletons while loading', async () => {
    const root = await render('loading');

    expect(root.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(root.querySelector('[role="status"]')?.textContent?.trim()).toBe(
      'Loading sessions',
    );
    expect(root.querySelectorAll('ui-skeleton')).toHaveLength(3);
    expect(root.querySelector('#content')).toBeNull();
  });

  it('shows the empty state with its action', async () => {
    const root = await render('empty');

    expect(root.querySelector('h3')?.textContent).toBe('No sessions yet');
    expect(root.textContent).toContain('Find a mentor');
    expect(root.textContent).not.toContain('Try again');
  });

  it('shows the error state with its action as an alert', async () => {
    const root = await render('error');

    expect(root.querySelector('[role="alert"]')).not.toBeNull();
    expect(root.textContent).toContain('Sessions did not load');
    expect(root.textContent).toContain('Try again');
  });
});
