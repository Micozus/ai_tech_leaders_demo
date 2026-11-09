import { TestBed } from '@angular/core/testing';
import {
  PayoutStatusComponent,
  type PayoutState,
} from './payout-status.component';

describe('PayoutStatusComponent', () => {
  async function render(status: PayoutState) {
    const fixture = TestBed.createComponent(PayoutStatusComponent);
    fixture.componentRef.setInput('status', status);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it.each([
    ['not-started', 'Payouts not set up', 'Set up payouts'],
    ['pending', 'Payouts pending', 'Continue setup'],
    ['enabled', 'Payouts enabled', 'View payout settings'],
    ['restricted', 'Payouts restricted', 'Fix payout details'],
  ] as const)(
    'says %s in words and offers the next step',
    async (status, label, action) => {
      const { root } = await render(status);

      expect(root.textContent).toContain(label);
      expect(root.querySelector('button')?.textContent?.trim()).toBe(action);
    },
  );

  it('uses the main action unless payouts already work, and reports the click', async () => {
    const pending = await render('pending');
    const acted = vi.fn();
    pending.fixture.componentInstance.act.subscribe(acted);
    (pending.root.querySelector('button') as HTMLButtonElement).click();
    expect(pending.root.querySelector('button')?.className).toContain(
      'bg-accent',
    );
    expect(acted).toHaveBeenCalledTimes(1);

    const enabled = await render('enabled');
    expect(enabled.root.querySelector('button')?.className).toContain(
      'bg-surface',
    );
  });
});
