import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TextareaComponent } from './textarea.component';

@Component({
  imports: [TextareaComponent],
  template: `<textarea ui-textarea [invalid]="invalid()"></textarea>`,
})
class HostComponent {
  readonly invalid = signal(false);
}

describe('TextareaComponent', () => {
  it('is a resizable native textarea, valid by default', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const area = (fixture.nativeElement as HTMLElement).querySelector(
      'textarea',
    ) as HTMLTextAreaElement;

    expect(area.className).toContain('min-h-control-md');
    expect(area.className).toContain('resize-y');
    expect(area.getAttribute('aria-invalid')).toBeNull();
  });

  it('shows the danger border and aria-invalid when invalid', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.invalid.set(true);
    await fixture.whenStable();
    const area = (fixture.nativeElement as HTMLElement).querySelector(
      'textarea',
    ) as HTMLTextAreaElement;

    expect(area.className).toContain('border-danger');
    expect(area.getAttribute('aria-invalid')).toBe('true');
  });
});
