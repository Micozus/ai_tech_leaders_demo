import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RadioComponent, RadioGroupComponent } from './radio-group.component';

@Component({
  imports: [RadioGroupComponent, RadioComponent],
  template: `
    <fieldset ui-radio-group>
      <legend>Session length</legend>
      <label ui-radio
        ><input type="radio" name="length" value="25" /> 25 minutes</label
      >
      <label ui-radio
        ><input type="radio" name="length" value="50" /> 50 minutes</label
      >
    </fieldset>
  `,
})
class HostComponent {}

describe('RadioGroupComponent', () => {
  it('is a native fieldset with a legend and two row-sized radios', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const group = root.querySelector('fieldset') as HTMLFieldSetElement;
    const labels = Array.from(root.querySelectorAll('label'));

    expect(group.querySelector('legend')?.textContent).toBe('Session length');
    expect(group.className).toContain('border-0');
    expect(labels).toHaveLength(2);
    expect(labels[0].className).toContain('min-h-control-sm');
    labels[1].click();
    expect(
      (root.querySelectorAll('input')[1] as HTMLInputElement).checked,
    ).toBe(true);
  });
});
