import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';

@Component({
  imports: [CheckboxComponent],
  template: `<label ui-checkbox><input type="checkbox" /> TypeScript</label>`,
})
class HostComponent {}

describe('CheckboxComponent', () => {
  it('makes the whole label the row and keeps the native checkbox', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const label = root.querySelector('label') as HTMLLabelElement;
    const box = root.querySelector('input') as HTMLInputElement;

    expect(label.className).toContain('min-h-control-sm');
    expect(label.className).toContain('cursor-pointer');
    expect(box.type).toBe('checkbox');
    label.click();
    expect(box.checked).toBe(true);
  });
});
