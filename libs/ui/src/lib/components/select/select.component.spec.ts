import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';

@Component({
  imports: [SelectComponent],
  template: `<select ui-select [invalid]="invalid()">
    <option value="25">25 minutes</option>
    <option value="50">50 minutes</option>
  </select>`,
})
class HostComponent {
  readonly invalid = signal(false);
}

describe('SelectComponent', () => {
  it('keeps the native options and is valid by default', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const select = (fixture.nativeElement as HTMLElement).querySelector(
      'select',
    ) as HTMLSelectElement;

    expect(select.options).toHaveLength(2);
    expect(select.className).toContain('h-control-md');
    expect(select.getAttribute('aria-invalid')).toBeNull();
  });

  it('shows the danger border and aria-invalid when invalid', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.invalid.set(true);
    await fixture.whenStable();
    const select = (fixture.nativeElement as HTMLElement).querySelector(
      'select',
    ) as HTMLSelectElement;

    expect(select.className).toContain('border-danger');
    expect(select.getAttribute('aria-invalid')).toBe('true');
  });
});
