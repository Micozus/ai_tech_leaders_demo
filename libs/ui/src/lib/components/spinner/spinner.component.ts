import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', 'aria-label': 'Loading' },
  template: `<span
    class="inline-block size-4 animate-spin rounded-full border-2 border-accent-300 border-t-accent"
  ></span>`,
})
export class SpinnerComponent {}
