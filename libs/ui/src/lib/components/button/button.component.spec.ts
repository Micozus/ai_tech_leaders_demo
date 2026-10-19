import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import type { ButtonSize, ButtonVariant } from './button.model';

@Component({
  imports: [ButtonComponent],
  template: `
    <button
      ui-button
      [variant]="variant()"
      [size]="size()"
      [block]="block()"
      [loading]="loading()"
    >
      Save
    </button>
    <a ui-button href="/x">Link</a>
  `,
})
class HostComponent {
  readonly variant = signal<ButtonVariant>('primary');
  readonly size = signal<ButtonSize>('md');
  readonly block = signal(false);
  readonly loading = signal(false);
}

describe('ButtonComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const button = root.querySelector('button') as HTMLButtonElement;
    return { fixture, root, button };
  }

  it('renders primary and medium by default, without busy state', async () => {
    const { button, root } = await render();

    expect(button.className).toContain('bg-accent');
    expect(button.className).toContain('px-4');
    expect(button.className).not.toContain('w-full');
    expect(button.getAttribute('aria-busy')).toBeNull();
    expect(button.querySelector('ui-spinner')).toBeNull();
    expect(root.querySelector('a')?.className).toContain('bg-accent');
  });

  it('applies the chosen variant, size and block width', async () => {
    const { fixture, button } = await render();
    fixture.componentInstance.variant.set('danger');
    fixture.componentInstance.size.set('sm');
    fixture.componentInstance.block.set(true);
    await fixture.whenStable();

    expect(button.className).toContain('text-danger');
    expect(button.className).toContain('px-3');
    expect(button.className).toContain('w-full');
  });

  it('shows a spinner and marks itself busy while loading', async () => {
    const { fixture, button } = await render();
    fixture.componentInstance.loading.set(true);
    await fixture.whenStable();

    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('ui-spinner')).not.toBeNull();
    expect(button.className).toContain('pointer-events-none');
  });
});
