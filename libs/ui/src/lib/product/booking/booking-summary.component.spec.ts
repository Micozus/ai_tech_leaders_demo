import { TestBed } from '@angular/core/testing';
import { BookingSummaryComponent } from './booking-summary.component';

describe('BookingSummaryComponent', () => {
  it('lists mentor, time, length (text only) and the total', async () => {
    const fixture = TestBed.createComponent(BookingSummaryComponent);
    fixture.componentRef.setInput('mentorName', 'Ada Lovelace');
    fixture.componentRef.setInput('when', 'Thu 5 Nov, 14:00');
    fixture.componentRef.setInput('length', 50);
    fixture.componentRef.setInput('price', 45);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Ada Lovelace');
    expect(root.textContent).toContain('Thu 5 Nov, 14:00');
    expect(root.textContent).toContain('50 minutes, text only');
    expect(root.textContent).toContain('€45.00');
  });
});
