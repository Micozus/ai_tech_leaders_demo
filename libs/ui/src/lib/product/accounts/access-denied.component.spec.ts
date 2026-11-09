import { TestBed } from '@angular/core/testing';
import { AccessDeniedComponent } from './access-denied.component';

describe('AccessDeniedComponent', () => {
  it('says the page is not theirs and links home', async () => {
    const fixture = TestBed.createComponent(AccessDeniedComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('You do not have access to this page');
    expect(root.querySelector('a')?.getAttribute('href')).toBe('/home');
    expect(root.querySelector('a')?.textContent).toContain('Go to your home');
  });

  it('sends a signed-out visitor to sign in', async () => {
    const fixture = TestBed.createComponent(AccessDeniedComponent);
    fixture.componentRef.setInput('reason', 'signed-out');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Sign in to open this page');
    expect(root.querySelector('a')?.getAttribute('href')).toBe('/sign-in');
  });
});
