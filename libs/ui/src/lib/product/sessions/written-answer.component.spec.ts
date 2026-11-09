import { TestBed } from '@angular/core/testing';
import { WrittenAnswerComponent } from './written-answer.component';

describe('WrittenAnswerComponent', () => {
  async function render(state?: 'loading' | 'empty' | 'error' | 'ready') {
    const fixture = TestBed.createComponent(WrittenAnswerComponent);
    fixture.componentRef.setInput(
      'body',
      'Constrain the parameter first.\nThen narrow it.',
    );
    if (state) fixture.componentRef.setInput('state', state);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('shows who wrote it, when, the answer and who can read it', async () => {
    const root = await render();

    expect(root.textContent).toContain('Ada Lovelace · Thu 5 Nov, 15:02');
    expect(root.textContent).toContain('Constrain the parameter first.');
    expect(root.textContent).toContain(
      'Only you and the mentor can read this.',
    );
  });

  it('shows the other data states', async () => {
    expect((await render('empty')).textContent).toContain(
      'The answer is not ready yet',
    );
    expect(
      (await render('loading')).querySelector('[aria-busy="true"]'),
    ).not.toBeNull();
    expect(
      (await render('error')).querySelector('[role="alert"]'),
    ).not.toBeNull();
  });
});
