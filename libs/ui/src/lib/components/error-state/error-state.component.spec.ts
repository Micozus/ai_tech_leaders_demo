import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ErrorStateComponent } from './error-state.component';

@Component({
  imports: [ErrorStateComponent],
  template: `<ui-error-state
    heading="Sessions did not load"
    [description]="description"
  >
    <button>Try again</button>
  </ui-error-state>`,
})
class HostComponent {
  description = '';
}

describe('ErrorStateComponent', () => {
  it('is announced as an alert with the heading and actions, description only when given', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('section')?.getAttribute('role')).toBe('alert');
    expect(root.querySelector('h3')?.textContent).toContain(
      'Sessions did not load',
    );
    expect(root.querySelector('button')?.textContent).toBe('Try again');
    expect(root.querySelector('p')).toBeNull();

    fixture.componentInstance.description =
      'Check your connection and try again.';
    fixture.componentRef.changeDetectorRef.markForCheck();
    await fixture.whenStable();

    expect(root.querySelector('p')?.textContent).toBe(
      'Check your connection and try again.',
    );
  });
});
