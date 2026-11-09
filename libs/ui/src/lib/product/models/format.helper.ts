const MONEY = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
});

/** `45` becomes `€45.00`. Currency is EUR in 1.0 (assumption of the mentors-bookable spec). */
export function formatMoney(amount: number): string {
  return MONEY.format(amount);
}

/** `2026-11-05T14:00:00Z` becomes `Thu 5 Nov, 14:00` in the given IANA time zone. */
export function formatSlot(startsAt: string, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  })
    .format(new Date(startsAt))
    .replace(',', ',');
}

export function hoursUntil(startsAt: string, now: string): number {
  return (new Date(startsAt).getTime() - new Date(now).getTime()) / 3_600_000;
}
