import { TestBed } from '@angular/core/testing';
import { NOTE_MIN_LENGTH, NoteDraftComponent } from './note-draft.component';

const LONG = 'x'.repeat(NOTE_MIN_LENGTH);

describe('NoteDraftComponent', () => {
  async function render(initial = '', menteeComment = '') {
    const fixture = TestBed.createComponent(NoteDraftComponent);
    fixture.componentRef.setInput('initial', initial);
    fixture.componentRef.setInput('menteeComment', menteeComment);
    const sent = vi.fn();
    fixture.componentInstance.sent.subscribe(sent);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const submit = async () => {
      (root.querySelector('form') as HTMLFormElement).dispatchEvent(
        new Event('submit', { cancelable: true }),
      );
      await fixture.whenStable();
    };
    return { root, sent, submit };
  }

  it('starts from the given draft and shows the mentee comment when there is one', async () => {
    const { root } = await render('Old draft', 'Please add the constraint.');

    expect((root.querySelector('textarea') as HTMLTextAreaElement).value).toBe(
      'Old draft',
    );
    expect(root.textContent).toContain('The mentee asked for changes');
    expect(root.textContent).toContain('Please add the constraint.');
  });

  it('asks for a useful note before it can be sent', async () => {
    const { root, sent, submit } = await render();
    await submit();

    expect(root.querySelector('#nd-note-error')?.textContent).toContain(
      `at least ${NOTE_MIN_LENGTH} characters`,
    );
    expect(sent).not.toHaveBeenCalled();
  });

  it('sends a long enough note for approval', async () => {
    const { root, sent, submit } = await render();
    const area = root.querySelector('textarea') as HTMLTextAreaElement;
    area.value = ` ${LONG} `;
    area.dispatchEvent(new Event('input'));
    await submit();

    expect(sent).toHaveBeenCalledWith(LONG);
  });
});
