import { TestBed } from '@angular/core/testing';
import type { SessionSummary } from '../models/product.model';
import { SessionRowComponent } from './session-row.component';

const SESSION: SessionSummary = {
  id: 's1',
  title: 'Architecture review',
  withName: 'Ada Lovelace',
  startsAt: 'Thu 14:00',
  length: 50,
  status: 'booked',
};

describe('SessionRowComponent', () => {
  async function render(session: SessionSummary) {
    const fixture = TestBed.createComponent(SessionRowComponent);
    fixture.componentRef.setInput('session', session);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('shows the session, its status in words, and both actions when booked', async () => {
    const { fixture, root } = await render(SESSION);
    const opened = vi.fn();
    const cancelled = vi.fn();
    fixture.componentInstance.openSession.subscribe(opened);
    fixture.componentInstance.cancelBooking.subscribe(cancelled);
    const [open, cancel] = Array.from(root.querySelectorAll('button'));
    open.click();
    cancel.click();

    expect(root.textContent).toContain('Architecture review');
    expect(root.textContent).toContain('Ada Lovelace · Thu 14:00 · 50 minutes');
    expect(root.textContent).toContain('Booked');
    expect(opened).toHaveBeenCalledWith('s1');
    expect(cancelled).toHaveBeenCalledWith('s1');
  });

  it.each([
    ['awaiting-payment', 'Awaiting payment'],
    ['cancelled', 'Cancelled'],
    ['completed', 'Completed'],
  ] as const)('shows %s without a cancel action', async (status, label) => {
    const { root } = await render({ ...SESSION, status });

    expect(root.textContent).toContain(label);
    expect(root.querySelectorAll('button')).toHaveLength(1);
  });
});
