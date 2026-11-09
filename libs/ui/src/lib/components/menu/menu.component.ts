import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Menu } from 'primeng/menu';
import { ButtonComponent } from '../button/button.component';
import type { MenuEntry } from './menu.model';

/**
 * A button that opens a menu of actions (PrimeNG `p-menu`, popup). Arrow keys move, Enter
 * activates, Esc closes and returns focus to the button. For choosing a value use a select.
 */
@Component({
  selector: 'ui-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Menu, ButtonComponent],
  template: `
    <button
      ui-button
      variant="quiet"
      type="button"
      aria-haspopup="menu"
      [attr.aria-expanded]="expanded()"
      (click)="toggle($event)"
    >
      {{ label() }}
      <i class="pi pi-chevron-down" aria-hidden="true"></i>
    </button>
    <p-menu
      #menu
      [model]="items()"
      [popup]="true"
      [appendTo]="appendTo()"
      (onShow)="expanded.set(true)"
      (onHide)="expanded.set(false)"
    />
  `,
})
export class MenuComponent {
  readonly label = input.required<string>();
  readonly entries = input.required<readonly MenuEntry[]>();
  readonly appendTo = input<string>('body');

  protected readonly expanded = signal(false);
  /** PrimeNG wants a mutable array. */
  protected readonly items = computed(() => [...this.entries()]);
  private readonly menu = viewChild.required<Menu>('menu');

  protected toggle(event: Event): void {
    this.menu().toggle(event);
  }
}
