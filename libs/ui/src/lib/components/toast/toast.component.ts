import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Toast } from 'primeng/toast';

/**
 * Host for toasts: place one `ui-toast` per app, and register `provideToast()`. Toasts are for
 * short, non-critical confirmations ("Share link copied"). They vanish on their own, so an error
 * that needs action is never a toast (use an alert or an error state).
 */
@Component({
  selector: 'ui-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Toast],
  template: `<p-toast position="bottom-right" [life]="6000" />`,
})
export class ToastComponent {}
