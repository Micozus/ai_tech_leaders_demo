import { TestBed } from '@angular/core/testing';
import { NoteApprovalComponent } from './note-approval.component';

describe('NoteApprovalComponent', () => {
  async function render() {
    const fixture = TestBed.createComponent(NoteApprovalComponent);
    fixture.componentRef.setInput('note', 'Constrain the parameter first.');
    const approved = vi.fn();
    const declined = vi.fn();
    fixture.componentInstance.approved.subscribe(approved);
    fixture.componentInstance.declined.subscribe(declined);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const submit = async () => {
      (root.querySelector('form') as HTMLFormElement).dispatchEvent(
        new Event('submit', { cancelable: true }),
      );
      await fixture.whenStable();
    };
    const choose = async (index: number) => {
      (
        root.querySelectorAll('input[type="radio"]')[index] as HTMLInputElement
      ).click();
      await fixture.whenStable();
    };
    return { root, approved, declined, submit, choose };
  }

  it('shows the note and approves it in full by default, saying nothing is published', async () => {
    const { root, approved, submit } = await render();
    await submit();

    expect(root.textContent).toContain('Constrain the parameter first.');
    expect(root.textContent).toContain('nothing is published');
    expect(approved).toHaveBeenCalledTimes(1);
  });

  it('needs a comment to decline, then sends it', async () => {
    const { root, declined, submit, choose } = await render();
    await choose(1);
    await submit();
    expect(root.querySelector('#na-comment-error')?.textContent).toContain(
      'Say what to change',
    );
    expect(declined).not.toHaveBeenCalled();

    const area = root.querySelector('#na-comment') as HTMLTextAreaElement;
    area.value = '  Add the constraint.  ';
    area.dispatchEvent(new Event('input'));
    await submit();
    expect(declined).toHaveBeenCalledWith('Add the constraint.');
    expect(
      root.querySelector('button[type="submit"]')?.textContent?.trim(),
    ).toBe('Send comment');
  });

  it('can switch back to approving', async () => {
    const { root, choose } = await render();
    await choose(1);
    await choose(0);

    expect(root.querySelector('#na-comment')).toBeNull();
    expect(
      root.querySelector('button[type="submit"]')?.textContent?.trim(),
    ).toBe('Approve note');
  });
});
