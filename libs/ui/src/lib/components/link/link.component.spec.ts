import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LinkComponent } from './link.component';

@Component({
  imports: [LinkComponent],
  template: `<a ui-link href="/rules">Cancellation rules</a>`,
})
class HostComponent {}

describe('LinkComponent', () => {
  it('styles a native anchor and keeps it an anchor', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const link = (fixture.nativeElement as HTMLElement).querySelector(
      'a',
    ) as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('/rules');
    expect(link.className).toContain('text-accent');
    expect(link.className).toContain('underline');
    expect(link.textContent).toBe('Cancellation rules');
  });
});
