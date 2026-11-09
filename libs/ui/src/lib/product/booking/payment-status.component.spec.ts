import { TestBed } from '@angular/core/testing';
import {
  PaymentStatusComponent,
  type PaymentState,
} from './payment-status.component';

describe('PaymentStatusComponent', () => {
  async function render(status: PaymentState) {
    const fixture = TestBed.createComponent(PaymentStatusComponent);
    fixture.componentRef.setInput('status', status);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it.each([
    ['awaiting', 'Pay to confirm your booking'],
    ['processing', 'Waiting for your bank'],
    ['paid', 'Booking confirmed'],
    ['failed', 'Payment failed'],
  ] as const)('says %s in words', async (status, heading) => {
    const { root } = await render(status);

    expect(root.textContent).toContain(heading);
  });

  it('is announced as an alert only when payment failed, and offers another card', async () => {
    const paid = await render('paid');
    expect(paid.root.querySelector('[role="alert"]')).toBeNull();
    expect(paid.root.querySelector('button')).toBeNull();

    const failed = await render('failed');
    const retried = vi.fn();
    failed.fixture.componentInstance.retry.subscribe(retried);
    expect(failed.root.querySelector('[role="alert"]')).not.toBeNull();
    (failed.root.querySelector('button') as HTMLButtonElement).click();
    expect(retried).toHaveBeenCalledTimes(1);
  });
});
