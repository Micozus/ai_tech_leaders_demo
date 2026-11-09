import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

@Component({
  imports: [EmptyStateComponent],
  template: `<ui-empty-state heading="No sessions" [description]="description">
    <button>Find a mentor</button>
  </ui-empty-state>`,
})
class HostComponent {
  description = '';
}

describe('EmptyStateComponent', () => {
  it('shows the heading and actions, and the description only when given', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('h3')?.textContent).toBe('No sessions');
    expect(root.querySelector('button')?.textContent).toBe('Find a mentor');
    expect(root.querySelector('p')).toBeNull();

    fixture.componentInstance.description = 'Book your first one.';
    fixture.componentRef.changeDetectorRef.markForCheck();
    await fixture.whenStable();

    expect(root.querySelector('p')?.textContent).toBe('Book your first one.');
  });
});
