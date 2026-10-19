import { TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  it('is a polite status by default and an assertive alert when danger', async () => {
    const fixture = TestBed.createComponent(AlertComponent);
    await fixture.whenStable();
    const box = (fixture.nativeElement as HTMLElement).querySelector(
      'div',
    ) as HTMLElement;

    expect(box.getAttribute('role')).toBe('status');
    expect(box.className).toContain('bg-accent-50');

    fixture.componentRef.setInput('tone', 'danger');
    await fixture.whenStable();

    expect(box.getAttribute('role')).toBe('alert');
    expect(box.className).toContain('bg-danger-tint');
  });
});
