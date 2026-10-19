import { TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  it('is neutral by default and switches tone', async () => {
    const fixture = TestBed.createComponent(BadgeComponent);
    await fixture.whenStable();
    const badge = (fixture.nativeElement as HTMLElement).querySelector(
      'span',
    ) as HTMLElement;

    expect(badge.className).toContain('bg-neutral-100');

    fixture.componentRef.setInput('tone', 'success');
    await fixture.whenStable();

    expect(badge.className).toContain('bg-success-tint');
  });
});
