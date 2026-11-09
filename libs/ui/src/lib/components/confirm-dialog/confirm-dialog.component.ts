import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import type { ButtonVariant } from '../button/button.model';
import { DialogComponent } from '../dialog/dialog.component';

/**
 * Asks before something that cannot be undone. The question names the object, the way out is the
 * first button and takes focus, and the confirming button says what it does ("Cancel booking"),
 * never "OK".
 */
@Component({
  selector: 'ui-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogComponent, ButtonComponent],
  template: `
    <ui-dialog
      [heading]="heading()"
      [(open)]="open"
      [appendTo]="appendTo()"
      (shown)="focusWayOut()"
    >
      <p class="text-body">
        <strong>{{ objectName() }}</strong>
      </p>
      @if (description(); as text) {
        <p class="mt-group text-body text-muted">{{ text }}</p>
      }
      <div uiDialogFooter class="flex flex-wrap justify-end gap-group">
        <button
          #wayOut
          ui-button
          variant="quiet"
          type="button"
          (click)="cancel()"
        >
          {{ cancelLabel() }}
        </button>
        <button
          ui-button
          [variant]="confirmVariant()"
          type="button"
          (click)="confirm()"
        >
          {{ confirmLabel() }}
        </button>
      </div>
    </ui-dialog>
  `,
})
export class ConfirmDialogComponent {
  readonly heading = input.required<string>();
  readonly objectName = input.required<string>();
  readonly confirmLabel = input.required<string>();
  readonly description = input('');
  readonly cancelLabel = input('Keep it');
  readonly confirmVariant = input<ButtonVariant>('danger');
  readonly appendTo = input<string>('body');
  readonly open = model(false);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private readonly wayOut = viewChild.required('wayOut', { read: ElementRef });

  /** The way out takes focus, so a stray Enter cannot destroy anything (WCAG 3.3.4). */
  protected focusWayOut(): void {
    const button: HTMLElement = this.wayOut().nativeElement;
    button.focus();
  }

  protected confirm(): void {
    this.open.set(false);
    this.confirmed.emit();
  }

  protected cancel(): void {
    this.open.set(false);
    this.cancelled.emit();
  }
}
