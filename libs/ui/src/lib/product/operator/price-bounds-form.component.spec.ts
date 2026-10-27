import { TestBed } from '@angular/core/testing';
import { PriceBoundsFormComponent } from './price-bounds-form.component';

function type(root: HTMLElement, id: string, value: string): void {
  const input = root.querySelector<HTMLInputElement>(
    `#${id}`,
  ) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

describe('PriceBoundsFormComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(PriceBoundsFormComponent);
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
    const fill = (values: Record<string, string>) => {
      for (const [id, value] of Object.entries(values)) type(root, id, value);
    };
    return { root, saved, save, fill };
  }

  it('asks for every number', async () => {
    const { root, saved, save } = await render();
    await save();

    expect(root.querySelectorAll('[role="alert"]')).toHaveLength(5);
    expect(saved).not.toHaveBeenCalled();
  });

  it('rejects a highest price below the lowest, and a fee above 100', async () => {
    const { root, saved, save, fill } = await render();
    fill({
      'pb-min25': '30',
      'pb-max25': '20',
      'pb-min50': '40',
      'pb-max50': '30',
      'pb-fee': '120',
    });
    await save();

    expect(root.textContent).toContain(
      'The highest price cannot be below the lowest.',
    );
    expect(root.textContent).toContain('The fee is a percentage up to 100.');
    expect(saved).not.toHaveBeenCalled();
  });

  it('rejects text and negative numbers', async () => {
    const { root, save, fill } = await render();
    fill({
      'pb-min25': 'abc',
      'pb-max25': '-1',
      'pb-min50': '40',
      'pb-max50': '90',
      'pb-fee': '20',
    });
    await save();

    expect(root.querySelector('#pb-min25-error')?.textContent).toContain(
      'Enter a number',
    );
    expect(root.querySelector('#pb-max25-error')?.textContent).toContain(
      'Enter a number',
    );
  });

  it('saves valid bounds and a fee, accepting a decimal comma', async () => {
    const { saved, save, fill } = await render();
    fill({
      'pb-min25': '15',
      'pb-max25': '150',
      'pb-min50': '25',
      'pb-max50': '300',
      'pb-fee': '12,5',
    });
    await save();

    expect(saved).toHaveBeenCalledWith({
      min25: 15,
      max25: 150,
      min50: 25,
      max50: 300,
      feePercent: 12.5,
    });
  });
});
