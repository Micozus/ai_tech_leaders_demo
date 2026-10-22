import { Directive, inject } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

/**
 * A short hint on hover and on keyboard focus (PrimeNG tooltip). It never carries information the
 * person needs to act: use text next to the control for that.
 * Usage: `<button ui-button uiTooltip="Copy link">`.
 */
@Directive({
  selector: '[uiTooltip]',
  hostDirectives: [
    { directive: Tooltip, inputs: ['pTooltip: uiTooltip', 'tooltipPosition'] },
  ],
})
export class TooltipDirective {
  constructor() {
    inject(Tooltip, { self: true }).setOption({ tooltipEvent: 'both' });
  }
}
