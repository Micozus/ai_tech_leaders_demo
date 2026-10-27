import { formatMoney, formatSlot, hoursUntil } from './format.helper';

describe('format helpers', () => {
  it('formats money in euro with two decimals', () => {
    expect(formatMoney(45)).toBe('€45.00');
    expect(formatMoney(12.5)).toBe('€12.50');
  });

  it('formats a slot in the given time zone', () => {
    expect(formatSlot('2026-11-05T13:00:00Z', 'Europe/Warsaw')).toContain(
      '14:00',
    );
    expect(formatSlot('2026-11-05T13:00:00Z', 'UTC')).toContain('13:00');
  });

  it('counts the hours until a start', () => {
    expect(hoursUntil('2026-11-05T14:00:00Z', '2026-11-04T14:00:00Z')).toBe(24);
    expect(hoursUntil('2026-11-05T14:00:00Z', '2026-11-05T15:30:00Z')).toBe(
      -1.5,
    );
  });
});
