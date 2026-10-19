import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Loading placeholder; the shimmer is a Tailwind `animate-pulse`. */
@Component({
  selector: 'ui-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `<span
    class="block animate-pulse rounded-sm bg-neutral-200"
    [style.width]="width()"
    [style.height]="height()"
  ></span>`,
})
export class SkeletonComponent {
  readonly width = input('100%');
  readonly height = input('1.0625rem');
}
