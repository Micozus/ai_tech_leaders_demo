import { TestBed } from '@angular/core/testing';
import type { MentorSummary } from '../models/product.model';
import {
  MentorDetailComponent,
  type MentorDetailState,
} from './mentor-detail.component';

const MENTOR: MentorSummary = {
  id: 'a',
  name: 'Ada Lovelace',
  publicWorkUrl: 'https://github.com/ada',
  tags: ['TypeScript'],
  priceFrom: '€25.00',
};

describe('MentorDetailComponent', () => {
  async function render(state: MentorDetailState, mentor?: MentorSummary) {
    const fixture = TestBed.createComponent(MentorDetailComponent);
    fixture.componentRef.setInput('state', state);
    fixture.componentRef.setInput('about', 'I mentor TypeScript.');
    if (mentor) fixture.componentRef.setInput('mentor', mentor);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('shows the name, tags, work and the main action first', async () => {
    const { fixture, root } = await render('ready', MENTOR);
    const booked = vi.fn();
    fixture.componentInstance.book.subscribe(booked);
    (root.querySelector('header button') as HTMLButtonElement).click();

    expect(root.querySelector('h1')?.textContent).toBe('Ada Lovelace');
    expect(root.textContent).toContain('TypeScript');
    expect(root.querySelector('a')?.getAttribute('href')).toBe(
      'https://github.com/ada',
    );
    expect(root.textContent).toContain('I mentor TypeScript.');
    expect(root.textContent).toContain('text sessions, 25 or 50 minutes');
    expect(booked).toHaveBeenCalledWith('a');
  });

  it('shows a busy region while loading, without the content', async () => {
    const { root } = await render('loading');

    expect(root.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(root.querySelector('h1')).toBeNull();
  });

  it('says the page does not exist or is not yours', async () => {
    const { root } = await render('not-found');

    expect(root.textContent).toContain('You do not have access to this page');
  });

  it('renders nothing but the region when ready without a mentor', async () => {
    const { root } = await render('ready');

    expect(root.querySelector('h1')).toBeNull();
  });
});
