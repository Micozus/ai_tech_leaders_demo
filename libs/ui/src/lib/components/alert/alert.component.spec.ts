import { TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  it('is a polite status with an info icon by default', async () => {
    const fixture = TestBed.createComponent(AlertComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const box = root.querySelector('div') as HTMLElement;

    expect(box.getAttribute('role')).toBe('status');
    expect(box.className).toContain('bg-surface-muted');
    expect(root.querySelector('i')?.className).toContain('pi-info-circle');
    expect(root.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('p')).toBeNull();
  });

  it('is an assertive alert with its own icon when danger, and shows a heading', async () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.componentRef.setInput('tone', 'danger');
    fixture.componentRef.setInput('heading', 'Payment failed');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('div')?.getAttribute('role')).toBe('alert');
    expect(root.querySelector('div')?.className).toContain('bg-danger-tint');
    expect(root.querySelector('i')?.className).toContain(
      'pi-exclamation-triangle',
    );
    expect(root.querySelector('p')?.textContent).toBe('Payment failed');
  });

  it('uses the check icon for success', async () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.componentRef.setInput('tone', 'success');
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('i')?.className,
    ).toContain('pi-check');
  });
});
