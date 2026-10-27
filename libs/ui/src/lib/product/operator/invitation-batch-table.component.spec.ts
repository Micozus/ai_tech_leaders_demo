import { TestBed } from '@angular/core/testing';
import {
  InvitationBatchTableComponent,
  type InvitationRow,
} from './invitation-batch-table.component';

const ROWS: readonly InvitationRow[] = [
  { email: 'ada@example.com', status: 'published' },
  { email: 'grace@example.com', status: 'accepted' },
  { email: 'linus@example.com', status: 'invited' },
];

describe('InvitationBatchTableComponent', () => {
  async function render(state?: 'loading' | 'empty' | 'error' | 'ready') {
    const fixture = TestBed.createComponent(InvitationBatchTableComponent);
    fixture.componentRef.setInput('rows', ROWS);
    if (state) fixture.componentRef.setInput('state', state);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('is a table with a caption that counts who published a slot, and a status word per row', async () => {
    const root = await render();

    expect(root.querySelector('caption')?.textContent).toContain(
      '1 of 3 published a slot',
    );
    expect(root.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(root.textContent).toContain('Published a slot');
    expect(root.textContent).toContain('Accepted, no slot yet');
    expect(root.textContent).toContain('Invited');
    expect(root.querySelectorAll('th[scope="col"]')).toHaveLength(2);
  });

  it('shows the other data states', async () => {
    expect((await render('empty')).textContent).toContain(
      'No invitations in this batch',
    );
    expect(
      (await render('loading')).querySelector('[aria-busy="true"]'),
    ).not.toBeNull();
    expect(
      (await render('error')).querySelector('[role="alert"]'),
    ).not.toBeNull();
  });
});
