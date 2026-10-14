import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

@Component({
  imports: [CardComponent],
  template: `<ui-card heading="Title"><p>Projected</p></ui-card>`,
})
class HostComponent {}

describe('CardComponent', () => {
  it('renders the heading and projected content', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.card__heading')?.textContent).toBe('Title');
    expect(element.querySelector('.card__body p')?.textContent).toBe(
      'Projected',
    );
  });
});
