import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';

/**
 * A modal dialog (PrimeNG `p-dialog`, themed by the DevMentor preset). It traps focus, closes on
 * Esc and with its close button, and returns focus to what opened it. Every dialog has a footer
 * with a way to close it: project the actions with `uiDialogFooter`.
 */
@Component({
  selector: 'ui-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Dialog],
  template: `
    <p-dialog
      [header]="heading()"
      [visible]="open()"
      (visibleChange)="open.set($event)"
      (onShow)="shown.emit()"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closeOnEscape]="true"
      [dismissableMask]="false"
      [appendTo]="appendTo()"
      closeAriaLabel="Close"
      styleClass="w-dialog max-w-full"
    >
      <ng-content />
      <ng-template #footer
        ><ng-content select="[uiDialogFooter]"
      /></ng-template>
    </p-dialog>
  `,
})
export class DialogComponent {
  readonly heading = input.required<string>();
  readonly open = model(false);
  /** `body` in the app so the dialog sits above everything; `self` keeps it inside a test root. */
  readonly appendTo = input<string>('body');
  /** Emitted once the dialog is on screen: the place to move focus to a specific control. */
  readonly shown = output<void>();
}
