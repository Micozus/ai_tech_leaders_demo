import { TestBed } from '@angular/core/testing';
import { FormValue } from '../../models/form-config.model';
import { FormRendererComponent } from './form-renderer.component';

describe('FormRendererComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(FormRendererComponent);
    fixture.componentRef.setInput('config', {
      submitLabel: 'Add',
      fields: [{ key: 'title', label: 'Title', required: true }],
    });
    const emitted: FormValue[] = [];
    fixture.componentInstance.submitted.subscribe((v) => emitted.push(v));
    await fixture.whenStable();
    return { fixture, emitted, element: fixture.nativeElement as HTMLElement };
  }

  it('emits trimmed values on submit and resets the form', async () => {
    const { fixture, emitted, element } = await setup();
    const input = element.querySelector<HTMLInputElement>(
      '[data-testid="field-title"]',
    )!;
    input.value = '  Write docs ';
    input.dispatchEvent(new Event('input'));
    element
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();

    expect(emitted).toEqual([{ title: 'Write docs' }]);
    expect(input.value).toBe('');
  });

  it('does not emit when a required field is empty', async () => {
    const { fixture, emitted, element } = await setup();
    element
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();

    expect(emitted).toEqual([]);
  });
});
