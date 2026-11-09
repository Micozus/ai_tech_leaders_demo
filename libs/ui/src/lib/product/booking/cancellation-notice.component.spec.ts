import { TestBed } from '@angular/core/testing';
import { CancellationNoticeComponent } from './cancellation-notice.component';

describe('CancellationNoticeComponent', () => {
  async function render(startsAt: string, now: string) {
    const fixture = TestBed.createComponent(CancellationNoticeComponent);
    fixture.componentRef.setInput('startsAt', startsAt);
    fixture.componentRef.setInput('now', now);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).textContent as string;
  }

  it('says until when cancelling is free, when there are 24 hours or more', async () => {
    const text = await render('2026-11-06T13:00:00Z', '2026-11-04T10:00:00Z');

    expect(text).toContain('Free cancellation');
    expect(text).toMatch(/You can cancel for free until .*5 Nov.*14:00/);
  });

  it('is free at exactly 24 hours', async () => {
    expect(
      await render('2026-11-05T10:00:00Z', '2026-11-04T10:00:00Z'),
    ).toContain('Free cancellation');
  });

  it('says the fee is forfeited under 24 hours', async () => {
    const text = await render('2026-11-05T09:00:00Z', '2026-11-04T10:00:00Z');

    expect(text).toContain('Cancelling now forfeits the fee');
    expect(text).toContain('the mentor keeps the fee');
  });
});
