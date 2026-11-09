/**
 * Documentation sample data: invented but realistic, taken from the brief and the specs
 * (stacks of the beachhead, 25 and 50 minute sessions, EUR prices, the two-hour and 24-hour rules).
 * No real people, no ratings, no counts of customers.
 */
import type {
  MentorSummary,
  SessionSummary,
  Slot,
} from '../../src/lib/product/models/product.model';

export const NOW = '2026-11-04T10:00:00Z';

export const MENTORS: readonly MentorSummary[] = [
  {
    id: 'm1',
    name: 'Ada Lovelace',
    publicWorkUrl: 'https://github.com/ada/typed-queries',
    tags: ['TypeScript', 'React'],
    priceFrom: '€25.00',
    nextSlot: 'Thu 5 Nov, 14:00',
  },
  {
    id: 'm2',
    name: 'Grace Hopper',
    publicWorkUrl: 'https://github.com/grace/agent-evals',
    tags: ['Python', 'AI agents'],
    priceFrom: '€30.00',
    nextSlot: 'Fri 6 Nov, 09:00',
  },
  {
    id: 'm3',
    name: 'Linus Torvalds',
    publicWorkUrl: 'https://github.com/linus/kernel-notes',
    tags: ['Python'],
    priceFrom: '€40.00',
  },
];

export const MANY_MENTORS: readonly MentorSummary[] = Array.from(
  { length: 30 },
  (_, i) => ({
    ...MENTORS[i % MENTORS.length],
    id: `m${i}`,
    nextSlot: i % 3 === 2 ? undefined : MENTORS[i % MENTORS.length].nextSlot,
  }),
);

export const SLOTS: readonly Slot[] = [
  { id: 'soon', startsAt: '2026-11-04T11:00:00Z', state: 'free' },
  { id: 'booked', startsAt: '2026-11-05T13:00:00Z', state: 'booked' },
  { id: 'thu', startsAt: '2026-11-05T15:00:00Z', state: 'free' },
  { id: 'fri', startsAt: '2026-11-06T09:00:00Z', state: 'free' },
];

export const SESSIONS: readonly SessionSummary[] = [
  {
    id: 's1',
    title: 'Architecture review of the billing service',
    withName: 'Ada Lovelace',
    startsAt: 'Thu 5 Nov, 14:00',
    length: 50,
    status: 'booked',
  },
  {
    id: 's2',
    title: 'TypeScript generics error before release',
    withName: 'Grace Hopper',
    startsAt: 'Fri 6 Nov, 09:00',
    length: 25,
    status: 'awaiting-payment',
  },
  {
    id: 's3',
    title: 'Agent configuration for the support bot',
    withName: 'Linus Torvalds',
    startsAt: 'Tue 27 Oct, 16:00',
    length: 50,
    status: 'completed',
  },
];
