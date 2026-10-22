import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Tooltip } from 'primeng/tooltip';
import { TooltipDirective } from './tooltip.directive';

@Component({
  imports: [TooltipDirective],
  template: `<button uiTooltip="Copy the share link">Copy</button>`,
})
class HostComponent {}

describe('TooltipDirective', () => {
  it('shows on hover and on keyboard focus, with the given text', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const tooltip = fixture.debugElement.children[0].injector.get(Tooltip);

    expect(tooltip.getOption('tooltipEvent')).toBe('both');
    expect(tooltip.getOption('tooltipLabel')).toBe('Copy the share link');
  });
});
