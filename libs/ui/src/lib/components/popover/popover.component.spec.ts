import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Popover } from 'primeng/popover';
import { PopoverComponent } from './popover.component';

@Component({
  imports: [PopoverComponent],
  template: `<ui-popover label="How booking works" appendTo="self"
    ><p>Two hours ahead.</p></ui-popover
  >`,
})
class HostComponent {}

describe('PopoverComponent', () => {
  it('is a labelled button that opens the panel', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const trigger = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLButtonElement;
    const panel = fixture.debugElement.query(
      (d) => d.componentInstance instanceof Popover,
    ).componentInstance as Popover;
    const toggle = vi.spyOn(panel, 'toggle');
    trigger.click();

    expect(trigger.textContent?.trim()).toBe('How booking works');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
