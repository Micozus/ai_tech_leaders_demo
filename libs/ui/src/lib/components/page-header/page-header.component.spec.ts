import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';

@Component({
  imports: [PageHeaderComponent],
  template: `<ui-page-header
    heading="Availability"
    [eyebrow]="eyebrow"
    [description]="description"
    ><button>Save</button></ui-page-header
  >`,
})
class HostComponent {
  eyebrow = '';
  description = '';
}

describe('PageHeaderComponent', () => {
  it('renders heading and actions, optional parts only when given', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('h1')?.textContent).toBe('Availability');
    expect(root.querySelector('button')?.textContent).toBe('Save');
    expect(root.querySelectorAll('p')).toHaveLength(0);

    fixture.componentInstance.eyebrow = 'Mentor';
    fixture.componentInstance.description = 'Publish your slots.';
    fixture.componentRef.changeDetectorRef.markForCheck();
    await fixture.whenStable();

    const texts = Array.from(root.querySelectorAll('p')).map(
      (p) => p.textContent,
    );
    expect(texts).toEqual(['Mentor', 'Publish your slots.']);
  });
});
