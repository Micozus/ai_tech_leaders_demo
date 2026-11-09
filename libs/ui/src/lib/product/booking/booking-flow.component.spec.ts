import { TestBed } from '@angular/core/testing';
import type { SubmitOutcome } from '../../helpers/submit-outcome.helper';
import type { Slot } from '../models/product.model';
import { BookingFlowComponent } from './booking-flow.component';

const SLOTS: readonly Slot[] = [
  { id: 'soon', startsAt: '2026-11-04T11:00:00Z', state: 'free' },
  { id: 'thu', startsAt: '2026-11-05T15:00:00Z', state: 'free' },
];

describe('BookingFlowComponent', () => {
  async function render(outcome: SubmitOutcome = { kind: 'ok' }) {
    const fixture = TestBed.createComponent(BookingFlowComponent);
    const payer = vi.fn(async () => outcome);
    fixture.componentRef.setInput('mentorName', 'Ada Lovelace');
    fixture.componentRef.setInput('slots', SLOTS);
    fixture.componentRef.setInput('now', '2026-11-04T10:00:00Z');
    fixture.componentRef.setInput('price25', 25);
    fixture.componentRef.setInput('price50', 45);
    fixture.componentRef.setInput('payer', payer);
    const confirmed = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const button = (name: string) =>
      Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent?.includes(name),
      ) as HTMLButtonElement;
    const click = async (name: string) => {
      button(name).click();
      await fixture.whenStable();
    };
    const pickThursday = async () => {
      (
        root.querySelectorAll('input[name="sp-slot"]')[1] as HTMLInputElement
      ).click();
      await fixture.whenStable();
    };
    return { fixture, root, payer, confirmed, button, click, pickThursday };
  }

  it('starts at step 1 and cannot continue without a slot, saying why', async () => {
    const { root, button } = await render();

    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Step 1 of 3: choose a slot',
    );
    expect(button('Continue to payment').disabled).toBe(true);
    expect(root.textContent).toContain('Choose a slot first.');
  });

  it('moves to payment with a summary and the cancellation rule for the chosen slot', async () => {
    const { root, click, pickThursday } = await render();
    await pickThursday();
    await click('Continue to payment');

    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Step 2 of 3: pay',
    );
    expect(root.textContent).toContain('Ada Lovelace');
    expect(root.textContent).toContain('50 minutes, text only');
    expect(root.textContent).toContain('Free cancellation');
    expect(root.textContent).toContain('Pay €45.00');
  });

  it('prices the 25 minute session and can go back to change the slot', async () => {
    const { root, click, pickThursday } = await render();
    (
      root.querySelectorAll('input[name="sp-length"]')[0] as HTMLInputElement
    ).click();
    await pickThursday();
    await click('Continue to payment');
    expect(root.textContent).toContain('Pay €25.00');

    await click('Change slot');
    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Step 1 of 3',
    );
  });

  it('confirms only after the payment succeeds', async () => {
    const { root, payer, confirmed, click, pickThursday } = await render();
    await pickThursday();
    await click('Continue to payment');
    await click('Pay €45.00');

    expect(payer).toHaveBeenCalledTimes(1);
    expect(confirmed).toHaveBeenCalledTimes(1);
    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Step 3 of 3: confirmed',
    );
    expect(root.textContent).toContain('Booking confirmed');
  });

  it('stays on payment with a retry when the payment fails', async () => {
    const { root, confirmed, click, pickThursday } = await render({
      kind: 'server-error',
    });
    await pickThursday();
    await click('Continue to payment');
    await click('Pay €45.00');

    expect(confirmed).not.toHaveBeenCalled();
    expect(root.textContent).toContain('Payment failed');
    expect(root.querySelector('[role="status"]')?.textContent).toContain(
      'Step 2 of 3',
    );
    await click('Try another card');
    expect(root.textContent).toContain('Payment failed');
  });

  it('shows the processing state while the payment is in flight', async () => {
    const fixture = TestBed.createComponent(BookingFlowComponent);
    let release: (outcome: SubmitOutcome) => void = () => undefined;
    fixture.componentRef.setInput('mentorName', 'Ada Lovelace');
    fixture.componentRef.setInput('slots', SLOTS);
    fixture.componentRef.setInput('now', '2026-11-04T10:00:00Z');
    fixture.componentRef.setInput('price25', 25);
    fixture.componentRef.setInput('price50', 45);
    fixture.componentRef.setInput(
      'payer',
      () => new Promise<SubmitOutcome>((resolve) => (release = resolve)),
    );
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    (
      root.querySelectorAll('input[name="sp-slot"]')[1] as HTMLInputElement
    ).click();
    await fixture.whenStable();
    (
      Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Continue'),
      ) as HTMLButtonElement
    ).click();
    await fixture.whenStable();
    (
      Array.from(root.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Pay'),
      ) as HTMLButtonElement
    ).click();
    await fixture.whenStable();

    expect(root.textContent).toContain('Waiting for your bank');
    release({ kind: 'ok' });
    await new Promise((resolve) => setTimeout(resolve));
    await fixture.whenStable();
    expect(root.textContent).toContain('Booking confirmed');
  });
});
