import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Loading placeholder that pulses (decision Q-B) and is static under reduced motion. It is
 * hidden from assistive technology: the region that loads carries `aria-busy` and a status text.
 */
@Component({
  selector: 'ui-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `<span
    class="block animate-pulse rounded-control bg-line motion-reduce:animate-none"
    [style.width]="width()"
    [style.height]="height()"
  ></span>`,
})
export class SkeletonComponent {
  readonly width = input('100%');
  readonly height = input('1.0625rem');
}
