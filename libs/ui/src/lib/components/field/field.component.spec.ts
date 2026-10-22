import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FieldComponent } from './field.component';

@Component({
  imports: [FieldComponent],
  template: `
    <ui-field
      label="Email"
      controlId="email"
      [hint]="hint()"
      [error]="error()"
      [optional]="optional()"
    >
      <input id="email" />
    </ui-field>
  `,
})
class HostComponent {
  readonly hint = signal('');
  readonly error = signal('');
  readonly optional = signal(false);
}

describe('FieldComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(HostComponent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    return {
      fixture,
      root,
      input: root.querySelector('#email') as HTMLInputElement,
    };
  }

  it('links the label to the control and shows nothing extra by default', async () => {
    const { root, input } = await render();

    expect(root.querySelector('label')?.getAttribute('for')).toBe('email');
    expect(root.querySelector('label')?.textContent?.trim()).toBe('Email');
    expect(root.querySelector('#email-hint')).toBeNull();
    expect(root.querySelector('#email-error')).toBeNull();
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });

  it('marks only optional fields', async () => {
    const { fixture, root } = await render();
    fixture.componentInstance.optional.set(true);
    await fixture.whenStable();

    expect(root.querySelector('label')?.textContent).toContain('(Optional)');
  });

  it('shows the hint and error and describes the control with them', async () => {
    const { fixture, root, input } = await render();
    fixture.componentInstance.hint.set('We never share it');
    fixture.componentInstance.error.set('Enter a valid email');
    await fixture.whenStable();

    expect(root.querySelector('#email-hint')?.textContent?.trim()).toBe(
      'We never share it',
    );
    const error = root.querySelector('#email-error');
    expect(error?.textContent).toContain('Enter a valid email');
    expect(error?.getAttribute('role')).toBe('alert');
    expect(error?.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(
      'email-hint email-error',
    );
  });

  it('removes aria-describedby again when hint and error go away', async () => {
    const { fixture, input } = await render();
    fixture.componentInstance.error.set('Enter a valid email');
    await fixture.whenStable();
    expect(input.getAttribute('aria-describedby')).toBe('email-error');

    fixture.componentInstance.error.set('');
    await fixture.whenStable();
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });

  it('does nothing when no control carries the controlId', async () => {
    @Component({
      imports: [FieldComponent],
      template: `<ui-field label="Email" controlId="missing" error="Bad"
        ><input id="other"
      /></ui-field>`,
    })
    class OrphanComponent {}
    const fixture = TestBed.createComponent(OrphanComponent);
    await fixture.whenStable();

    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('#other')
        ?.getAttribute('aria-describedby'),
    ).toBeNull();
  });
});
