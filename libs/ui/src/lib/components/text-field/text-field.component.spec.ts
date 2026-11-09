import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TextFieldComponent } from './text-field.component';

@Component({
  imports: [TextFieldComponent],
  template: `<input ui-text-field [invalid]="invalid()" />`,
})
class HostComponent {
  readonly invalid = signal(false);
}

describe('TextFieldComponent', () => {
  it('is a 40px-high native input, valid by default', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input',
    ) as HTMLInputElement;

    expect(input.className).toContain('h-control-md');
    expect(input.className).toContain('border-border-control');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('shows the danger border and aria-invalid when invalid', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.invalid.set(true);
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input',
    ) as HTMLInputElement;

    expect(input.className).toContain('border-danger');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
