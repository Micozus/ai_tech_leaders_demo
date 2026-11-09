import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Menu } from 'primeng/menu';
import { MenuComponent } from './menu.component';
import type { MenuEntry } from './menu.model';

const ENTRIES: readonly MenuEntry[] = [
  { label: 'Your profile', icon: 'pi-user' },
  { label: 'Sign out', icon: 'pi-sign-out' },
];

@Component({
  imports: [MenuComponent],
  template: `<ui-menu label="Account" [entries]="entries" appendTo="self" />`,
})
class HostComponent {
  readonly entries = ENTRIES;
}

describe('MenuComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      root,
      trigger: root.querySelector('button') as HTMLButtonElement,
    };
  }

  it('is a labelled button that announces a menu', async () => {
    const { trigger } = await render();

    expect(trigger.textContent).toContain('Account');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the menu from the button', async () => {
    const { fixture, trigger } = await render();
    const menu = fixture.debugElement.query(
      (d) => d.componentInstance instanceof Menu,
    ).componentInstance as Menu;
    const toggle = vi.spyOn(menu, 'toggle');
    trigger.click();

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('tracks whether the menu is shown', async () => {
    const { fixture, trigger } = await render();
    const menu = fixture.debugElement.query(
      (d) => d.componentInstance instanceof Menu,
    ).componentInstance as Menu;
    menu.onShow.emit();
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    menu.onHide.emit();
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
