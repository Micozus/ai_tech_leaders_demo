import { TestBed } from '@angular/core/testing';
import type { MentorSummary } from '../models/product.model';
import { MentorListComponent } from './mentor-list.component';

const MENTORS: readonly MentorSummary[] = [
  {
    id: 'a',
    name: 'Ada Lovelace',
    publicWorkUrl: 'https://github.com/ada',
    tags: ['TypeScript', 'React'],
    priceFrom: '€25.00',
  },
  {
    id: 'g',
    name: 'Grace Hopper',
    publicWorkUrl: 'https://github.com/grace',
    tags: ['Python'],
    priceFrom: '€30.00',
  },
];

describe('MentorListComponent', () => {
  async function render(
    mentors: readonly MentorSummary[] = MENTORS,
    state?: 'loading' | 'error' | 'ready',
  ) {
    const fixture = TestBed.createComponent(MentorListComponent);
    fixture.componentRef.setInput('mentors', mentors);
    if (state) fixture.componentRef.setInput('state', state);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }
  const tag = async (
    fixture: { whenStable(): Promise<unknown> },
    root: HTMLElement,
    name: string,
  ) => {
    (
      Array.from(root.querySelectorAll('label'))
        .find((l) => l.textContent?.includes(name))
        ?.querySelector('input') as HTMLInputElement
    ).click();
    await fixture.whenStable();
  };

  it('lists every mentor with a count when no filter is set', async () => {
    const { root } = await render();

    expect(root.querySelectorAll('article')).toHaveLength(2);
    expect(root.querySelector('[role="status"]')?.textContent?.trim()).toBe(
      '2 mentors',
    );
  });

  it('filters by stack tag and updates the count', async () => {
    const { fixture, root } = await render();
    await tag(fixture, root, 'Python');

    expect(root.querySelectorAll('article')).toHaveLength(1);
    expect(root.textContent).toContain('Grace Hopper');
    expect(root.querySelector('[role="status"]')?.textContent?.trim()).toBe(
      '1 mentor',
    );
  });

  it('says nothing matches the filters and offers to clear them', async () => {
    const { fixture, root } = await render([MENTORS[0]]);
    await tag(fixture, root, 'Python');

    expect(root.textContent).toContain('No mentors for these filters');
    (
      Array.from(root.querySelectorAll('button'))
        .filter((b) => b.textContent?.includes('Clear filters'))
        .pop() as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    expect(fixture.componentInstance.selected()).toEqual([]);
    expect(root.querySelectorAll('article')).toHaveLength(1);
  });

  it('says there are no mentors yet when the list itself is empty', async () => {
    const { root } = await render([]);

    expect(root.textContent).toContain('No mentors yet');
  });

  it('shows loading, and an error with a retry', async () => {
    expect(
      (await render(MENTORS, 'loading')).root.querySelector(
        '[aria-busy="true"]',
      ),
    ).not.toBeNull();
    const error = await render(MENTORS, 'error');
    const retried = vi.fn();
    error.fixture.componentInstance.retry.subscribe(retried);
    (
      Array.from(error.root.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Try again'),
      ) as HTMLButtonElement
    ).click();
    expect(retried).toHaveBeenCalledTimes(1);
  });

  it('reports which mentor is opened', async () => {
    const { fixture, root } = await render();
    const opened = vi.fn();
    fixture.componentInstance.view.subscribe(opened);
    (
      Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('View mentor'),
      ) as HTMLButtonElement
    ).click();

    expect(opened).toHaveBeenCalledWith('a');
  });
});
