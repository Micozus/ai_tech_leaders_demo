import { TestBed } from '@angular/core/testing';
import { DisputeRecordFormComponent } from './dispute-record-form.component';

describe('DisputeRecordFormComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(DisputeRecordFormComponent);
    const recorded = vi.fn();
    fixture.componentInstance.recorded.subscribe(recorded);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const submit = async () => {
      (root.querySelector('form') as HTMLFormElement).dispatchEvent(
        new Event('submit', { cancelable: true }),
      );
      await fixture.whenStable();
    };
    return { root, recorded, submit };
  }

  it('offers three outcomes, none of them an automatic refund', async () => {
    const { root } = await render();

    expect(root.querySelectorAll('input[type="radio"]')).toHaveLength(3);
    expect(root.textContent).toContain('Refund paid by hand');
    expect(root.textContent).not.toContain('Automatic');
  });

  it('needs notes before it records', async () => {
    const { root, recorded, submit } = await render();
    await submit();

    expect(root.querySelector('#dr-notes-error')?.textContent).toContain(
      'Write what you decided and why.',
    );
    expect(recorded).not.toHaveBeenCalled();
  });

  it('records the chosen outcome with the notes', async () => {
    const { root, recorded, submit } = await render();
    (
      root.querySelectorAll('input[type="radio"]')[0] as HTMLInputElement
    ).click();
    (
      root.querySelectorAll('input[type="radio"]')[1] as HTMLInputElement
    ).click();
    (
      root.querySelectorAll('input[type="radio"]')[2] as HTMLInputElement
    ).click();
    const notes = root.querySelector('#dr-notes') as HTMLTextAreaElement;
    notes.value = ' Answer did not match the problem. ';
    notes.dispatchEvent(new Event('input'));
    await submit();

    expect(recorded).toHaveBeenCalledWith({
      outcome: 'mentor-asked-to-redo',
      notes: 'Answer did not match the problem.',
    });
  });
});
