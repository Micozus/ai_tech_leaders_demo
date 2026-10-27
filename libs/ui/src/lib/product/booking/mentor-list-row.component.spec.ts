import { TestBed } from '@angular/core/testing';
import type { MentorSummary } from '../models/product.model';
import { MentorListRowComponent } from './mentor-list-row.component';

const MENTOR: MentorSummary = {
  id: 'm1',
  name: 'Ada Lovelace',
  publicWorkUrl: 'https://github.com/ada',
  tags: ['TypeScript', 'React'],
  priceFrom: '€25.00',
  nextSlot: 'Thu 5 Nov, 14:00',
};

describe('MentorListRowComponent', () => {
  async function render(mentor: MentorSummary) {
    const fixture = TestBed.createComponent(MentorListRowComponent);
    fixture.componentRef.setInput('mentor', mentor);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('shows who, tags, public work, price and next slot, and no rating', async () => {
    const { root } = await render(MENTOR);

    expect(root.querySelector('h3')?.textContent).toBe('Ada Lovelace');
    expect(root.textContent).toContain('TypeScript');
    expect(root.textContent).toContain('React');
    expect(root.querySelector('a')?.getAttribute('href')).toBe(
      'https://github.com/ada',
    );
    expect(root.textContent).toContain('From €25.00');
    expect(root.textContent).toContain('Next free slot: Thu 5 Nov, 14:00');
    expect(root.textContent?.toLowerCase()).not.toContain('rating');
  });

  it('says so when there is no free slot', async () => {
    const { root } = await render({ ...MENTOR, nextSlot: undefined });

    expect(root.textContent).toContain('No free slots now');
  });

  it('opens the mentor', async () => {
    const { fixture, root } = await render(MENTOR);
    const opened = vi.fn();
    fixture.componentInstance.view.subscribe(opened);
    (root.querySelector('button') as HTMLButtonElement).click();

    expect(opened).toHaveBeenCalledWith('m1');
  });
});
