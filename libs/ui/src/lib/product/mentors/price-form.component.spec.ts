import { TestBed } from '@angular/core/testing';
import { PriceFormComponent } from './price-form.component';

const BOUNDS = { min25: 15, max25: 150, min50: 25, max50: 300 };

function type(root: HTMLElement, id: string, value: string): void {
  const input = root.querySelector<HTMLInputElement>(
    `#${id}`,
  ) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

describe('PriceFormComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(PriceFormComponent);
    fixture.componentRef.setInput('bounds', BOUNDS);
    const saved = vi.fn();
    fixture.componentInstance.saved.subscribe(saved);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const save = async () => {
      (root.querySelector('form') as HTMLFormElement).dispatchEvent(
        new Event('submit', { cancelable: true }),
      );
      await fixture.whenStable();
    };
    return { root, saved, save };
  }

  it('shows the allowed range as a hint', async () => {
    const { root } = await render();

    expect(root.textContent).toContain('Between €15.00 and €150.00.');
    expect(root.textContent).toContain('Between €25.00 and €300.00.');
  });

  it('asks for a price and rejects one outside the bounds', async () => {
    const { root, saved, save } = await render();
    await save();
    expect(root.querySelector('#pf-25-error')?.textContent).toContain(
      'Enter the price for 25 minutes.',
    );

    type(root, 'pf-25', '200');
    type(root, 'pf-50', 'abc');
    await save();
    expect(root.querySelector('#pf-25-error')?.textContent).toContain(
      'must be between €15.00 and €150.00',
    );
    expect(root.querySelector('#pf-50-error')?.textContent).toContain(
      'Enter the price for 50 minutes.',
    );
    expect(saved).not.toHaveBeenCalled();
  });

  it('saves prices inside the bounds, accepting a decimal comma', async () => {
    const { root, saved, save } = await render();
    type(root, 'pf-25', '25,5');
    type(root, 'pf-50', '45');
    await save();

    expect(saved).toHaveBeenCalledWith({ price25: 25.5, price50: 45 });
  });
});
