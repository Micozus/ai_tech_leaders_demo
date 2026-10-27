export type Role = 'mentee' | 'mentor' | 'operator';

/** The four stacks of the beachhead (R16, D24). */
export const STACK_TAGS = [
  'TypeScript',
  'React',
  'Python',
  'AI agents',
] as const;
export type StackTag = (typeof STACK_TAGS)[number];

export type SessionLength = 25 | 50;

export interface Slot {
  readonly id: string;
  /** ISO 8601, UTC. */
  readonly startsAt: string;
  readonly state: 'free' | 'booked';
}

export interface MentorSummary {
  readonly id: string;
  readonly name: string;
  readonly publicWorkUrl: string;
  readonly tags: readonly StackTag[];
  /** The lowest price, display text such as `€25.00`. */
  readonly priceFrom: string;
  /** Display text of the next free slot, if any. */
  readonly nextSlot?: string;
}

export type SessionStatus =
  'awaiting-payment' | 'booked' | 'cancelled' | 'completed';

export interface SessionSummary {
  readonly id: string;
  readonly title: string;
  readonly withName: string;
  /** Display text of the start, e.g. `Thu 14:00`. */
  readonly startsAt: string;
  readonly length: SessionLength;
  readonly status: SessionStatus;
}

export interface PriceBounds {
  readonly min25: number;
  readonly max25: number;
  readonly min50: number;
  readonly max50: number;
}

/** Hours before the start up to which cancelling is free (R09). */
export const FREE_CANCELLATION_HOURS = 24;
/** A slot must start at least this many hours after booking (R14). */
export const MIN_BOOKING_LEAD_HOURS = 2;
