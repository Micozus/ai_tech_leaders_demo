import { TestBed } from '@angular/core/testing';
import { SlotPublisherComponent } from './slot-publisher.component';
import type { Slot } from '../models/product.model';

const SLOTS: readonly Slot[] = [
  { id: 'a', startsAt: '2026-11-05T13:00:00Z', state: 'free' },
  { id: 'b', startsAt: '2026-11-06T09:00:00Z', state: 'booked' },
];

describe('SlotPublisherComponent', () => {
  async function render(state?: 'loading' | 'empty' | 'error' | 'ready') {
    const fixture = TestBed.createComponent(SlotPublisherComponent);
    fixture.componentRef.setInput('slots', SLOTS);
    if (state) fixture.componentRef.setInput('state', state);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('lists slots with free or booked status and unpublish only for free ones', async () => {
    const { fixture, root } = await render();
    const unpublished = vi.fn();
    fixture.componentInstance.unpublish.subscribe(unpublished);
    const rows = root.querySelectorAll('li');
    (root.querySelector('li button') as HTMLButtonElement).click();

    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('Free');
    expect(rows[0].textContent).toContain('14:00');
    expect(rows[1].textContent).toContain('Booked');
    expect(rows[1].querySelector('button')).toBeNull();
    expect(unpublished).toHaveBeenCalledWith('a');
  });

  it('publishes a new slot only when date and time are given', async () => {
    const { fixture, root } = await render();
    const published = vi.fn();
    fixture.componentInstance.publish.subscribe(published);
    const form = root.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(published).not.toHaveBeenCalled();

    const date = root.querySelector('#sp-date') as HTMLInputElement;
    date.value = '2026-11-10';
    date.dispatchEvent(new Event('input'));
    const time = root.querySelector('#sp-time') as HTMLInputElement;
    time.value = '10:00';
    time.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(published).toHaveBeenCalledWith({
      date: '2026-11-10',
      time: '10:00',
    });
  });

  it('shows the data states and offers a retry on error', async () => {
    const empty = await render('empty');
    expect(empty.root.textContent).toContain('No slots yet');

    const loading = await render('loading');
    expect(loading.root.querySelector('[aria-busy="true"]')).not.toBeNull();

    const error = await render('error');
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
