import { TestBed } from '@angular/core/testing';
import { FieldComponent } from './field.component';

describe('FieldComponent', () => {
  it('links the label to the control and shows hint and error only when given', async () => {
    const fixture = TestBed.createComponent(FieldComponent);
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('controlId', 'email');
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('label')?.getAttribute('for')).toBe('email');
    expect(root.querySelector('label')?.textContent).toBe('Email');
    expect(root.querySelector('#email-hint')).toBeNull();
    expect(root.querySelector('#email-error')).toBeNull();

    fixture.componentRef.setInput('hint', 'We never share it');
    fixture.componentRef.setInput('error', 'Enter a valid email');
    await fixture.whenStable();

    expect(root.querySelector('#email-hint')?.textContent?.trim()).toBe(
      'We never share it',
    );
    const error = root.querySelector('#email-error');
    expect(error?.textContent?.trim()).toBe('Enter a valid email');
    expect(error?.getAttribute('role')).toBe('alert');
  });
});
