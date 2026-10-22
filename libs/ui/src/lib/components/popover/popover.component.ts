import {
  ChangeDetectionStrategy,
  Component,
  input,
  viewChild,
} from '@angular/core';
import { Popover } from 'primeng/popover';
import { ButtonComponent } from '../button/button.component';

/**
 * A small panel of extra, optional explanation next to a button (PrimeNG `p-popover`). Nothing
 * the person needs to complete the task may live only in it: it can be missed.
 */
@Component({
  selector: 'ui-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Popover, ButtonComponent],
  template: `
    <button
      ui-button
      variant="ghost"
      type="button"
      aria-haspopup="dialog"
      (click)="toggle($event)"
    >
      {{ label() }}
    </button>
    <p-popover #panel [ariaLabel]="label()" [appendTo]="appendTo()">
      <ng-content />
    </p-popover>
  `,
})
export class PopoverComponent {
  readonly label = input.required<string>();
  readonly appendTo = input<string>('body');

  private readonly panel = viewChild.required<Popover>('panel');

  protected toggle(event: Event): void {
    this.panel().toggle(event);
  }
}
