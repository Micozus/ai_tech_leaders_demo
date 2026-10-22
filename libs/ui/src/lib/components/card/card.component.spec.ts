import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

@Component({
  imports: [CardComponent],
  template: `
    <ui-card heading="Title"><p>Projected</p></ui-card>
    <ui-card heading="Roomy" density="roomy" [headingLevel]="3"
      ><p>Form</p></ui-card
    >
  `,
})
class HostComponent {}

describe('CardComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the heading and projected content in a dense panel by default', async () => {
    const element = await render();
    const [dense] = Array.from(element.querySelectorAll('section'));

    expect(element.querySelector('.card__heading')?.textContent?.trim()).toBe(
      'Title',
    );
    expect(element.querySelector('.card__body p')?.textContent).toBe(
      'Projected',
    );
    expect(dense.className).toContain('p-panel');
    expect(dense.className).not.toContain('p-panel-roomy');
    expect(
      element.querySelector('.card__heading')?.getAttribute('aria-level'),
    ).toBe('2');
  });

  it('can be roomy and take another heading level', async () => {
    const element = await render();
    const roomy = element.querySelectorAll('section')[1];

    expect(roomy.className).toContain('p-panel-roomy');
    expect(
      roomy.querySelector('.card__heading')?.getAttribute('aria-level'),
    ).toBe('3');
  });
});
