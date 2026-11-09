import { TestBed } from '@angular/core/testing';
import type { Slot } from '../models/product.model';
import { SlotPickerComponent } from './slot-picker.component';

const NOW = '2026-11-05T10:00:00Z';
const SLOTS: readonly Slot[] = [
  { id: 'soon', startsAt: '2026-11-05T11:00:00Z', state: 'free' },
  { id: 'booked', startsAt: '2026-11-05T15:00:00Z', state: 'booked' },
  { id: 'ok', startsAt: '2026-11-06T09:00:00Z', state: 'free' },
];

describe('SlotPickerComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(SlotPickerComponent);
    fixture.componentRef.setInput('slots', SLOTS);
    fixture.componentRef.setInput('now', NOW);
    fixture.componentRef.setInput('price25', 25);
    fixture.componentRef.setInput('price50', 45);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('shows the prices of both lengths with 50 minutes chosen first', async () => {
    const { fixture, root } = await render();

    expect(root.textContent).toContain('25 minutes · €25.00');
    expect(root.textContent).toContain('50 minutes · €45.00');
    expect(fixture.componentInstance.length()).toBe(50);
  });

  it('disables a slot under two hours away and a booked slot, and says why', async () => {
    const { root } = await render();
    const radios = Array.from(
      root.querySelectorAll<HTMLInputElement>('input[name="sp-slot"]'),
    );

    expect(radios.map((r) => r.disabled)).toEqual([true, true, false]);
    expect(root.textContent).toContain('starts in less than 2 hours');
    expect(root.textContent).toContain('booked');
  });

  it('chooses a length and a slot', async () => {
    const { fixture, root } = await render();
    (root.querySelector('input[name="sp-length"]') as HTMLInputElement).click();
    (
      root.querySelectorAll('input[name="sp-length"]')[1] as HTMLInputElement
    ).click();
    (
      root.querySelectorAll('input[name="sp-length"]')[0] as HTMLInputElement
    ).click();
    (
      root.querySelectorAll('input[name="sp-slot"]')[2] as HTMLInputElement
    ).click();
    await fixture.whenStable();

    expect(fixture.componentInstance.length()).toBe(25);
    expect(fixture.componentInstance.selectedId()).toBe('ok');
  });
});
